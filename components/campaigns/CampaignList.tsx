'use client';

import { useState } from 'react';
import { Campaign, GeneratedContent } from '@/types';
import { 
  Play, 
  Pause, 
  Calendar, 
  BarChart3, 
  Eye, 
  Share2, 
  MessageCircle,
  Settings,
  MoreVertical,
  Trash2,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';

interface CampaignListProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
  onViewAnalytics: (campaign: Campaign) => void;
  onToggleStatus: (campaignId: string) => void;
}

export function CampaignList({ 
  campaigns, 
  onEdit, 
  onDelete, 
  onViewAnalytics, 
  onToggleStatus 
}: CampaignListProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'scheduled': return 'status-scheduled';
      case 'draft': return 'status-draft';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'status-failed';
      default: return 'status-draft';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-4">
      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600">Create your first campaign to start generating disaster relief content.</p>
        </div>
      ) : (
        campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {campaign.name}
                  </h3>
                  <span className={`status-badge ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                  <span className={`status-badge border ${getUrgencyColor(campaign.targetAudience.urgencyLevel)}`}>
                    {campaign.targetAudience.urgencyLevel} priority
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{campaign.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created {format(campaign.createdAt, 'MMM dd, yyyy')}
                  </div>
                  {campaign.scheduledAt && (
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      Scheduled {format(campaign.scheduledAt, 'MMM dd, HH:mm')}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {campaign.platforms.filter(p => p.enabled).length} platforms
                  </div>
                </div>

                {/* Platform indicators */}
                <div className="flex items-center gap-2 mb-4">
                  {campaign.platforms.filter(p => p.enabled).map((platform) => (
                    <div
                      key={platform.id}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700"
                    >
                      {platform.name}
                    </div>
                  ))}
                </div>

                {/* Analytics summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatNumber(campaign.analytics.totalReach)}
                    </div>
                    <div className="text-xs text-gray-500">Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatNumber(campaign.analytics.totalEngagement)}
                    </div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatNumber(campaign.analytics.totalClicks)}
                    </div>
                    <div className="text-xs text-gray-500">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {(campaign.analytics.conversionRate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Conversion</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => onToggleStatus(campaign.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Activate campaign"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}
                
                {campaign.status === 'active' && (
                  <button
                    onClick={() => onToggleStatus(campaign.id)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Pause campaign"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                )}

                <button
                  onClick={() => onViewAnalytics(campaign)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View analytics"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setSelectedCampaign(
                      selectedCampaign === campaign.id ? null : campaign.id
                    )}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {selectedCampaign === campaign.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onEdit(campaign);
                            setSelectedCampaign(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit campaign
                        </button>
                        <button
                          onClick={() => {
                            onViewAnalytics(campaign);
                            setSelectedCampaign(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View details
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this campaign?')) {
                              onDelete(campaign.id);
                              setSelectedCampaign(null);
                            }
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete campaign
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content preview */}
            {campaign.content.generatedContent.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Generated Content</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {campaign.content.generatedContent.slice(0, 3).map((content) => (
                    <div
                      key={content.id}
                      className="bg-gray-50 rounded-lg p-3 border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {content.type}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {content.platform}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-3">
                        {content.caption}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {content.hashtags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
