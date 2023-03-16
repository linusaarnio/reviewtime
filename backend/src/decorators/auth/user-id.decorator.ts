import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.session.userId === undefined) {
      throw new UnauthorizedException(
        'Tried to get userId through param decorator, but there was no userId in session! Remember to only use this param in auth-guarded endpoints',
      );
    }
    return request.session.userId;
  },
);
