import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

export function Authenticated() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiCookieAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
