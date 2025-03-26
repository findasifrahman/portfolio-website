import os
from bs4 import BeautifulSoup
import json

def print_html_structure(soup, filename):
    """Print HTML structure to help debug selectors"""
    print(f"\nAnalyzing HTML structure for {filename}...")
    
    # Check for main containers
    containers = soup.find_all('div', {'class': 'pvs-list__outer-container'})
    print(f"Found {len(containers)} outer containers")
    
    # Check for list items
    list_items = soup.find_all('li', {'class': 'artdeco-list__item'})
    print(f"Found {len(list_items)} list items")
    
    # Check for text elements
    visually_hidden = soup.find_all('span', {'class': 'visually-hidden'})
    print(f"Found {len(visually_hidden)} visually-hidden spans")
    
    # Print sample of first item if found
    if list_items:
        print("\nSample list item structure:")
        print(list_items[0].prettify())

def scrape_linkedin_local_pages(pages_folder):
    """Scrape LinkedIn information from locally saved HTML pages"""
    data = {
        'experience': [],
        'education': [],
        'certifications': [],
        'skills': [],
        'projects': [],
        'publications': []
    }
    
    try:
        for filename in os.listdir(pages_folder):
            if not filename.endswith('.html'):
                continue
                
            file_path = os.path.join(pages_folder, filename)
            print(f"\nProcessing {filename}...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')
            
            # Print HTML structure for debugging
            print_html_structure(soup, filename)
            
            # Extract data based on file name
            if 'experience' in filename.lower():
                data['experience'] = extract_experience(soup)
            elif 'education' in filename.lower():
                data['education'] = extract_education(soup)
            elif 'certifications' in filename.lower() or 'licenses' in filename.lower():
                data['certifications'] = extract_certifications(soup)
            elif 'skills' in filename.lower():
                data['skills'] = extract_skills(soup)
            elif 'projects' in filename.lower():
                data['projects'] = extract_projects(soup)
            elif 'publications' in filename.lower():
                data['publications'] = extract_publications(soup)
        
        # Save the extracted data
        os.makedirs('scraped_data', exist_ok=True)
        with open('scraped_data/linkedin.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print("\nData extraction complete. Saved to scraped_data/linkedin.json")
        return data
        
    except Exception as e:
        print(f"Error processing LinkedIn pages: {e}")
        return None

def extract_experience(soup):
    """Extract experience information"""
    experience = []
    try:
        exp_items = soup.find_all('div', {'class': 'pvs-entity'})
        for item in exp_items:
            # Get title and company
            title_elem = item.find('span', {'class': 'visually-hidden'})
            if title_elem:
                title_text = title_elem.text.strip()
                # Split text as LinkedIn combines title and company
                parts = [part.strip() for part in title_text.split(' · ')]
                
                exp_data = {
                    'title': parts[0],
                    'company': parts[1] if len(parts) > 1 else '',
                    'duration': parts[2] if len(parts) > 2 else '',
                    'location': parts[3] if len(parts) > 3 else ''
                }
                experience.append(exp_data)
        
        print(f"Found {len(experience)} experience entries")
    except Exception as e:
        print(f"Error extracting experience: {e}")
    return experience

def extract_education(soup):
    """Extract education information"""
    education = []
    try:
        edu_items = soup.find_all('div', {'class': 'pvs-entity'})
        for item in edu_items:
            title_elem = item.find('span', {'class': 'visually-hidden'})
            if title_elem:
                edu_text = title_elem.text.strip()
                parts = [part.strip() for part in edu_text.split(' · ')]
                
                edu_data = {
                    'school': parts[0],
                    'degree': parts[1] if len(parts) > 1 else '',
                    'field': parts[2] if len(parts) > 2 else '',
                    'dates': parts[3] if len(parts) > 3 else ''
                }
                education.append(edu_data)
        
        print(f"Found {len(education)} education entries")
    except Exception as e:
        print(f"Error extracting education: {e}")
    return education

def extract_certifications(soup):
    """Extract certifications information"""
    certifications = []
    try:
        # Try multiple possible selectors for certification items
        cert_items = soup.find_all('div', {'class': 'pvs-list__outer-container'})
        if cert_items:
            # Get all list items within the container
            cert_items = cert_items[0].find_all('li', {'class': 'artdeco-list__item'})
            
            for item in cert_items:
                try:
                    # Get the main text content
                    title_elem = item.find('div', {'class': 'display-flex align-items-center'})
                    if title_elem:
                        name_elem = title_elem.find('span', {'class': 'visually-hidden'})
                        if name_elem:
                            cert_text = name_elem.text.strip()
                            
                            # Get additional details if they exist
                            details_elem = item.find('span', {'class': 't-14 t-normal'})
                            details_text = details_elem.text.strip() if details_elem else ''
                            
                            # Get date if it exists
                            date_elem = item.find('span', {'class': 't-14 t-normal t-black--light'})
                            date_text = date_elem.text.strip() if date_elem else ''
                            
                            # Split main text and combine with other details
                            parts = [part.strip() for part in cert_text.split(' · ')]
                            
                            cert_data = {
                                'name': parts[0],
                                'issuer': parts[1] if len(parts) > 1 else details_text,
                                'issued_date': parts[2] if len(parts) > 2 else date_text,
                                'credential_id': parts[3] if len(parts) > 3 else ''
                            }
                            certifications.append(cert_data)
                            print(f"Found certification: {cert_data['name']}")
                except Exception as e:
                    print(f"Error processing individual certification: {e}")
        
        print(f"Found {len(certifications)} certification entries")
        
        # Debug output
        if not certifications:
            print("No certifications found. Checking HTML structure...")
            containers = soup.find_all('div', {'class': 'pvs-list__outer-container'})
            print(f"Found {len(containers)} outer containers")
            
            if containers:
                items = containers[0].find_all('li', {'class': 'artdeco-list__item'})
                print(f"Found {len(items)} list items")
                
                if items:
                    print("Sample item HTML structure:")
                    print(items[0].prettify()[:500])  # Print first 500 chars of first item
                
    except Exception as e:
        print(f"Error extracting certifications: {e}")
    
    return certifications

def extract_skills(soup):
    """Extract skills information"""
    skills = []
    try:
        skill_items = soup.find_all('span', {'class': 'visually-hidden'})
        for item in skill_items:
            skill_text = item.text.strip()
            if skill_text and not any(x in skill_text.lower() for x in ['show', 'more', 'all']):
                skills.append(skill_text)
        
        print(f"Found {len(skills)} skills")
    except Exception as e:
        print(f"Error extracting skills: {e}")
    return skills

def extract_projects(soup):
    """Extract projects information"""
    projects = []
    try:
        project_items = soup.find_all('div', {'class': 'pvs-entity'})
        for item in project_items:
            title_elem = item.find('span', {'class': 'visually-hidden'})
            if title_elem:
                project_text = title_elem.text.strip()
                parts = [part.strip() for part in project_text.split(' · ')]
                
                project_data = {
                    'name': parts[0],
                    'description': parts[1] if len(parts) > 1 else '',
                    'date': parts[2] if len(parts) > 2 else ''
                }
                projects.append(project_data)
        
        print(f"Found {len(projects)} project entries")
    except Exception as e:
        print(f"Error extracting projects: {e}")
    return projects

def extract_publications(soup):
    """Extract publications information"""
    publications = []
    try:
        pub_items = soup.find_all('div', {'class': 'pvs-entity'})
        for item in pub_items:
            title_elem = item.find('span', {'class': 'visually-hidden'})
            if title_elem:
                pub_text = title_elem.text.strip()
                parts = [part.strip() for part in pub_text.split(' · ')]
                
                pub_data = {
                    'title': parts[0],
                    'publisher': parts[1] if len(parts) > 1 else '',
                    'date': parts[2] if len(parts) > 2 else '',
                    'description': parts[3] if len(parts) > 3 else ''
                }
                publications.append(pub_data)
        
        print(f"Found {len(publications)} publication entries")
    except Exception as e:
        print(f"Error extracting publications: {e}")
    return publications

if __name__ == "__main__":
    scrape_linkedin_local_pages('linked_pages') 