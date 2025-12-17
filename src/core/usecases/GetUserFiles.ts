import { FileRepository } from '../ports/FileRepository'
import { File } from '../domain/File'

export class GetUserFilesUseCase {
  constructor(private readonly fileRepository: FileRepository) {}

  async execute(userId: string): Promise<File[]> {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Get list of file IDs from the user endpoint
    const fileIds = await this.fileRepository.getUserFiles(userId)

    // Fetch full metadata for each file ID
    const filePromises = fileIds.map(async (fileId) => {
      const fileInfo = await this.fileRepository.getFileInfo(fileId)
      return File.fromFileInfo(fileInfo)
    })

    return Promise.all(filePromises)
  }
}
