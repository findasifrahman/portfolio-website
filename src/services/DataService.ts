import axios from 'axios';
import { LinkedInData, GitHubData, YouTubeData } from '../types';

class DataService {
  private static instance: DataService;
  private baseUrl = '/data'; // Updated to point to public/data directory

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async getAllData() {
    try {
      const [linkedinData, githubData, youtubeData] = await Promise.all([
        this.getLinkedInData(),
        this.getGitHubData(),
        this.getYouTubeData()
      ]);

      return {
        linkedin: linkedinData,
        github: githubData,
        youtube: youtubeData
      };
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  }

  async getLinkedInData(): Promise<LinkedInData> {
    const response = await axios.get(`${this.baseUrl}/linkedin_combined.json`);
    return response.data;
  }

  async getGitHubData(): Promise<GitHubData> {
    const response = await axios.get(`${this.baseUrl}/github.json`);
    return response.data;
  }

  async getYouTubeData(): Promise<YouTubeData> {
    const response = await axios.get(`${this.baseUrl}/youtube.json`);
    return response.data;
  }

  async getCertifications() {
    try {
      const response = await axios.get(`${this.baseUrl}/linkedin_combined.json`);
      return response.data.certifications;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
  }
}

export default DataService.getInstance(); 