export interface IDeleteUserUseCase {
  execute(adminUserId: string, userIdToDelete: string): Promise<boolean>;
}
