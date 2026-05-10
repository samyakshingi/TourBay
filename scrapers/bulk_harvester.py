import os
import asyncio
from dotenv import load_dotenv
load_dotenv()
from typing import Optional, Dict
from pydantic import BaseModel, Field
from crawl4ai import AsyncWebCrawler
from google import genai
from google.genai import types
from supabase import create_client, Client

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

async def extract_markdown(url: str) -> str:
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)
        return result.markdown

def parse_with_gemini(markdown_content: str, url: str) -> Optional[TourPackage]:
    client = genai.Client()
    
    prompt = f"""
    You are a travel data expert. Extract the following tour package details from the provided markdown content.
    If you cannot find a price, look for strings like 'Starting from', 'Ex-Hub', or 'Price on Request'. 
    If the price is 'null', provide a reason in the logs (just format the JSON as best as you can, but duration_days and price_inr MUST be present).
    Ensure price_inr is the final, per-person total. If the price is per-couple, divide by 2.
    Inclusions must be strict boolean flags. Extract provider_name from the URL or content.
    
    The package URL is: {url}
    
    Markdown Content:
    {markdown_content[:30000]} # Limit to avoid context length issues if any
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
        "https://www.veenaworld.com/package/magical-kashmir-tour-package-haqm",
        "https://www.thrillophilia.com/tours/leh-ladakh-tour-packages",
        "https://www.thrillophilia.com/tours/manali-tour-packages",
        "https://www.thrillophilia.com/tours/kashmir-tour-packages",
        "https://www.veenaworld.com/package/shimla-manali-tour-package-shms"
    ]
    
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Supabase credentials not found in environment variables. Skipping DB insert.")
        return
        
    supabase: Client = create_client(supabase_url, supabase_key)
    
    for url in urls:
        print(f"Scraping URL: {url}")
        try:
            markdown_content = await extract_markdown(url)
            if not markdown_content:
                print(f"No content extracted for {url}")
                continue
                
            parsed_package = parse_with_gemini(markdown_content, url)
            if not parsed_package:
                print(f"Failed to parse or missing required fields for {url}.")
                continue
                
            data = parsed_package.model_dump()
            
            response = supabase.table("packages").insert(data).execute()
            print(f"[SUCCESS] Captured {parsed_package.package_title} at {parsed_package.price_inr} INR.")
            
        except Exception as e:
            print(f"Failed processing {url}: {e}")

if __name__ == "__main__":
    asyncio.run(main())
