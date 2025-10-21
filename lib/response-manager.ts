import { ResponseProfile, AutoResponse, ResponseTemplate } from '@/types';

export class ResponseManager {
  private templates: ResponseTemplate[] = [];

  constructor() {
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    this.templates = [
      {
        id: 'urgent_response',
        name: 'Urgent Disaster Response',
        subject: 'URGENT: Your Skills Needed for Disaster Relief',
        body: `Dear {{name}},

Thank you for expressing interest in our disaster relief efforts. Based on your profile showing skills in {{skills}}, you're exactly what we need for our {{location}} operations.

🚨 IMMEDIATE NEED:
- Location: {{location}}
- Skills Required: {{required_skills}}
- Duration: {{duration}}
- Compensation: {{compensation}}

Due to the urgent nature of this situation, we can fast-track your application. Please reply within 2 hours if you're available to start immediately.

Contact Information:
{{contact_info}}

Thank you for your willingness to help during this critical time.

Best regards,
Disaster Relief Coordination Team`,
        variables: ['name', 'skills', 'location', 'required_skills', 'duration', 'compensation', 'contact_info'],
        triggers: [
          { condition: 'skill_match', value: 0.8, action: 'send_auto_response' },
          { condition: 'location_match', value: true, action: 'send_auto_response' },
          { condition: 'availability', value: 'immediate', action: 'send_auto_response' }
        ]
      },
      {
        id: 'standard_response',
        name: 'Standard Job Response',
        subject: 'Application Received - {{job_title}}',
        body: `Hello {{name}},

We've received your application for {{job_title}} in our disaster relief operations. Your background in {{skills}} looks promising for our needs.

Next Steps:
1. Application review (24-48 hours)
2. Skills verification
3. Interview scheduling
4. Background check
5. Assignment coordination

We'll be in touch soon with updates on your application status.

If you have any immediate questions, please contact:
{{contact_info}}

Thank you for your interest in helping our community recover.

Sincerely,
HR Team`,
        variables: ['name', 'job_title', 'skills', 'contact_info'],
        triggers: [
          { condition: 'verification_status', value: true, action: 'schedule_interview' },
          { condition: 'skill_match', value: 0.6, action: 'send_auto_response' }
        ]
      },
      {
        id: 'follow_up',
        name: 'Follow-up Response',
        subject: 'Follow-up: Your Disaster Relief Application',
        body: `Hi {{name}},

We wanted to follow up on your application for disaster relief work. We noticed you have experience in {{previous_experience}} which could be valuable.

Current opportunities that might interest you:
- {{available_positions}}

If you're still interested and available, please let us know:
1. Your current availability
2. Preferred work locations
3. Any additional skills or certifications

We're committed to matching skilled individuals with urgent community needs.

Best regards,
Coordination Team`,
        variables: ['name', 'previous_experience', 'available_positions'],
        triggers: [
          { condition: 'skill_match', value: 0.5, action: 'send_auto_response' }
        ]
      }
    ];
  }

  async analyzeProfile(profile: ResponseProfile): Promise<{
    skillScore: number;
    availabilityScore: number;
    locationScore: number;
    overallScore: number;
  }> {
    // Mock scoring algorithm
    const skillScore = Math.min(profile.skills.length / 5, 1);
    const availabilityScore = profile.availability.immediate ? 1 : 0.7;
    const locationScore = profile.location ? 0.8 : 0.5;
    const verificationBonus = profile.verified ? 0.2 : 0;

    const overallScore = (skillScore + availabilityScore + locationScore) / 3 + verificationBonus;

    return {
      skillScore,
      availabilityScore,
      locationScore,
      overallScore: Math.min(overallScore, 1)
    };
  }

  async generateAutoResponse(
    profile: ResponseProfile,
    campaignId: string,
    jobDetails: any
  ): Promise<AutoResponse | null> {
    const analysis = await this.analyzeProfile(profile);
    
    // Determine appropriate template based on analysis
    let selectedTemplate: ResponseTemplate;
    
    if (analysis.overallScore > 0.8 && profile.availability.immediate) {
      selectedTemplate = this.templates.find(t => t.id === 'urgent_response')!;
    } else if (analysis.overallScore > 0.6) {
      selectedTemplate = this.templates.find(t => t.id === 'standard_response')!;
    } else {
      selectedTemplate = this.templates.find(t => t.id === 'follow_up')!;
    }

    // Generate personalized message
    const personalizedMessage = this.personalizeMessage(selectedTemplate, profile, jobDetails);

    const autoResponse: AutoResponse = {
      id: `response_${Date.now()}_${profile.id}`,
      campaignId,
      respondentProfile: profile,
      message: personalizedMessage,
      timestamp: new Date(),
      status: 'pending',
      template: selectedTemplate
    };

    return autoResponse;
  }

  private personalizeMessage(
    template: ResponseTemplate,
    profile: ResponseProfile,
    jobDetails: any
  ): string {
    let message = template.body;

    // Replace template variables
    const replacements: { [key: string]: string } = {
      name: profile.name,
      skills: profile.skills.join(', '),
      location: profile.location,
      required_skills: jobDetails?.requirements?.join(', ') || 'Various skills needed',
      duration: jobDetails?.estimatedDuration || 'To be determined',
      compensation: jobDetails?.compensation ? 
        `${jobDetails.compensation.amount} ${jobDetails.compensation.currency} per ${jobDetails.compensation.type}` : 
        'Competitive compensation',
      contact_info: jobDetails?.contactInfo ? 
        `${jobDetails.contactInfo.name} - ${jobDetails.contactInfo.email}` : 
        'Contact information will be provided',
      job_title: jobDetails?.title || 'Disaster Relief Position',
      previous_experience: profile.previousExperience.join(', ') || 'your background',
      available_positions: jobDetails?.category?.primary || 'Multiple positions available'
    };

    // Replace all template variables
    template.variables.forEach(variable => {
      const placeholder = new RegExp(`{{${variable}}}`, 'g');
      message = message.replace(placeholder, replacements[variable] || `[${variable}]`);
    });

    return message;
  }

  async shouldSendAutoResponse(profile: ResponseProfile, template: ResponseTemplate): Promise<boolean> {
    const analysis = await this.analyzeProfile(profile);

    for (const trigger of template.triggers) {
      switch (trigger.condition) {
        case 'skill_match':
          if (analysis.skillScore >= trigger.value) return true;
          break;
        case 'location_match':
          if (profile.location && trigger.value === true) return true;
          break;
        case 'availability':
          if (profile.availability.immediate && trigger.value === 'immediate') return true;
          break;
        case 'verification_status':
          if (profile.verified === trigger.value) return true;
          break;
      }
    }

    return false;
  }

  async getTemplates(): Promise<ResponseTemplate[]> {
    return this.templates;
  }

  async createTemplate(template: Omit<ResponseTemplate, 'id'>): Promise<ResponseTemplate> {
    const newTemplate: ResponseTemplate = {
      ...template,
      id: `template_${Date.now()}`
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, updates: Partial<ResponseTemplate>): Promise<ResponseTemplate | null> {
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.templates[index] = { ...this.templates[index], ...updates };
    return this.templates[index];
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const initialLength = this.templates.length;
    this.templates = this.templates.filter(t => t.id !== id);
    return this.templates.length < initialLength;
  }
}

export const responseManager = new ResponseManager();
