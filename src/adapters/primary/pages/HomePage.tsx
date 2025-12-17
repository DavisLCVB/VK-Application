import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useFileUpload } from '../hooks/useFileUpload'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { config } from '@/infrastructure/config/env'

export default function HomePage() {
  const { user } = useAuth()
  const { uploadFile, uploading, error } = useFileUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<{ fileId: string; downloadUrl: string } | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setUploadResult(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const result = await uploadFile(selectedFile, {
      userId: user?.id,
    })

    if (result) {
      setUploadResult(result)
      setSelectedFile(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Vault-Krate File Upload
          </h1>
          <div className="flex gap-4">
            <Link to="/admin">
              <Button variant="outline">Admin</Button>
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                {user
                  ? 'Upload a file to your account (permanent storage)'
                  : 'Upload a file anonymously (temporary storage)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="cursor-pointer"
                />
              </div>

              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>

              {error && (
                <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              {uploadResult && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md space-y-3">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    File uploaded successfully!
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Download URL:</p>
                    <div className="flex gap-2">
                      <Input
                        value={`${config.app.url}/file/${uploadResult.fileId}`}
                        readOnly
                        className="text-sm font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(`${config.app.url}/file/${uploadResult.fileId}`)
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Link
                    to={uploadResult.downloadUrl}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline block"
                  >
                    View file details →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {!user && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Want permanent storage?{' '}
                <Link to="/auth" className="text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
