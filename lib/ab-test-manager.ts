import { Campaign, GeneratedContent, ContentVariation, ABTestConfig } from '@/types';

export class ABTestManager {
  private activeTests: Map<string, ABTestExecution> = new Map();

  async createABTest(
    campaign: Campaign,
    variations: ContentVariation[],
    config: ABTestConfig
  ): Promise<string> {
    const testId = `abtest_${Date.now()}`;
    
    const execution: ABTestExecution = {
      id: testId,
      campaignId: campaign.id,
      variations,
      config,
      startTime: new Date(),
      endTime: new Date(Date.now() + config.testDuration * 60 * 60 * 1000),
      status: 'running',
      currentWinner: null,
      results: new Map()
    };

    this.activeTests.set(testId, execution);
    
    // Initialize results tracking
    variations.forEach(variation => {
      execution.results.set(variation.id, {
        impressions: 0,
        engagement: 0,
        clicks: 0,
        shares: 0,
        conversionRate: 0
      });
    });

    return testId;
  }

  async recordMetric(
    testId: string,
    variationId: string,
    metric: keyof VariationPerformance,
    value: number
  ): Promise<void> {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') return;

    const results = test.results.get(variationId);
    if (!results) return;

    // Update the metric
    results[metric] += value;
    
    // Recalculate conversion rate
    if (results.impressions > 0) {
      results.conversionRate = results.clicks / results.impressions;
    }

    // Check if we should determine a winner
    await this.checkForWinner(testId);
  }

  private async checkForWinner(testId: string): Promise<void> {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') return;

    const now = new Date();
    const hasReachedMinimumSampleSize = this.hasMinimumSampleSize(test);
    const hasReachedTimeLimit = now >= test.endTime;

    if (hasReachedMinimumSampleSize || hasReachedTimeLimit) {
      const winner = this.determineWinner(test);
      test.currentWinner = winner;
      test.status = 'completed';
      test.endTime = now;

      // Notify about test completion
      console.log(`A/B Test ${testId} completed. Winner: ${winner?.name || 'No clear winner'}`);
    }
  }

  private hasMinimumSampleSize(test: ABTestExecution): boolean {
    const minimumSample = 100; // Minimum impressions per variation
    
    for (const results of test.results.values()) {
      if (results.impressions < minimumSample) {
        return false;
      }
    }
    
    return true;
  }

  private determineWinner(test: ABTestExecution): ContentVariation | null {
    const { config } = test;
    let bestVariation: ContentVariation | null = null;
    let bestScore = -1;

    for (const variation of test.variations) {
      const results = test.results.get(variation.id);
      if (!results) continue;

      let score = 0;
      
      switch (config.winnerCriteria) {
        case 'engagement':
          score = results.engagement;
          break;
        case 'reach':
          score = results.impressions;
          break;
        case 'clicks':
          score = results.clicks;
          break;
      }

      // Apply statistical significance check (simplified)
      const isSignificant = this.isStatisticallySignificant(test, variation.id);
      
      if (score > bestScore && isSignificant) {
        bestScore = score;
        bestVariation = variation;
      }
    }

    return bestVariation;
  }

  private isStatisticallySignificant(test: ABTestExecution, variationId: string): boolean {
    // Simplified statistical significance check
    // In production, you'd want a proper statistical test (z-test, chi-square, etc.)
    
    const results = test.results.get(variationId);
    if (!results || results.impressions < 30) return false;

    // Check if the difference is meaningful (at least 10% better)
    const otherVariations = Array.from(test.results.entries())
      .filter(([id]) => id !== variationId);

    if (otherVariations.length === 0) return false;

    const currentScore = this.getScore(results, test.config.winnerCriteria);
    
    for (const [_, otherResults] of otherVariations) {
      const otherScore = this.getScore(otherResults, test.config.winnerCriteria);
      if (otherScore > 0 && currentScore / otherScore < 1.1) {
        return false; // Not significantly better
      }
    }

    return true;
  }

