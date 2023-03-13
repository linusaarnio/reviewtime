import { IsEmail } from 'class-validator';

export class LoggedInUserResponse {
  id: number;

  login: string;

  avatar_url: string;

  installations: number[];
}

export class UpdateEmailRequest {
  @IsEmail()
  email: string;

  emailNotificationsEnabled: boolean;
}

export class SettingsResponse {
  email?: string;
  emailNotificationsEnabled: boolean;
}
