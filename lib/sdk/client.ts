export interface FlagFeatureConfig {
  apiKey: string;
  projectId: string;
  environment: string;
  baseUrl?: string;
  cacheTTL?: number;
}

export class FlagFeatureClient {
  private apiKey: string;
  private projectId: string;
  private environment: string;
  private baseUrl: string;
  private cache: Map<string, { value: boolean; expiry: number }> = new Map();
  private cacheTTL: number;

  constructor(config: FlagFeatureConfig) {
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.environment = config.environment;
    this.baseUrl = config.baseUrl || "http://localhost:3000";
    this.cacheTTL = config.cacheTTL || 60000;
  }

  async isEnabled(flagKey: string): Promise<boolean> {
    const cached = this.cache.get(flagKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }

    const flags = await this.getAllFlags();
    return flags[flagKey] || false;
  }

  async getAllFlags(): Promise<Record<string, boolean>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/sdk/evaluate?projectId=${this.projectId}&environment=${this.environment}`,
        {
          headers: {
            "x-api-key": this.apiKey,
          },
        },
      );

      if (!response.ok) {
        console.error("FlagFeature: Failed to fetch flags");
        return {};
      }

      const data = await response.json();

      const expiry = Date.now() + this.cacheTTL;
      Object.entries(data.flags).forEach(([key, value]) => {
        this.cache.set(key, { value: value as boolean, expiry });
      });

      return data.flags;
    } catch (error) {
      console.error("FlagFeature: Error fetching flags", error);
      return {};
    }
  }

  clearCache() {
    this.cache.clear();
  }

  async initialize(): Promise<void> {
    await this.getAllFlags();
  }
}
