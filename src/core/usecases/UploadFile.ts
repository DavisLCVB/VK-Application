import { FileRepository } from '../ports/FileRepository'
import { UploadResult } from '../domain/types'

export class UploadFileUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(
    file: globalThis.File,
    options: {
      userId?: string
      description?: string
      onProgress?: (progress: number) => void
    } = {}
  ): Promise<UploadResult> {
    // Validate file
    if (!file) {
      throw new Error('No file provided')
    }

    if (file.size === 0) {
      throw new Error('File is empty')
    }

    // Get upload token
    const { token } = await this.fileRepository.getUploadToken(options.userId)

    // Upload file
    const result = await this.fileRepository.uploadFile(file, token, {
      description: options.description,
      userId: options.userId,
    })

    return result
  }
}
