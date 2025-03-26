import requests
from bs4 import BeautifulSoup
import youtube_dl
import linkedin_api
import PyPDF2
import io
from github import Github
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pathlib import Path
from pdf2image import convert_from_path
import time

class ContentScraper:
    def __init__(self, config_path):
        self.config = self._load_config(config_path)
        self.setup_selenium()
        
    def _load_config(self, config_path):
        # Load configuration from JSON file
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def setup_selenium(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(options=chrome_options)
    
    def scrape_company_website(self, url):
        """Scrape content from company website"""
        try:
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            data = {
                'title': self.driver.title,
                'description': '',
                'products': [],
                'images': []
            }
            
            # Get main content
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Extract relevant information (customize based on website structure)
            data['description'] = soup.find('meta', {'name': 'description'})['content']
            
            # Get product information
            products = soup.find_all('div', class_='product-item')  # Adjust class name
            for product in products:
                data['products'].append({
                    'name': product.find('h2').text.strip(),
                    'description': product.find('p').text.strip(),
                    'image': product.find('img')['src']
                })
            
            # Get images
            images = soup.find_all('img')
            data['images'] = [img['src'] for img in images if img.get('src')]
            
            return data
        except Exception as e:
            print(f"Error scraping company website: {e}")
            return None

    def scrape_youtube_channel(self, channel_url):
        """Scrape YouTube channel information and videos"""
        try:
            ydl_opts = {
                'extract_flat': True,
                'force_generic_extractor': True,
                'playlistend': 50  # Increase this number to get more videos
            }
            
            with youtube_dl.YoutubeDL(ydl_opts) as ydl:
                # Get channel uploads playlist
                channel_data = ydl.extract_info(channel_url, download=False)
                uploads_playlist_url = f"https://www.youtube.com/channel/{channel_data['id']}/videos"
                playlist_data = ydl.extract_info(uploads_playlist_url, download=False)
                
                videos = []
                for entry in playlist_data.get('entries', []):
                    if entry:
                        videos.append({
                            'title': entry.get('title', ''),
                            'url': entry.get('url', ''),
                            'thumbnail': entry.get('thumbnail', ''),
                            'description': entry.get('description', ''),
                            'view_count': entry.get('view_count', 0),
                            'upload_date': entry.get('upload_date', '')
                        })
                
                return {
                    'channel_name': channel_data.get('uploader', ''),
                    'description': channel_data.get('description', ''),
                    'subscriber_count': channel_data.get('subscriber_count', ''),
                    'videos': videos
                }
        except Exception as e:
            print(f"Error scraping YouTube channel: {e}")
            return None

    def scrape_linkedin_profile(self, profile_url):
        """Scrape LinkedIn profile information using Selenium"""
        try:
            # Configure Selenium
            chrome_options = Options()
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_argument('--disable-notifications')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            linkedin_driver = webdriver.Chrome(options=chrome_options)
            linkedin_driver.execute_cdp_cmd('Network.setUserAgentOverride', {
                "userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            })
            
            # Initialize data dictionary
            data = {
                'name': '',
                'headline': '',
                'about': '',
                'experience': [],
                'education': [],
                'certifications': [],
                'skills': [],
                'projects': [],
                'profile_image_path': None
            }
            
            try:
                # Login process
                linkedin_driver.get("https://www.linkedin.com/login")
                time.sleep(3)
                
                username_elem = WebDriverWait(linkedin_driver, 10).until(
                    EC.presence_of_element_located((By.ID, "username"))
                )
                password_elem = WebDriverWait(linkedin_driver, 10).until(
                    EC.presence_of_element_located((By.ID, "password"))
                )
                
                username_elem.send_keys(self.config['linkedin']['username'])
                password_elem.send_keys(self.config['linkedin']['password'])
                
                signin_button = WebDriverWait(linkedin_driver, 10).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
                )
                signin_button.click()
                time.sleep(5)
                
                # Navigate to profile and wait longer
                linkedin_driver.get(profile_url)
                time.sleep(10)  # Increased wait time
                
                # Scroll more thoroughly with pauses
                total_height = linkedin_driver.execute_script("return document.body.scrollHeight")
                for i in range(10):  # Increased scroll iterations
                    height = total_height * (i/10)
                    linkedin_driver.execute_script(f"window.scrollTo(0, {height});")
                    time.sleep(1)
                    
                    # Try to click any "Show more" buttons
                    try:
                        show_more_buttons = linkedin_driver.find_elements(By.CSS_SELECTOR, 
                            "button.show-more-less-button, button.inline-show-more-text__button")
                        for button in show_more_buttons:
                            if button.is_displayed():
                                linkedin_driver.execute_script("arguments[0].click();", button)
                                time.sleep(1)
                    except:
                        pass

                # Certifications section - updated selectors and wait time
                print("\nLooking for certifications...")
                try:
                    # Wait for certifications section
                    WebDriverWait(linkedin_driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//section[contains(.//span/text(), 'Certifications') or contains(.//span/text(), 'Licenses')]"))
                    )
                    
                    cert_items = linkedin_driver.find_elements(By.XPATH, 
                        "//section[contains(.//span/text(), 'Certifications') or contains(.//span/text(), 'Licenses')]//div[contains(@class, 'pvs-list')]//li")
                    
                    print(f"Found {len(cert_items)} certification items")
                    
                    for item in cert_items:
                        try:
                            # Get all text elements within the certification item
                            cert_elements = item.find_elements(By.CSS_SELECTOR, "span.visually-hidden")
                            cert_text = [elem.text.strip() for elem in cert_elements if elem.text.strip()]
                            
                            if cert_text:
                                print(f"Processing certification: {cert_text[0]}")
                                data['certifications'].append({
                                    'name': cert_text[0],
                                    'issuer': cert_text[1] if len(cert_text) > 1 else '',
                                    'date': cert_text[2] if len(cert_text) > 2 else ''
                                })
                        except Exception as e:
                            print(f"Error processing certification item: {e}")
                except Exception as e:
                    print(f"Error getting certifications: {e}")

                # Projects section - updated selectors and wait time
                print("\nLooking for projects...")
                try:
                    # Wait for projects section
                    WebDriverWait(linkedin_driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, "//section[contains(.//span/text(), 'Projects')]"))
                    )
                    
                    project_items = linkedin_driver.find_elements(By.XPATH, 
                        "//section[contains(.//span/text(), 'Projects')]//div[contains(@class, 'pvs-list')]//li")
                    
                    print(f"Found {len(project_items)} project items")
                    
                    for item in project_items:
                        try:
                            # Get all text elements within the project item
                            project_elements = item.find_elements(By.CSS_SELECTOR, "span.visually-hidden")
                            project_text = [elem.text.strip() for elem in project_elements if elem.text.strip()]
                            
                            if project_text:
                                print(f"Processing project: {project_text[0]}")
                                data['projects'].append({
                                    'name': project_text[0],
                                    'description': project_text[1] if len(project_text) > 1 else '',
                                    'date': project_text[2] if len(project_text) > 2 else ''
                                })
                        except Exception as e:
                            print(f"Error processing project item: {e}")
                except Exception as e:
                    print(f"Error getting projects: {e}")

                # Print detailed debug info
                print("\nDetailed section information:")
                print(f"Certifications found: {len(data['certifications'])}")
                if data['certifications']:
                    print("First certification:", data['certifications'][0])
                
                print(f"\nProjects found: {len(data['projects'])}")
                if data['projects']:
                    print("First project:", data['projects'][0])
                
                return data
                
            finally:
                linkedin_driver.quit()
            
        except Exception as e:
            print(f"Error scraping LinkedIn profile: {e}")
            print(f"Error details: {str(e)}")
            return None

    def scrape_github_profile(self, github_username):
        """Scrape GitHub profile and repositories"""
        try:
            g = Github(self.config['github']['access_token'])
            user = g.get_user(github_username)
            
            repos = []
            for repo in user.get_repos():
                repos.append({
                    'name': repo.name,
                    'description': repo.description,
                    'stars': repo.stargazers_count,
                    'forks': repo.forks_count,
                    'url': repo.html_url,
                    'languages': repo.get_languages()
                })
            
            return {
                'name': user.name,
                'bio': user.bio,
                'location': user.location,
                'repositories': repos
            }
        except Exception as e:
            print(f"Error scraping GitHub profile: {e}")
            return None

    def extract_images_from_pdf(self, pdf_path, output_folder):
        """Extract images from PDF and save them"""
        try:
            # Create output folder
            os.makedirs(output_folder, exist_ok=True)
            
            # Convert PDF pages to images
            pages = convert_from_path(pdf_path)
            
            saved_images = []
            for i, page in enumerate(pages):
                image_path = os.path.join(output_folder, f'page_{i + 1}.jpg')
                page.save(image_path, 'JPEG')
                saved_images.append(image_path)
            
            return saved_images
        except Exception as e:
            print(f"Error extracting images from PDF: {e}")
            return None

    def scrape_cv_pdf(self, pdf_url):
        """Scrape CV from PDF"""
        try:
            response = requests.get(pdf_url)
            pdf_file = io.BytesIO(response.content)
            
            # Save PDF temporarily
            temp_pdf_path = 'scraped_data/temp_cv.pdf'
            os.makedirs('scraped_data', exist_ok=True)
            with open(temp_pdf_path, 'wb') as f:
                f.write(response.content)
            
            # Extract text
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            cv_text = ""
            for page in pdf_reader.pages:
                cv_text += page.extract_text()
            
            # Extract images
            images_folder = 'scraped_data/images/cv'
            saved_images = self.extract_images_from_pdf(temp_pdf_path, images_folder)
            
            # Clean up temporary PDF
            os.remove(temp_pdf_path)
            
            return {
                'raw_text': cv_text,
                'url': pdf_url,
                'saved_images': saved_images
            }
        except Exception as e:
            print(f"Error scraping CV: {e}")
            return None

    def scrape_local_pdfs(self, docs_folder):
        """Scrape PDFs from local docs folder"""
        try:
            pdf_data = []
            docs_path = Path(docs_folder)
            
            if not docs_path.exists():
                raise Exception(f"Docs folder not found: {docs_folder}")
            
            # Get all PDF files
            pdf_files = list(docs_path.glob('**/*.pdf'))
            
            for pdf_file in pdf_files:
                with open(pdf_file, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    pdf_text = ""
                    
                    for page in pdf_reader.pages:
                        pdf_text += page.extract_text()
                    
                    # Extract images
                    images_folder = f'scraped_data/images/docs/{pdf_file.stem}'
                    saved_images = self.extract_images_from_pdf(str(pdf_file), images_folder)
                    
                    pdf_data.append({
                        'filename': pdf_file.name,
                        'path': str(pdf_file),
                        'raw_text': pdf_text,
                        'saved_images': saved_images
                    })
            
            return pdf_data
        except Exception as e:
            print(f"Error scraping local PDFs: {e}")
            return None

    def scrape_signalhire_company(self, url):
        """Scrape company information from SignalHire"""
        try:
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            data = {
                'company_name': '',
                'description': '',
                'industry': '',
                'size': '',
                'location': '',
                'website': '',
                'founded': ''
            }
            
            # Customize these selectors based on SignalHire's HTML structure
            company_info = soup.find('div', class_='company-info')
            if company_info:
                data['company_name'] = company_info.find('h1').text.strip() if company_info.find('h1') else ''
                data['description'] = company_info.find('div', class_='description').text.strip() if company_info.find('div', class_='description') else ''
            
            return data
        except Exception as e:
            print(f"Error scraping SignalHire company info: {e}")
            return None

    def scrape_app_info(self, url):
        """Scrape app information from AppAdvice"""
        try:
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            data = {
                'app_name': '',
                'description': '',
                'screenshots': [],
                'details': {}
            }
            
            # Get app name
            app_name = soup.find('h1')
            if app_name:
                data['app_name'] = app_name.text.strip()
            
            # Get description
            description = soup.find('div', string=lambda text: text and "What is it about?" in text)
            if description and description.find_next('div'):
                data['description'] = description.find_next('div').text.strip()
            
            # Get app details
            details_section = soup.find('div', string=lambda text: text and "App Details" in text)
            if details_section:
                details = details_section.find_next('div')
                if details:
                    for item in details.find_all('div', recursive=False):
                        key = item.find('strong')
                        value = item.find('span')
                        if key and value:
                            data['details'][key.text.strip()] = value.text.strip()
            
            # Save screenshots
            screenshots_section = soup.find('div', string=lambda text: text and "App Screenshots" in text)
            if screenshots_section:
                os.makedirs('scraped_data/images/app', exist_ok=True)
                screenshots = screenshots_section.find_next('div').find_all('img')
                for i, img in enumerate(screenshots):
                    img_url = img.get('src')
                    if img_url:
                        if not img_url.startswith('http'):
                            img_url = f"https:{img_url}" if img_url.startswith('//') else f"https://appadvice.com{img_url}"
                        try:
                            response = requests.get(img_url)
                            img_path = f'scraped_data/images/app/screenshot_{i}.jpg'
                            with open(img_path, 'wb') as f:
                                f.write(response.content)
                            data['screenshots'].append({
                                'path': img_path,
                                'original_url': img_url
                            })
                        except Exception as e:
                            print(f"Error saving screenshot {img_url}: {e}")
            
            return data
        except Exception as e:
            print(f"Error scraping app info: {e}")
            return None

    def scrape_app_screenshots(self, url):
        """Specifically scrape screenshots from AppAdvice"""
        try:
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            # Scroll to screenshots section
            screenshots_heading = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'App Screenshots')]")
            self.driver.execute_script("arguments[0].scrollIntoView(true);", screenshots_heading)
            time.sleep(2)  # Wait for images to load
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Find all screenshot images
            screenshots = []
            screenshot_divs = soup.find_all('img', {'alt': lambda x: x and 'screenshot' in x.lower()})
            
            os.makedirs('scraped_data/images/app', exist_ok=True)
            
            for i, img in enumerate(screenshot_divs):
                img_url = img.get('src')
                if img_url:
                    if not img_url.startswith('http'):
                        img_url = f"https:{img_url}" if img_url.startswith('//') else f"https://appadvice.com{img_url}"
                    try:
                        response = requests.get(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                        img_path = f'scraped_data/images/app/screenshot_{i}.jpg'
                        with open(img_path, 'wb') as f:
                            f.write(response.content)
                        screenshots.append({
                            'path': img_path,
                            'original_url': img_url
                        })
                    except Exception as e:
                        print(f"Error saving screenshot {img_url}: {e}")
            
            return screenshots
        except Exception as e:
            print(f"Error scraping app screenshots: {e}")
            return None

    def save_images(self, url, folder_name):
        """Save images from a website to a folder"""
        try:
            self.driver.get(url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            images = soup.find_all('img')
            
            saved_images = []
            os.makedirs(f'scraped_data/images/{folder_name}', exist_ok=True)
            
            for i, img in enumerate(images):
                img_url = img.get('src')
                if img_url:
                    if not img_url.startswith('http'):
                        img_url = f"https:{img_url}" if img_url.startswith('//') else f"{url}/{img_url}"
                    
                    try:
                        response = requests.get(img_url)
                        img_path = f'scraped_data/images/{folder_name}/image_{i}.jpg'
                        with open(img_path, 'wb') as f:
                            f.write(response.content)
                        saved_images.append({
                            'original_url': img_url,
                            'local_path': img_path,
                            'alt_text': img.get('alt', '')
                        })
                    except Exception as e:
                        print(f"Error saving image {img_url}: {e}")
            
            return saved_images
        except Exception as e:
            print(f"Error saving images: {e}")
            return None 