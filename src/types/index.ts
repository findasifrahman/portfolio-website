export interface LinkedInData {
  profile: {
    name: string;
    headline: string;
    location: string;
    summary: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
      duration: string;
    }>;
    skills: string[];
  };
}

export interface GitHubData {
  profile: {
    login: string;
    name: string;
    bio: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  repositories: Array<{
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    languages: Record<string, number>;
  }>;
}

export interface YouTubeData {
  channel: {
    title: string;
    description: string;
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
  videos: Array<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    publishedAt: string;
    viewCount: string;
    likeCount: string;
  }>;
} 