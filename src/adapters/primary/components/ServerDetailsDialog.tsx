import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { InstanceInfo } from '@/core/ports/AdminService'
import { AdminApiService } from '@/adapters/secondary/api/AdminApiService'
import { Button } from './ui/button'
import {
  Server,
  Database,
  HardDrive,
  CheckCircle2,
  XCircle,
  Clock,
  Link as LinkIcon,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react'

interface ServerDetailsDialogProps {
  serverId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const adminService = new AdminApiService()

export function ServerDetailsDialog({ serverId, open, onOpenChange }: ServerDetailsDialogProps) {
  const [instance, setInstance] = useState<InstanceInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (serverId && open) {
      loadInstanceDetails(serverId)
    }
  }, [serverId, open])

  const loadInstanceDetails = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getInstance(id)
      setInstance(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load instance details')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (serverId) {
      loadInstanceDetails(serverId)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'supabase':
        return <Database className="w-5 h-5 text-[hsl(var(--green))]" />
      case 'gdrive':
        return <HardDrive className="w-5 h-5 text-[hsl(var(--primary))]" />
      default:
        return <Server className="w-5 h-5" />
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {instance && getProviderIcon(instance.provider)}
            <span>Server Details</span>
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading server details...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-[hsl(var(--destructive))]/10 border border-[hsl(var(--destructive))]/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-[hsl(var(--destructive))]" />
              <p className="text-sm text-[hsl(var(--destructive))] font-medium">Error</p>
            </div>
            <p className="text-sm text-[hsl(var(--destructive))]/80">{error}</p>
          </div>
        )}

        {!loading && !error && instance && (
          <div className="space-y-6">
            {/* Header with Provider Badge and Status */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 text-sm font-medium rounded-full border flex items-center gap-2 ${getProviderBadgeColor(
                    instance.provider
                  )}`}
                >
                  {getProviderIcon(instance.provider)}
                  {instance.provider.toUpperCase()}
                </span>
                {instance.status === 'online' ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[hsl(var(--green))]" />
                    <span className="text-sm text-[hsl(var(--green))] font-medium">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-[hsl(var(--destructive))]" />
                    <span className="text-sm text-[hsl(var(--destructive))] font-medium">Offline</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {/* Server Name */}
            {instance.server_name && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Server Name</label>
                <p className="text-lg font-semibold">{instance.server_name}</p>
              </div>
            )}

            {/* Server ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Server ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">
                  {instance.server_id}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(instance.server_id)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Server URL */}
            {instance.server_url && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Server URL
                </label>
                <div className="flex items-center gap-2">
                  <a
                    href={instance.server_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-muted rounded text-sm hover:bg-accent transition-colors text-primary hover:underline"
                  >
                    {instance.server_url}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(instance.server_url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </Button>
                </div>
              </div>
            )}

            {/* Provider Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Provider Type</label>
              <p className="text-sm capitalize">{instance.provider}</p>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Created At
              </label>
              <p className="text-sm">{new Date(instance.created_at).toLocaleString()}</p>
            </div>

            {/* Health Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Health Status</label>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      instance.status === 'online'
                        ? 'bg-[hsl(var(--green))]/20 text-[hsl(var(--green))]'
                        : 'bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))]'
                    }`}
                  >
                    {instance.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              {instance.server_url && (
                <Button
                  onClick={() => window.open(instance.server_url, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Server
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
