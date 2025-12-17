import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { User } from '@/core/domain/User'
import { File } from '@/core/domain/File'
import {
  BarChart3,
  FileText,
  HardDrive,
  Calendar,
  Clock,
  Database,
} from 'lucide-react'

interface UserStatsCardProps {
  user: User | null
  files: File[]
}

export function UserStatsCard({ user, files }: UserStatsCardProps) {
  if (!user) {
    return null
  }

  const getStorageColor = () => {
    const percentage = user.usedSpacePercentage
    if (percentage < 50) return 'bg-[hsl(var(--green))]'
    if (percentage < 80) return 'bg-[hsl(var(--yellow))]'
    return 'bg-[hsl(var(--destructive))]'
  }

  const getProviderCount = (provider: string) => {
    return files.filter((f) => f.provider === provider).length
  }

  const getLastUploadDate = () => {
    if (files.length === 0) return 'No uploads yet'

    const latest = files.reduce((latest, file) => {
      const fileDate = new Date(file.uploadedAt)
      const latestDate = new Date(latest.uploadedAt)
      return fileDate > latestDate ? file : latest
    })

    const date = new Date(latest.uploadedAt)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="sticky top-4 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          Usage Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Storage Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium">{user.usedSpacePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${getStorageColor()}`}
              style={{ width: `${Math.min(user.usedSpacePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {user.usedSpaceInMB} MB / {user.totalSpaceInGB} GB
          </p>
        </div>

        {/* File Count */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Files</span>
          </div>
          <span className="text-lg font-bold">{user.fileCount}</span>
        </div>

        {/* Available Space */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <span className="text-sm font-medium">{user.availableSpaceInMB} MB</span>
        </div>

        {/* Account Created */}
        {user.createdAt && (
          <div className="space-y-1.5 py-3 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium">Account Created</span>
            </div>
            <p className="text-sm pl-6">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        {/* Last Upload */}
        <div className="space-y-1.5 py-3 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Last Upload</span>
          </div>
          <p className="text-sm pl-6">{getLastUploadDate()}</p>
        </div>

        {/* Storage by Provider */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-3">Storage by Provider</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[hsl(var(--green))]/10 rounded-lg border border-[hsl(var(--green))]/20">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[hsl(var(--green))]" />
                <span className="text-sm">Supabase</span>
              </div>
              <span className="font-bold text-[hsl(var(--green))]">
                {getProviderCount('supabase')}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[hsl(var(--primary))]/10 rounded-lg border border-[hsl(var(--primary))]/20">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[hsl(var(--primary))]" />
                <span className="text-sm">Google Drive</span>
              </div>
              <span className="font-bold text-[hsl(var(--primary))]">
                {getProviderCount('gdrive')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
