import { ApiProperty } from '@nestjs/swagger';

export class AuthorizeResponse {
  @ApiProperty({ type: String, format: 'url' })
  public readonly authorization_url!: string;
}

export class AuthorizationCallbackRequest {
  @ApiProperty({ type: String })
  public readonly state!: string;

  @ApiProperty({ type: String })
  public readonly code!: string;
}

export class LoggedInUserResponse {
  @ApiProperty({ type: Number })
  public readonly id!: number;

  @ApiProperty({ type: String })
  public readonly login!: string;

  @ApiProperty({ type: String, format: 'url' })
  public readonly avatar_url!: string;

  @ApiProperty({ type: Number, isArray: true })
  public readonly installations!: number[];
}
