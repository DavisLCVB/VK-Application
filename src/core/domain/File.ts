import { Provider } from './types'

export interface FileMetadata {
  file_id: string
  filename: string
  mime_type: string
  size: number
  provider: Provider
  user_id: string | null
  created_at: string
}

// Response from backend (camelCase)
export interface FileInfoResponse {
  fileId: string
  fileName: string
  mimeType: string
  size: number
  userId: string | null
  uploadedAt: string
  downloadCount: number
  lastAccess: string
  deleteAt: string | null
  description: string | null
  serverId: string
}

export interface FileInfo extends FileMetadata {
  downloadCount?: number
  lastAccess?: string
  deleteAt?: string | null
  description?: string
}

export class File {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly size: number,
    public readonly mimeType: string,
    public readonly uploadedAt: Date,
    public readonly isAnonymous: boolean,
    public readonly provider: Provider,
    public readonly userId?: string,
    public readonly downloadCount?: number,
    public readonly description?: string
  ) {}

  get downloadUrl(): string {
    return `/file/${this.id}`
  }

  get sizeInMB(): string {
    return (this.size / (1024 * 1024)).toFixed(2)
  }

  get formattedDate(): string {
    return this.uploadedAt.toLocaleDateString()
  }

  static fromMetadata(metadata: FileMetadata): File {
    return new File(
      metadata.file_id,
      metadata.filename,
      metadata.size,
      metadata.mime_type,
      new Date(metadata.created_at),
      metadata.user_id === null,
      metadata.provider,
      metadata.user_id ?? undefined,
      undefined,
      undefined
    )
  }

  static fromFileInfo(info: FileInfo): File {
    return new File(
      info.file_id,
      info.filename,
      info.size,
      info.mime_type,
      new Date(info.created_at),
      info.user_id === null,
      info.provider,
      info.user_id ?? undefined,
      info.downloadCount,
      info.description
    )
  }

  static fromBackendResponse(response: FileInfoResponse): File {
    return new File(
      response.fileId,
      response.fileName,
      response.size,
      response.mimeType,
      new Date(response.uploadedAt),
      response.userId === null,
      'supabase', // Default provider, could be extracted from serverId or added to response
      response.userId ?? undefined,
      response.downloadCount,
      response.description ?? undefined
    )
  }
}
