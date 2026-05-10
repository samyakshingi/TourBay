import os
import asyncio
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
    provider_name: str = "Veena World"
    destination_region: Optional[str] = None
    package_title: str
    duration_days: Optional[int] = None
    duration_nights: Optional[int] = None
    price_inr: Optional[float] = Field(description="Final price per person in INR, including all taxes. If the price is per couple, divide by 2.")
    inclusions: Inclusions
    theme: Optional[str] = None
    package_url: str
    image_url: Optional[str] = None

async def extract_markdown(url: str) -> str:
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=url)
        return result.markdown

def parse_with_gemini(markdown_content: str, url: str) -> TourPackage:
    # Assumes GEMINI_API_KEY is in environment variables
    client = genai.Client()
    
    prompt = f"""
    You are an expert travel data extractor.
    Extract the following tour package details from the provided markdown content.
    Ensure price_inr is the final, per-person total. If the price is per-couple, divide by 2.
    Inclusions must be strict boolean flags.
    
    The package URL is: {url}
    
    Markdown Content:
    {markdown_content}
    """
    
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=TourPackage,
        ),
    )
    
    return TourPackage.model_validate_json(response.text)

async def main():
    url = "https://www.veenaworld.com/package/magical-kashmir-tour-package-haqm"
    print(f"Scraping URL: {url}")
    
    try:
        markdown_content = await extract_markdown(url)
        print("Successfully extracted markdown via Crawl4AI.")
    except Exception as e:
        print(f"Failed to scrape using Crawl4AI: {e}")
        return

    try:
        parsed_package = parse_with_gemini(markdown_content, url)
        print("\nSuccessfully parsed data with Gemini 1.5 Flash:")
        print(parsed_package.model_dump_json(indent=2))
    except Exception as e:
        print(f"Failed to parse with Gemini: {e}")
        return

    # Push to Supabase
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("\nSupabase credentials not found in environment variables. Skipping DB insert.")
        return
        
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        data = parsed_package.model_dump()
        
        response = supabase.table("packages").insert(data).execute()
        print("\nSuccessfully inserted into Supabase:", response)
    except Exception as e:
        print(f"\nFailed to push to Supabase: {e}")

def test_parse():
    """
    Verification entry point as required by the tour-parser skill.
    Prints the extracted JSON to the console.
    """
    asyncio.run(main())

if __name__ == "__main__":
    test_parse()
