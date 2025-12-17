import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminApiService } from '@/adapters/secondary/api/AdminApiService'
import { InstanceInfo } from '@/core/ports/AdminService'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ServerDetailsDialog } from '../components/ServerDetailsDialog'
import {
  RefreshCw,
  Server,
  Database,
  HardDrive,
  CheckCircle2,
  XCircle,
  Info,
  Eye,
  Clock,
  BarChart3,
  Home,
} from 'lucide-react'

const adminService = new AdminApiService()

export default function AdminPage() {
  const [instances, setInstances] = useState<InstanceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadInstances = async () => {
    try {
      setError(null)
      const data = await adminService.getAllInstances()
      setInstances(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load instances')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadInstances()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadInstances()
  }

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'supabase':
        return 'bg-[hsl(var(--green))]/20 text-[hsl(var(--green))] border-[hsl(var(--green))]/30'
      case 'gdrive':
        return 'bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'supabase':
        return <Database className="w-4 h-4" />
      case 'gdrive':
        return <HardDrive className="w-4 h-4" />
      default:
        return <Server className="w-4 h-4" />
    }
  }

  const healthyCount = instances.filter((i) => i.status === 'online').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <div className="text-lg text-foreground">Loading admin panel...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground mt-2">Service Instances & Load Balancer Status</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-[hsl(var(--destructive))]" />
              <p className="text-sm text-[hsl(var(--destructive))] font-medium">Error</p>
            </div>
            <p className="text-sm text-[hsl(var(--destructive))]/80 mt-1">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Make sure VITE_VAULT_KRATE_SECRET is configured in your .env file
            </p>
          </div>
        )}

        <div className="grid gap-8">
          {/* Summary Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Load Balancer Overview
              </CardTitle>
              <CardDescription>Active service instances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/5 rounded-lg border border-[hsl(var(--primary))]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Server className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Instances</p>
                  </div>
                  <p className="text-4xl font-bold mt-2">{instances.length}</p>
                  {healthyCount === instances.length && instances.length > 0 && (
                    <div className="flex items-center gap-1 mt-3">
                      <CheckCircle2 className="w-4 h-4 text-[hsl(var(--green))]" />
                      <span className="text-xs text-[hsl(var(--green))]">All systems operational</span>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gradient-to-br from-[hsl(var(--green))]/10 to-[hsl(var(--green))]/5 rounded-lg border border-[hsl(var(--green))]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="w-5 h-5 text-[hsl(var(--green))]" />
                    <p className="text-sm text-muted-foreground">Supabase Instances</p>
                  </div>
                  <p className="text-4xl font-bold mt-2 text-[hsl(var(--green))]">
                    {instances.filter((i) => i.provider === 'supabase').length}
                  </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-[hsl(var(--accent))]/10 to-[hsl(var(--accent))]/5 rounded-lg border border-[hsl(var(--accent))]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <HardDrive className="w-5 h-5 text-[hsl(var(--accent))]" />
                    <p className="text-sm text-muted-foreground">Google Drive Instances</p>
                  </div>
                  <p className="text-4xl font-bold mt-2 text-[hsl(var(--accent))]">
                    {instances.filter((i) => i.provider === 'gdrive').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instances List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Service Instances
              </CardTitle>
              <CardDescription>All registered backend instances</CardDescription>
            </CardHeader>
            <CardContent>
              {instances.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Server className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No instances found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {instances.map((instance, idx) => (
                    <div
                      key={
                        instance.serverId ||
                        instance.serverUrl ||
                        instance.serverName ||
                        `${instance.provider}-${idx}`
                      }
                      className="flex items-center justify-between p-6 border border-border rounded-lg hover:bg-accent/10 transition-all duration-200 hover:shadow-md hover:border-accent/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border flex items-center gap-2 ${getProviderBadgeColor(
                              instance.provider
                            )}`}
                          >
                            {getProviderIcon(instance.provider)}
                            {instance.provider.toUpperCase()}
                          </span>
                          {instance.status === 'online' ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-[hsl(var(--green))]" />
                              <span className="text-xs text-[hsl(var(--green))] font-medium">Online</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 text-[hsl(var(--destructive))]" />
                              <span className="text-xs text-[hsl(var(--destructive))] font-medium">
                                Offline
                              </span>
                            </div>
                          )}
                          {instance.serverName && (
                            <span className="text-sm font-medium text-foreground">
                              {instance.serverName}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded">
                              {instance.serverId}
                            </span>
                          </p>
                          {instance.serverUrl && (
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <span className="font-medium">URL:</span>
                              <a
                                href={instance.serverUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-primary hover:text-primary/80 transition-colors"
                              >
                                {instance.serverUrl}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => {
                            setSelectedServerId(instance.serverId)
                            setDialogOpen(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                System Information
              </CardTitle>
              <CardDescription>Current configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">API Base URL:</span>
                  <span className="font-mono text-xs bg-muted px-3 py-1.5 rounded">
                    {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Admin Access:</span>
                  <span className="flex items-center gap-2">
                    {import.meta.env.VITE_VAULT_KRATE_SECRET ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--green))]" />
                        <span className="text-[hsl(var(--green))] font-medium">Configured</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-[hsl(var(--destructive))]" />
                        <span className="text-[hsl(var(--destructive))] font-medium">Not configured</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Refresh:
                  </span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Server Details Dialog */}
      <ServerDetailsDialog
        serverId={selectedServerId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
