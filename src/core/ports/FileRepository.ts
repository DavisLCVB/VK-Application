import { File, FileInfo, FileMetadata } from '../domain/File'
import { UploadToken, UploadResult } from '../domain/types'

export interface FileRepository {
  /**
   * Get upload token from backend
   * @param userId - Optional user ID for authenticated uploads
   * @returns Upload token with expiration
   */
  getUploadToken(userId?: string): Promise<UploadToken>

  /**
   * Upload a file to the backend
   * @param file - File to upload
   * @param token - Upload token
   * @param options - Upload options (description, etc.)
   * @returns Upload result with file ID and download URL
   */
  uploadFile(
    file: globalThis.File,
    token: string,
    options?: {
      description?: string
      userId?: string
    }
  ): Promise<UploadResult>

  /**
   * Get file metadata by ID
   * @param fileId - File ID
   * @returns File information
   */
  getFileInfo(fileId: string): Promise<FileInfo>

  /**
   * Get all file IDs for a user
   * @param userId - User ID
   * @returns List of file IDs
   */
  getUserFiles(userId: string): Promise<string[]>

  /**
   * Update file metadata
   * @param fileId - File ID
   * @param updates - Fields to update
   * @returns Updated file info
   */
  updateFile(
    fileId: string,
    updates: { filename?: string; description?: string }
  ): Promise<FileInfo>

  /**
   * Delete a file
   * @param fileId - File ID
   */
  deleteFile(fileId: string): Promise<void>

  /**
   * Get download URL for a file
   * @param fileId - File ID
   * @returns Full download URL
   */
  getDownloadUrl(fileId: string): string

  /**
   * Download file content
   * @param fileId - File ID
   * @returns File blob
   */
  downloadFile(fileId: string): Promise<Blob>
}
