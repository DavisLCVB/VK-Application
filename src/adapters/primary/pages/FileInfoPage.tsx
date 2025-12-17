import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FileApiRepository } from '@/adapters/secondary/api/FileApiRepository'
import { FileInfo } from '@/core/domain/File'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const fileRepository = new FileApiRepository()

export default function FileInfoPage() {
  const { fileId } = useParams<{ fileId: string }>()
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fileId) return

    fileRepository
      .getFileInfo(fileId)
      .then((info) => {
        setFileInfo(info)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load file info')
        setLoading(false)
      })
  }, [fileId])

  const handleDownload = () => {
    if (!fileId) return

    const downloadUrl = fileRepository.getDownloadUrl(fileId)
    window.location.href = downloadUrl
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading file information...</div>
      </div>
    )
  }

  if (error || !fileInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error || 'File not found'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/">
                <Button>Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <Link to="/">
            <Button variant="ghost">← Back to Home</Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>{fileInfo.filename}</CardTitle>
              <CardDescription>File Information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">File ID</p>
                  <p className="font-mono text-sm">{fileInfo.file_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-sm">{fileInfo.mime_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="text-sm">{(fileInfo.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provider</p>
                  <p className="text-sm capitalize">{fileInfo.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="text-sm">{new Date(fileInfo.created_at).toLocaleDateString()}</p>
                </div>
                {fileInfo.downloadCount !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                    <p className="text-sm">{fileInfo.downloadCount}</p>
                  </div>
                )}
              </div>

              {fileInfo.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{fileInfo.description}</p>
                </div>
              )}

              <Button onClick={handleDownload} className="w-full">
                Download File
              </Button>

              {fileInfo.user_id === null && (
                <div className="text-xs text-muted-foreground text-center">
                  This is an anonymous upload and will be automatically deleted after expiration
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
