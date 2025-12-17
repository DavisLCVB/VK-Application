import { UserInfo } from '../domain/User'

export interface UserService {
  /**
   * Create a user in the backend system
   * @param uid - Supabase user ID
   * @returns User information
   */
  createUser(uid: string): Promise<UserInfo>

  /**
   * Get user information from backend
   * @param uid - User ID
   * @returns User information
   */
  getUserInfo(uid: string): Promise<UserInfo>

  /**
   * Update user information
   * @param uid - User ID
   * @param updates - Fields to update
   * @returns Updated user information
   */
  updateUser(
    uid: string,
    updates: Partial<Pick<UserInfo, 'file_count' | 'total_space' | 'used_space'>>
  ): Promise<UserInfo>

  /**
   * Delete user from backend
   * @param uid - User ID
   */
  deleteUser(uid: string): Promise<void>
}
