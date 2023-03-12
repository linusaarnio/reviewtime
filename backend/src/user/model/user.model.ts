export class User {
  id: number;
  login: string;
  avatarUrl: string;
  installations: number[];
}

export class CreateUser {
  id: number;
  login: string;
  avatarUrl: string;
} // TODO need to include which installations a user has access to and keep updating it
