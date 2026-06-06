import os
import asyncio
import random
from dotenv import load_dotenv
load_dotenv()
from typing import Optional, Dict
from pydantic import BaseModel, Field
from crawl4ai import AsyncWebCrawler
from google import genai
from google.genai import types
from supabase import create_client, Client
from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

class Inclusions(BaseModel):
    flights: bool = False
    hotels: bool = False
    meals: bool = False
    transfers: bool = False
    sightseeing: bool = False

class TourPackage(BaseModel):
    provider_name: str
    destination_region: Optional[str] = None
    package_title: str
    duration_days: int
    duration_nights: Optional[int] = None
    price_inr: float = Field(description="Final price per person in INR, including all taxes.")
    inclusions: Inclusions
    theme: Optional[str] = None
    package_url: str
    image_url: Optional[str] = None

def generate_affiliate_link(url: str) -> str:
    """
    Appends affiliate/tracking query parameters to the tour URL.
    """
    if not url:
        return url
    try:
        parsed = urlparse(url)
        query_params = dict(parse_qsl(parsed.query))
        query_params['utm_source'] = 'tourbay.in'
        query_params['utm_medium'] = 'aggregator'
        query_params['utm_campaign'] = 'himalayan_escape'
        new_query = urlencode(query_params)
        return urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.params,
            new_query,
            parsed.fragment
        ))
    except Exception as e:
        print(f"Error generating affiliate link for {url}: {e}")
        return url

async def scrape_with_playwright_stealth(url: str) -> str:
    """
    Headed Playwright crawler with randomized viewports, human user-agent,
    web-driver spoofing, and dynamic scroll delays to bypass Akamai/Cloudflare.
    """
    print(f"[STEALTH PLAYWRIGHT] Initiating browser session for: {url}")
    async with async_playwright() as p:
        # Randomized viewports
        width = random.choice([1366, 1440, 1920])
        height = random.choice([768, 900, 1080])
        
        # User Agents
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
        ]
        user_agent = random.choice(user_agents)
        
        browser = await p.chromium.launch(
            headless=False,  # Headed browser context as requested
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        )
        
        context = await browser.new_context(
            viewport={"width": width, "height": height},
            user_agent=user_agent,
            locale="en-US",
            timezone_id="Asia/Kolkata"
        )
        
        page = await context.new_page()
        
        # Spoof navigator.webdriver
        await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        # Navigate to target
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Dynamic scroll delays to mimic human reading speed
        await asyncio.sleep(random.uniform(3, 5))
        
        # Execute human-like scrolling
        for _ in range(3):
            scroll_amount = random.randint(400, 800)
            await page.evaluate(f"window.scrollBy(0, {scroll_amount})")
            await asyncio.sleep(random.uniform(1.5, 3.5))
            
        await asyncio.sleep(random.uniform(2, 4))
        
        # Fetch page HTML and clean up DOM tags using BeautifulSoup
        html_content = await page.content()
        await browser.close()
        
        soup = BeautifulSoup(html_content, 'html.parser')
        for element in soup(["script", "style", "noscript", "iframe", "svg"]):
            element.decompose()
            
        text_content = soup.get_text(separator="\n", strip=True)
        print(f"[STEALTH PLAYWRIGHT] Extracted clean text payload ({len(text_content)} chars)")
        return text_content

async def get_page_content(url: str) -> str:
    """
    Main extraction router: tries Crawl4AI first, falls back to Playwright on block or empty DOM.
    """
    try:
        print(f"[CRAWL4AI] Scraping: {url}")
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(url=url, delay_before_return_html=3.0)
            if result.success and result.status_code == 200 and result.markdown and "cloudflare" not in result.markdown.lower() and "access denied" not in result.markdown.lower():
                print(f"[CRAWL4AI] Success for: {url}")
                return result.markdown
            else:
                print(f"[CRAWL4AI] Blocked or empty page content (Status: {result.status_code}). Falling back to Stealth Playwright...")
    except Exception as e:
        print(f"[CRAWL4AI] Error occurred: {e}. Falling back to Stealth Playwright...")
        
    try:
        content = await scrape_with_playwright_stealth(url)
        return content
    except Exception as e:
        print(f"[STEALTH PLAYWRIGHT] Error occurred: {e}")
        return ""

