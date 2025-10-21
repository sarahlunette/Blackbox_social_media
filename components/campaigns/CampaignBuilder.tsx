'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Target, MapPin, AlertCircle } from 'lucide-react';
import { Campaign, DisasterType, TargetAudience } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastProvider';

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prompt: z.string().min(10, 'Content prompt is required'),
  mediaType: z.enum(['image', 'video', 'mixed']),
  disasterType: z.enum(['hurricane', 'earthquake', 'flood', 'wildfire', 'tornado', 'other']),
  disasterDescription: z.string().min(5, 'Disaster description is required'),
  location: z.string().min(1, 'Location is required'),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'critical']),
  scheduledAt: z.string().optional(),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignBuilderProps {
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
  initialData?: Partial<Campaign>;
}

export function CampaignBuilder({ onSave, onCancel, initialData }: CampaignBuilderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      prompt: initialData?.content?.prompt || '',
      mediaType: initialData?.content?.mediaType || 'image',
      disasterType: initialData?.targetAudience?.disasterType?.type || 'hurricane',
      disasterDescription: initialData?.targetAudience?.disasterType?.description || '',
      location: initialData?.targetAudience?.location || '',
      urgencyLevel: initialData?.targetAudience?.urgencyLevel || 'medium',
      platforms: initialData?.platforms?.filter(p => p.enabled).map(p => p.id) || [],
    }
  });

  const selectedPlatforms = watch('platforms') || [];
  const urgencyLevel = watch('urgencyLevel');

  const platformOptions = [
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter', color: 'bg-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
  ];

  const onSubmit = async (data: CampaignFormData) => {
    setIsLoading(true);
    
    try {
      const disasterType: DisasterType = {
        type: data.disasterType,
        description: data.disasterDescription,
        affectedAreas: [data.location],
        estimatedDuration: data.urgencyLevel === 'critical' ? 7 : 
                           data.urgencyLevel === 'high' ? 14 : 
                           data.urgencyLevel === 'medium' ? 30 : 60,
      };

      const targetAudience: TargetAudience = {
        location: data.location,
        demographics: {
          ageRange: [18, 65],
          interests: ['community service', 'disaster relief', 'volunteering'],
          occupation: ['construction', 'healthcare', 'logistics', 'administration'],
        },
        disasterType,
        urgencyLevel: data.urgencyLevel,
      };

      const campaign: Campaign = {
        id: initialData?.id || `campaign_${uuidv4()}`,
        name: data.name,
        description: data.description,
        status: 'draft',
        createdAt: initialData?.createdAt || new Date(),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        platforms: platformOptions
          .filter(p => data.platforms.includes(p.id))
          .map(p => ({
            id: p.id,
            name: p.name as any,
            enabled: true,
            settings: {
              autoPost: false,
              scheduledTimes: ['09:00', '14:00', '18:00'],
              hashtagStrategy: 'auto' as const,
            }
          })),
        content: {
          prompt: data.prompt,
          mediaType: data.mediaType,
          generatedContent: [],
          variations: [],
        },
        analytics: {
          totalReach: 0,
          totalEngagement: 0,
          totalClicks: 0,
          conversionRate: 0,
          costPerEngagement: 0,
          platformBreakdown: [],
          timeSeriesData: [],
          topPerformingContent: [],
        },
        targetAudience,
      };

      await onSave(campaign);
      showToast('success', 'Campaign created successfully!');
    } catch (error) {
      showToast('error', 'Failed to create campaign. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    const current = selectedPlatforms || [];
    const updated = current.includes(platformId)
      ? current.filter(id => id !== platformId)
      : [...current, platformId];
    setValue('platforms', updated);
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {initialData ? 'Edit Campaign' : 'Create New Campaign'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Build targeted disaster relief job postings with AI-generated content
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary-600" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name *
              </label>
              <input
                {...register('name')}
                type="text"
                className="input-field"
                placeholder="e.g., Hurricane Relief Workers - Miami"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                {...register('location')}
                type="text"
                className="input-field"
                placeholder="e.g., Miami, FL"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="Describe the campaign goals and target audience..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Disaster Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Disaster Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disaster Type *
              </label>
              <select {...register('disasterType')} className="input-field">
                <option value="hurricane">Hurricane</option>
                <option value="earthquake">Earthquake</option>
                <option value="flood">Flood</option>
                <option value="wildfire">Wildfire</option>
                <option value="tornado">Tornado</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urgency Level *
              </label>
              <select {...register('urgencyLevel')} className="input-field">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disaster Description *
            </label>
            <textarea
              {...register('disasterDescription')}
              rows={2}
              className="input-field"
              placeholder="Brief description of the disaster situation..."
            />
            {errors.disasterDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.disasterDescription.message}</p>
            )}
          </div>

          {/* Urgency Indicator */}
          <div className={`p-3 rounded-lg border ${getUrgencyColor(urgencyLevel)}`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Urgency Level: {urgencyLevel?.charAt(0).toUpperCase() + urgencyLevel?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Generation */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Content Generation</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Prompt *
            </label>
            <textarea
              {...register('prompt')}
              rows={3}
              className="input-field"
              placeholder="Describe what kind of content you want to generate. Be specific about job requirements, skills needed, and urgency..."
            />
            {errors.prompt && (
              <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  {...register('mediaType')}
                  type="radio"
                  value="image"
                  className="mr-2"
                />
                Images
              </label>
              <label className="flex items-center">
                <input
                  {...register('mediaType')}
                  type="radio"
                  value="video"
                  className="mr-2"
                />
                Videos
              </label>
              <label className="flex items-center">
                <input
                  {...register('mediaType')}
                  type="radio"
                  value="mixed"
                  className="mr-2"
                />
                Mixed Content
              </label>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platformOptions.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 text-left
                  ${selectedPlatforms.includes(platform.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                  <span className="font-medium">{platform.name}</span>
                </div>
              </button>
            ))}
          </div>
          {errors.platforms && (
            <p className="text-sm text-red-600">{errors.platforms.message}</p>
          )}
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary-600" />
            Scheduling (Optional)
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule for Later
            </label>
            <input
              {...register('scheduledAt')}
              type="datetime-local"
              className="input-field"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner size="sm" color="white" />}
            {initialData ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
}
