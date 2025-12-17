export interface UserInfo {
  uid: string
  file_count: number
  total_space: number
  used_space: number
  created_at?: string
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly fileCount: number = 0,
    public readonly totalSpace: number = 1073741824, // 1GB default
    public readonly usedSpace: number = 0,
    public readonly createdAt?: Date
  ) {}

  get availableSpace(): number {
    return this.totalSpace - this.usedSpace
  }

  get usedSpacePercentage(): number {
    return (this.usedSpace / this.totalSpace) * 100
  }

  get totalSpaceInGB(): string {
    return (this.totalSpace / (1024 * 1024 * 1024)).toFixed(2)
  }

  get usedSpaceInMB(): string {
    return (this.usedSpace / (1024 * 1024)).toFixed(2)
  }

  get availableSpaceInMB(): string {
    return (this.availableSpace / (1024 * 1024)).toFixed(2)
  }

  canUpload(fileSize: number): boolean {
    return this.availableSpace >= fileSize
  }

  static fromUserInfo(info: UserInfo, email: string): User {
    return new User(
      info.uid,
      email,
      info.file_count,
      info.total_space,
      info.used_space,
      info.created_at ? new Date(info.created_at) : undefined
    )
  }
}