def parse_with_gemini(markdown_content: str, url: str) -> Optional[TourPackage]:
    client = genai.Client()
    
    prompt = f"""
    You are a travel data expert. Extract the details of the primary featured tour package or the first package listed in the main body from the provided content.
    
    If you cannot find a price, look for strings like 'Starting from', 'Ex-Hub', or 'Price on Request'. 
    If the price is 'null' or missing, use a logical estimate or look closely. We MUST have duration_days and price_inr.
    Ensure price_inr is the final, per-person total in INR (rupees). If the price is per-couple, divide by 2.
    Inclusions must be strict boolean flags. Extract provider_name from the URL or content. If from MakeMyTrip, provider_name should be "MakeMyTrip".
    If from Thrillophilia, provider_name should be "Thrillophilia". If from Veena World, provider_name should be "Veena World".

    STRICT CONTEXTUAL BOUNDARIES:
    You are extracting data for NORTH INDIA / HIMALAYAN region only. Ignore any footer ads, cross-promotions, or 'Similar Tours' sections that mention international destinations (like Iceland or Europe). Focus ONLY on the primary package featured in the main body of the page.
    
    The package URL is: {url}
    
    Page Content:
    {markdown_content[:35000]}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=TourPackage,
            ),
        )
        return TourPackage.model_validate_json(response.text)
    except Exception as e:
        print(f"Error parsing {url}: {e}")
        return None

async def main():
    urls = [
        # Veena World
        "https://www.veenaworld.com/package/magical-kashmir-tour-package-haqm",
        "https://www.veenaworld.com/package/shimla-manali-tour-package-shms",
        # Thrillophilia
        "https://www.thrillophilia.com/tours/leh-ladakh-tour-packages",
        "https://www.thrillophilia.com/tours/manali-tour-packages",
        "https://www.thrillophilia.com/tours/kashmir-tour-packages",
        # MakeMyTrip (MMT)
        "https://www.makemytrip.com/holidays-india/kashmir-travel-packages.html",
        "https://www.makemytrip.com/holidays-india/leh-ladakh-travel-packages.html",
        "https://www.makemytrip.com/holidays-india/srinagar-travel-packages.html",
        "https://www.makemytrip.com/holidays-india/spiti_valley-travel-packages.html",
        "https://www.makemytrip.com/holidays-india/manali-travel-packages.html"
    ]
    
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Supabase credentials not found in environment variables. Skipping DB insert.")
        return
        
    supabase: Client = create_client(supabase_url, supabase_key)
    
    for url in urls:
        print(f"\nProcessing URL: {url}")
        try:
            content = await get_page_content(url)
            if not content:
                print(f"No content extracted for {url}")
                continue
                
            parsed_package = parse_with_gemini(content, url)
            if not parsed_package:
                print(f"Failed to parse or missing required fields for {url}.")
                continue
            
            # Resolve package URL and generate tracked link
            if not parsed_package.package_url or parsed_package.package_url.startswith("/"):
                parsed_package.package_url = url
                
            parsed_package.package_url = generate_affiliate_link(parsed_package.package_url)
            
            data = parsed_package.model_dump()
            
            response = supabase.table("packages").insert(data).execute()
            print(f"[SUCCESS] Captured {parsed_package.package_title} from {parsed_package.provider_name} at {parsed_package.price_inr} INR.")
            print(f"  Link: {parsed_package.package_url}")
            
        except Exception as e:
            print(f"Failed processing {url}: {e}")

if __name__ == "__main__":
    asyncio.run(main())