  private getScore(results: VariationPerformance, criteria: ABTestConfig['winnerCriteria']): number {
    switch (criteria) {
      case 'engagement':
        return results.engagement;
      case 'reach':
        return results.impressions;
      case 'clicks':
        return results.clicks;
      default:
        return 0;
    }
  }

  async getTestResults(testId: string): Promise<ABTestResults | null> {
    const test = this.activeTests.get(testId);
    if (!test) return null;

    const variationResults = Array.from(test.results.entries()).map(([id, performance]) => {
      const variation = test.variations.find(v => v.id === id);
      return {
        variation: variation!,
        performance,
        isWinner: test.currentWinner?.id === id
      };
    });

    return {
      testId,
      campaignId: test.campaignId,
      status: test.status,
      startTime: test.startTime,
      endTime: test.endTime,
      config: test.config,
      variationResults,
      winner: test.currentWinner,
      insights: this.generateInsights(test)
    };
  }

  private generateInsights(test: ABTestExecution): string[] {
    const insights: string[] = [];
    const results = Array.from(test.results.entries());
    
    // Find best and worst performing variations
    const sorted = results.sort((a, b) => 
      this.getScore(b[1], test.config.winnerCriteria) - 
      this.getScore(a[1], test.config.winnerCriteria)
    );

    if (sorted.length >= 2) {
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      
      const bestScore = this.getScore(best[1], test.config.winnerCriteria);
      const worstScore = this.getScore(worst[1], test.config.winnerCriteria);
      
      if (worstScore > 0) {
        const improvement = ((bestScore - worstScore) / worstScore * 100).toFixed(1);
        insights.push(`Best variation performed ${improvement}% better than the worst`);
      }

      // Engagement rate insights
      if (best[1].impressions > 0) {
        const engagementRate = (best[1].engagement / best[1].impressions * 100).toFixed(1);
        insights.push(`Winner achieved ${engagementRate}% engagement rate`);
      }

      // Click-through rate insights
      if (best[1].impressions > 0) {
        const ctr = (best[1].clicks / best[1].impressions * 100).toFixed(2);
        insights.push(`Winner achieved ${ctr}% click-through rate`);
      }
    }

    // Duration insights
    const durationHours = (test.endTime.getTime() - test.startTime.getTime()) / (1000 * 60 * 60);
    insights.push(`Test completed in ${durationHours.toFixed(1)} hours`);

    return insights;
  }

  async getActiveTests(): Promise<ABTestResults[]> {
    const results: ABTestResults[] = [];
    
    for (const testId of this.activeTests.keys()) {
      const result = await this.getTestResults(testId);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  async stopTest(testId: string): Promise<boolean> {
    const test = this.activeTests.get(testId);
    if (!test) return false;

    test.status = 'stopped';
    test.endTime = new Date();
    
    // Determine winner before stopping
    const winner = this.determineWinner(test);
    test.currentWinner = winner;

    return true;
  }
}

interface ABTestExecution {
  id: string;
  campaignId: string;
  variations: ContentVariation[];
  config: ABTestConfig;
  startTime: Date;
  endTime: Date;
  status: 'running' | 'completed' | 'stopped';
  currentWinner: ContentVariation | null;
  results: Map<string, VariationPerformance>;
}

interface VariationPerformance {
  impressions: number;
  engagement: number;
  clicks: number;
  shares: number;
  conversionRate: number;
}

interface ABTestResults {
  testId: string;
  campaignId: string;
  status: 'running' | 'completed' | 'stopped';
  startTime: Date;
  endTime: Date;
  config: ABTestConfig;
  variationResults: {
    variation: ContentVariation;
    performance: VariationPerformance;
    isWinner: boolean;
  }[];
  winner: ContentVariation | null;
  insights: string[];
}

export const abTestManager = new ABTestManager();
