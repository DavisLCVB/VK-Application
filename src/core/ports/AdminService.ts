export interface InstanceInfo {
  server_id: string
  provider: 'supabase' | 'gdrive'
  server_url?: string
  server_name?: string
  created_at: string
  status?: 'online' | 'offline' | 'unknown'
}

export interface BackendStatus {
  server_id: string
  server_name: string
  server_url: string
  provider: 'supabase' | 'gdrive'
  is_healthy: boolean
  consecutive_failures: number
}

export interface HealthCheckResponse {
  load_balancer: string
  total_backends: number
  healthy_backends: number
  backends: BackendStatus[]
}

export interface AdminService {
  /**
   * Get all service instances
   * Requires X-VAULT-KRATE-SECRET header
   */
  getAllInstances(): Promise<InstanceInfo[]>

  /**
   * Get specific instance details
   * @param serverId - Server ID
   */
  getInstance(serverId: string): Promise<InstanceInfo>

  /**
   * Check health and get stats from the load balancer
   */
  checkHealth(): Promise<HealthCheckResponse>

  /**
   * Update instance configuration
   * @param serverId - Server ID
   * @param updates - Fields to update
   */
  updateInstance(
    serverId: string,
    updates: Partial<Pick<InstanceInfo, 'provider' | 'server_url' | 'server_name'>>
  ): Promise<InstanceInfo>
}
