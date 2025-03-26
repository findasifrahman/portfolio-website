import json
from content_scraper import ContentScraper
import os
from pathlib import Path

def save_data(data, filename):
    """Save scraped data to JSON file"""
    os.makedirs('scraped_data', exist_ok=True)
    with open(f'scraped_data/{filename}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def main():
    # Initialize scraper
    scraper = ContentScraper('config/scraper_config.json')
    
    # Load configuration
    with open('config/scraper_config.json', 'r') as f:
        config = json.load(f)
    
    try:
        # Create image directories
        os.makedirs('scraped_data/images', exist_ok=True)
        
        # Scrape company website and save images
        print("Scraping company website...")
        company_data = scraper.scrape_company_website(config['urls']['company'])
        company_images = scraper.save_images(config['urls']['company'], 'company')
        company_data['saved_images'] = company_images
        save_data(company_data, 'company')
        
        # Scrape YouTube channel
        print("Scraping YouTube channel...")
        youtube_data = scraper.scrape_youtube_channel(config['urls']['youtube'])
        save_data(youtube_data, 'youtube')
        
        # Scrape LinkedIn profile
        print("Scraping LinkedIn profile...")
        linkedin_data = scraper.scrape_linkedin_profile(config['urls']['linkedin'])
        save_data(linkedin_data, 'linkedin')
        
        # Scrape GitHub profile
        print("Scraping GitHub profile...")
        github_data = scraper.scrape_github_profile(config['urls']['github'])
        save_data(github_data, 'github')
        
        # Scrape CV
        print("Scraping CV...")
        cv_data = scraper.scrape_cv_pdf(config['urls']['cv'])
        save_data(cv_data, 'cv')
        
        # Scrape SignalHire company info
        print("Scraping company info from SignalHire...")
        company_info_data = scraper.scrape_signalhire_company(config['urls']['company_info'])
        save_data(company_info_data, 'company_info')
        
        # Scrape app info and save screenshots
        print("Scraping app info...")
        app_data = scraper.scrape_app_info(config['urls']['autosol_app'])
        save_data(app_data, 'autosol_app')
        
        # Scrape local PDFs
        print("Scraping local PDFs...")
        docs_folder = Path('docs')
        local_pdfs_data = scraper.scrape_local_pdfs(docs_folder)
        save_data(local_pdfs_data, 'local_pdfs')
        
        # Scrape app screenshots
        print("Scraping app screenshots...")
        app_screenshots = scraper.scrape_app_screenshots(config['urls']['autosol_app'])
        if app_screenshots:
            print(f"Successfully scraped {len(app_screenshots)} screenshots from AppAdvice")
        
        print("Scraping completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        scraper.driver.quit()

if __name__ == "__main__":
    main() 