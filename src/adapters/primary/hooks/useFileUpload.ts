import { useState } from 'react'
import { UploadFileUseCase } from '@/core/usecases/UploadFile'
import { FileApiRepository } from '@/adapters/secondary/api/FileApiRepository'
import { UploadResult } from '@/core/domain/types'

const fileRepository = new FileApiRepository()
const uploadFileUseCase = new UploadFileUseCase(fileRepository)

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadFile = async (
    file: File,
    options: {
      userId?: string
      description?: string
    } = {}
  ): Promise<UploadResult | null> => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const result = await uploadFileUseCase.execute(file, {
        ...options,
        onProgress: (p) => setProgress(p),
      })

      setProgress(100)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      return null
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    uploadFile,
    uploading,
    progress,
    error,
    reset,
  }
}
