import { Campaign, Platform, ResponseProfile, AutoResponse } from '@/types';

// Mock database for demo purposes
class MockDatabase {
  private campaigns: Campaign[] = [];
  private platforms: Platform[] = [];
  private responses: ResponseProfile[] = [];
  private autoResponses: AutoResponse[] = [];

  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    return this.campaigns;
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    return this.campaigns.find(c => c.id === id) || null;
  }

  async saveCampaign(campaign: Campaign): Promise<Campaign> {
    const existingIndex = this.campaigns.findIndex(c => c.id === campaign.id);
    if (existingIndex >= 0) {
      this.campaigns[existingIndex] = campaign;
    } else {
      this.campaigns.push(campaign);
    }
    return campaign;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    const initialLength = this.campaigns.length;
    this.campaigns = this.campaigns.filter(c => c.id !== id);
    return this.campaigns.length < initialLength;
  }

  // Platforms
  async getPlatforms(): Promise<Platform[]> {
    if (this.platforms.length === 0) {
      this.platforms = this.getDefaultPlatforms();
    }
    return this.platforms;
  }

  async updatePlatform(platform: Platform): Promise<Platform> {
    const existingIndex = this.platforms.findIndex(p => p.id === platform.id);
    if (existingIndex >= 0) {
      this.platforms[existingIndex] = platform;
    } else {
      this.platforms.push(platform);
    }
    return platform;
  }

  // Responses
  async getResponses(campaignId?: string): Promise<ResponseProfile[]> {
    if (campaignId) {
      // Filter responses for specific campaign
      const campaignResponses = this.autoResponses
        .filter(ar => ar.campaignId === campaignId)
        .map(ar => ar.respondentProfile);
      return campaignResponses;
    }
    return this.responses;
  }

  async saveResponse(response: ResponseProfile): Promise<ResponseProfile> {
    const existingIndex = this.responses.findIndex(r => r.id === response.id);
    if (existingIndex >= 0) {
      this.responses[existingIndex] = response;
    } else {
      this.responses.push(response);
    }
    return response;
  }

  // Auto Responses
  async getAutoResponses(campaignId?: string): Promise<AutoResponse[]> {
    if (campaignId) {
      return this.autoResponses.filter(ar => ar.campaignId === campaignId);
    }
    return this.autoResponses;
  }

  async saveAutoResponse(autoResponse: AutoResponse): Promise<AutoResponse> {
    this.autoResponses.push(autoResponse);
    return autoResponse;
  }

  private getDefaultPlatforms(): Platform[] {
    return [
      {
        id: 'facebook',
        name: 'facebook',
        enabled: false,
        settings: {
          autoPost: false,
          scheduledTimes: ['09:00', '14:00', '18:00'],
          hashtagStrategy: 'auto',
        },
      },
      {
        id: 'twitter',
        name: 'twitter',
        enabled: false,
        settings: {
          autoPost: false,
          scheduledTimes: ['08:00', '12:00', '16:00', '20:00'],
          hashtagStrategy: 'auto',
        },
      },
      {
        id: 'instagram',
        name: 'instagram',
        enabled: false,
        settings: {
          autoPost: false,
          scheduledTimes: ['10:00', '15:00', '19:00'],
          hashtagStrategy: 'auto',
        },
      },
      {
        id: 'linkedin',
        name: 'linkedin',
        enabled: false,
        settings: {
          autoPost: false,
          scheduledTimes: ['09:00', '13:00', '17:00'],
          hashtagStrategy: 'custom',
          customHashtags: ['#Jobs', '#Professional', '#DisasterRelief'],
        },
      },
      {
        id: 'tiktok',
        name: 'tiktok',
        enabled: false,
        settings: {
          autoPost: false,
          scheduledTimes: ['11:00', '16:00', '21:00'],
          hashtagStrategy: 'auto',
        },
      },
    ];
  }
}

export const database = new MockDatabase();

// Utility functions
export function generateMockAnalytics() {
  return {
    totalReach: Math.floor(Math.random() * 10000) + 1000,
    totalEngagement: Math.floor(Math.random() * 1000) + 100,
    totalClicks: Math.floor(Math.random() * 500) + 50,
    conversionRate: Math.random() * 0.1 + 0.02,
    costPerEngagement: Math.random() * 2 + 0.5,
    platformBreakdown: [
      {
        platform: 'Facebook',
        reach: Math.floor(Math.random() * 3000) + 500,
        engagement: Math.floor(Math.random() * 300) + 50,
        clicks: Math.floor(Math.random() * 150) + 20,
        shares: Math.floor(Math.random() * 50) + 5,
        comments: Math.floor(Math.random() * 100) + 10,
        saves: Math.floor(Math.random() * 25) + 2,
      },
      {
        platform: 'Instagram',
        reach: Math.floor(Math.random() * 2500) + 400,
        engagement: Math.floor(Math.random() * 250) + 40,
        clicks: Math.floor(Math.random() * 120) + 15,
        shares: Math.floor(Math.random() * 30) + 3,
        comments: Math.floor(Math.random() * 80) + 8,
        saves: Math.floor(Math.random() * 40) + 5,
      },
      {
        platform: 'Twitter',
        reach: Math.floor(Math.random() * 2000) + 300,
        engagement: Math.floor(Math.random() * 200) + 30,
        clicks: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 60) + 8,
        comments: Math.floor(Math.random() * 70) + 7,
        saves: Math.floor(Math.random() * 15) + 1,
      },
    ],
    timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
      timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
      reach: Math.floor(Math.random() * 1000) + 200,
      engagement: Math.floor(Math.random() * 100) + 20,
      clicks: Math.floor(Math.random() * 50) + 5,
    })),
    topPerformingContent: [],
  };
}
