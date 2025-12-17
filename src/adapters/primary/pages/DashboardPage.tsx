import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GetUserFilesUseCase } from '@/core/usecases/GetUserFiles'
import { FileApiRepository } from '@/adapters/secondary/api/FileApiRepository'
import { File } from '@/core/domain/File'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'

const fileRepository = new FileApiRepository()
const getUserFilesUseCase = new GetUserFilesUseCase(fileRepository)

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingFile, setEditingFile] = useState<File | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return

    getUserFilesUseCase
      .execute(user.id)
      .then((userFiles) => {
        setFiles(userFiles)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load files')
        setLoading(false)
      })
  }, [user])

  const handleEdit = (file: File) => {
    setEditingFile(file)
    setEditName(file.name)
    setEditDescription(file.description || '')
  }

  const handleSaveEdit = async () => {
    if (!editingFile) return

    setSaving(true)
    try {
      await fileRepository.updateFile(editingFile.id, {
        filename: editName,
        description: editDescription,
      })

      // Refresh files list
      const updatedFiles = await getUserFilesUseCase.execute(user!.id)
      setFiles(updatedFiles)
      setEditingFile(null)
    } catch (err) {
      alert('Failed to update file: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      await fileRepository.deleteFile(fileId)
      setFiles(files.filter((f) => f.id !== fileId))
    } catch (err) {
      alert('Failed to delete file: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your files...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <p className="text-muted-foreground mt-2">{user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <Button variant="outline">Upload Files</Button>
            </Link>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 text-sm text-destructive p-3 bg-destructive/10 rounded-md max-w-4xl">
            {error}
          </div>
        )}

        <div className="max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Your Files</CardTitle>
              <CardDescription>
                {files.length} {files.length === 1 ? 'file' : 'files'} in your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No files uploaded yet.</p>
                  <Link to="/">
                    <Button className="mt-4">Upload Your First File</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <Link to={`/file/${file.id}`} className="hover:underline">
                          <p className="font-medium truncate">{file.name}</p>
                        </Link>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{file.sizeInMB} MB</span>
                          <span>{file.formattedDate}</span>
                          <span className="capitalize">{file.provider}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link to={`/file/${file.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(file)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit File Dialog */}
        <Dialog open={editingFile !== null} onOpenChange={() => setEditingFile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit File</DialogTitle>
              <DialogDescription>
                Update the file name and description
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="filename" className="text-sm font-medium">
                  File Name
                </label>
                <Input
                  id="filename"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter file name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter description (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingFile(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving || !editName.trim()}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
