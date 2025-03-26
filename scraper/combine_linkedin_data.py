import json
import os

def combine_linkedin_data():
    """Combine LinkedIn data from separate JSON files into one comprehensive file"""
    try:
        linkedin_data = {
            'certifications': [],
            'projects': [],
            'skills': [],
            'profile': {
                'name': 'Md. Asifur Rahman',
                'headline': 'Software Engineer & Embedded System Designer'
            }
        }
        
        # Load certifications
        with open('linkedin_data/linkedin_certifications.json', 'r', encoding='utf-8') as f:
            linkedin_data['certifications'] = json.load(f)
            print(f"Loaded {len(linkedin_data['certifications'])} certifications")
        
        # Load projects
        with open('linkedin_data/linkedin_projects.json', 'r', encoding='utf-8') as f:
            linkedin_data['projects'] = json.load(f)
            print(f"Loaded {len(linkedin_data['projects'])} projects")
        
        # Load skills
        with open('linkedin_data/linkedin_skills.json', 'r', encoding='utf-8') as f:
            skills_data = json.load(f)
            linkedin_data['skills'] = skills_data.get('skills', [])
            print(f"Loaded {len(linkedin_data['skills'])} skills")
        
        # Group skills by category
        skill_categories = {
            'Hardware Design': [
                'Advanced Digital Hardware Design', 'Field-Programmable Gate Arrays (FPGA)',
                'zynq', 'Xilinx Vivado', 'petalinux', 'Advanced PCB Design', 'Embedded Systems',
                'ESP32 Microcontrollers'
            ],
            'Cloud & DevOps': [
                'Microsoft Azure', 'Azure Functions', 'Google Cloud Platform (GCP)',
                'Cloud Computing', 'Amazon S3', 'docker', 'Firebase', 'Cloud Firestore',
                'Google Cloud Run'
            ],
            'AI & Machine Learning': [
                'Artificial Intelligence (AI)', 'Machine Learning', 'Large Language Models (LLM)',
                'Generative AI', 'Generative AI Tools', 'LangChain', 'RAG, Langchain',
                'Word Embeddings', 'Multi-agent Systems', 'Agent-based Modeling'
            ],
            'Programming Languages': [
                'Python (Programming Language)', 'C++', 'nodejs', '.NET Framework',
                'Objective-C', 'SQL'
            ],
            'Web & Mobile Development': [
                'Full-Stack Development', 'Web Application Development',
                'Mobile Applications', 'Flask', 'STREAMLIT'
            ]
        }
        
        # Organize skills by category
        categorized_skills = {category: [] for category in skill_categories}
        other_skills = []
        
        for skill in linkedin_data['skills']:
            categorized = False
            for category, category_skills in skill_categories.items():
                if skill in category_skills:
                    categorized_skills[category].append(skill)
                    categorized = True
                    break
            if not categorized:
                other_skills.append(skill)
        
        linkedin_data['categorized_skills'] = categorized_skills
        linkedin_data['other_skills'] = other_skills
        
        # Save combined data
        os.makedirs('scraped_data', exist_ok=True)
        with open('scraped_data/linkedin_combined.json', 'w', encoding='utf-8') as f:
            json.dump(linkedin_data, f, indent=2, ensure_ascii=False)
        
        print("\nLinkedIn data combined successfully!")
        print("Saved to: scraped_data/linkedin_combined.json")
        
        return linkedin_data
        
    except Exception as e:
        print(f"Error combining LinkedIn data: {e}")
        return None

if __name__ == "__main__":
    combine_linkedin_data() 