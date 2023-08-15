export class User {
  id: number;
  login: string;
  avatarUrl: string;
  installations: number[];
  emailNotificationsEnabled: boolean;
  email?: string;
}

export class CreateUser {
  id: number;
  login: string;
  avatarUrl: string;
  email?: string;
  emailNotificationsEnabled?: boolean;
} // TODO need to include which installations a user has access to and keep updating it

export class UpdateUser {
  id: number;
  login?: string;
  avatarUrl?: string;
  email?: string;
  emailNotificationsEnabled?: boolean;
}
