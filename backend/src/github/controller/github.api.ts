import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeResponse {
  @ApiProperty({ type: String, format: 'url' })
  public readonly redirect_url!: string;
}

export class AuthorizationCallbackRequest {
  @ApiProperty({ type: String })
  public readonly state!: string;

  @ApiProperty({ type: String })
  public readonly code!: string;
}
