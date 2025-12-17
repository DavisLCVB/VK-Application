// Common types used across the domain

export type Provider = 'supabase' | 'gdrive'

export interface UploadToken {
  token: string
  expires_at: string
}

export interface UploadResult {
  fileId: string
  downloadUrl: string
}

export interface FileUploadOptions {
  isAnonymous: boolean
  userId?: string
  description?: string
}
