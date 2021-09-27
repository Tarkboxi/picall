export class UserNotification {
  success: string[];
  error: string[];
  public constructor(init?:Partial<UserNotification>) {
    Object.assign(this, init);
  }
}
