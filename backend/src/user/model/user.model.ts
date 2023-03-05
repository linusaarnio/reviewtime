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
} // TODO need to include creation of installations at some point
