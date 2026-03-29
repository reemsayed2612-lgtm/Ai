export interface DayPlan {
  day: number;
  action: string;
  content: string;
}

export interface PageAnalysis {
  id: string;
  url: string;
  date: string;
  persona: string;
  analysis: {
    logo: string;
    bio: string;
    posts: string;
    reels: string;
    strengths: string[];
    weaknesses: string[];
  };
  plan: DayPlan[];
}
