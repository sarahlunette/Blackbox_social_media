import { GeneratedContent, ContentGeneration } from '@/types';

export class BlackboxAPI {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_BLACKBOX_API_KEY || '';
    this.baseURL = process.env.NEXT_PUBLIC_BLACKBOX_API_URL || 'https://api.blackbox.ai';
  }

  async generateContent(prompt: string, mediaType: 'image' | 'video' = 'image'): Promise<GeneratedContent> {
    try {
      // Mock implementation for demo purposes
      // In production, this would make actual API calls to Blackbox
      const mockContent: GeneratedContent = {
        id: `content_${Date.now()}`,
        type: mediaType,
        url: mediaType === 'image' 
          ? `https://picsum.photos/800/600?random=${Date.now()}`
          : `https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4`,
        caption: this.generateCaption(prompt),
        hashtags: this.generateHashtags(prompt),
        platform: 'general',
        generatedAt: new Date(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      return mockContent;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  }

  async generateMultipleVariations(
    prompt: string, 
    platforms: string[], 
    count: number = 3
  ): Promise<GeneratedContent[]> {
    const variations: GeneratedContent[] = [];
    
    for (let i = 0; i < count; i++) {
      for (const platform of platforms) {
        const content = await this.generateContent(
          `${prompt} optimized for ${platform}`,
          Math.random() > 0.7 ? 'video' : 'image'
        );
        content.platform = platform;
        variations.push(content);
      }
    }

    return variations;
  }

  private generateCaption(prompt: string): string {
    const disasterKeywords = ['hurricane', 'earthquake', 'flood', 'wildfire', 'tornado'];
    const hasDisasterKeyword = disasterKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    if (hasDisasterKeyword) {
      return `🚨 URGENT: Post-disaster support needed! ${prompt.slice(0, 100)}... 
      We're actively hiring for immediate disaster relief efforts. 
      Apply now to make a difference in your community. 
      #DisasterRelief #Jobs #Community #Help`;
    }

    return `Join our mission to help communities rebuild and recover. 
    ${prompt.slice(0, 120)}... 
    Apply today and be part of the solution. 
    #Jobs #Community #Recovery #Hiring`;
  }

  private generateHashtags(prompt: string): string[] {
    const baseHashtags = ['#Jobs', '#Hiring', '#Community', '#Help'];
    const disasterHashtags = ['#DisasterRelief', '#Emergency', '#Recovery', '#Volunteer'];
    const skillHashtags = ['#Construction', '#Medical', '#Logistics', '#Communication'];

    const prompt_lower = prompt.toLowerCase();
    let hashtags = [...baseHashtags];

    // Add disaster-specific hashtags
    if (prompt_lower.includes('hurricane')) hashtags.push('#Hurricane', '#StormRelief');
    if (prompt_lower.includes('earthquake')) hashtags.push('#Earthquake', '#SeismicRelief');
    if (prompt_lower.includes('flood')) hashtags.push('#Flood', '#WaterDamage');
    if (prompt_lower.includes('wildfire')) hashtags.push('#Wildfire', '#FireRelief');

    // Add skill-specific hashtags
    if (prompt_lower.includes('medical')) hashtags.push('#Healthcare', '#Medical');
    if (prompt_lower.includes('construction')) hashtags.push('#Construction', '#Rebuilding');
    if (prompt_lower.includes('logistics')) hashtags.push('#Logistics', '#Supply');

    // Add disaster relief hashtags if any disaster keyword found
    const hasDisaster = ['hurricane', 'earthquake', 'flood', 'wildfire', 'tornado']
      .some(disaster => prompt_lower.includes(disaster));
    
    if (hasDisaster) {
      hashtags.push(...disasterHashtags);
    }

    // Add some skill hashtags randomly
    const randomSkillHashtags = skillHashtags
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    hashtags.push(...randomSkillHashtags);

    return [...new Set(hashtags)].slice(0, 10); // Remove duplicates and limit to 10
  }

  async analyzeContent(content: GeneratedContent): Promise<any> {
    // Mock content analysis
    return {
      sentimentScore: Math.random(),
      readabilityScore: Math.random(),
      engagementPrediction: Math.random() * 1000,
      suggestedImprovements: [
        'Add more emotional appeal',
        'Include call-to-action',
        'Optimize hashtag selection'
      ]
    };
  }
}

export const blackboxAPI = new BlackboxAPI();
