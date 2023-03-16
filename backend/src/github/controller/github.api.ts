export class AuthorizeResponse {
  authorization_url: string;
}

export class AuthorizationCallbackRequest {
  state: string;

  code: string;
}

export class AuthorizationCallbackResponse {
  success: boolean;
}
