export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'scheduled' | 'completed' | 'failed';
  createdAt: Date;
  scheduledAt?: Date;
  platforms: Platform[];
  content: ContentGeneration;
  analytics: CampaignAnalytics;
  targetAudience: TargetAudience;
}

export interface Platform {
  id: string;
  name: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'tiktok';
  enabled: boolean;
  credentials?: PlatformCredentials;
  settings: PlatformSettings;
}

export interface PlatformCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface PlatformSettings {
  autoPost: boolean;
  scheduledTimes: string[];
  hashtagStrategy: 'auto' | 'custom';
  customHashtags?: string[];
}

export interface ContentGeneration {
  prompt: string;
  mediaType: 'image' | 'video' | 'mixed';
  generatedContent: GeneratedContent[];
  variations: ContentVariation[];
  abTestConfig?: ABTestConfig;
}

export interface GeneratedContent {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  hashtags: string[];
  platform: string;
  generatedAt: Date;
}

export interface ContentVariation {
  id: string;
  name: string;
  content: GeneratedContent[];
  performance?: VariationPerformance;
}

export interface ABTestConfig {
  enabled: boolean;
  testDuration: number; // hours
  winnerCriteria: 'engagement' | 'reach' | 'clicks';
  variations: string[]; // variation IDs
}

export interface VariationPerformance {
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  conversionRate: number;
}

export interface CampaignAnalytics {
  totalReach: number;
  totalEngagement: number;
  totalClicks: number;
  conversionRate: number;
  costPerEngagement: number;
  platformBreakdown: PlatformAnalytics[];
  timeSeriesData: TimeSeriesData[];
  topPerformingContent: GeneratedContent[];
}

export interface PlatformAnalytics {
  platform: string;
  reach: number;
  engagement: number;
  clicks: number;
  shares: number;
  comments: number;
  saves: number;
}

export interface TimeSeriesData {
  timestamp: Date;
  reach: number;
  engagement: number;
  clicks: number;
}

export interface TargetAudience {
  location: string;
  demographics: {
    ageRange: [number, number];
    interests: string[];
    occupation?: string[];
  };
  disasterType: DisasterType;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface DisasterType {
  type: 'hurricane' | 'earthquake' | 'flood' | 'wildfire' | 'tornado' | 'other';
  description: string;
  affectedAreas: string[];
  estimatedDuration: number; // days
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: string;
  compensation: {
    type: 'hourly' | 'daily' | 'project';
    amount?: number;
    currency: string;
  };
  contactInfo: ContactInfo;
  skills: string[];
  category: JobCategory;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
}

export interface JobCategory {
  primary: string;
  secondary?: string;
  tags: string[];
}

export interface ResponseProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  skills: string[];
  availability: {
    immediate: boolean;
    startDate?: Date;
    duration?: string;
  };
  verified: boolean;
  rating?: number;
  previousExperience: string[];
}

export interface AutoResponse {
  id: string;
  campaignId: string;
  respondentProfile: ResponseProfile;
  message: string;
  timestamp: Date;
  status: 'pending' | 'sent' | 'replied';
  template: ResponseTemplate;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  triggers: ResponseTrigger[];
}

export interface ResponseTrigger {
  condition: 'skill_match' | 'location_match' | 'availability' | 'verification_status';
  value: any;
  action: 'send_auto_response' | 'flag_for_review' | 'schedule_interview';
}
