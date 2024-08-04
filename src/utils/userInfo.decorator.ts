import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('유저 정보가 존재하지 않습니다. 인증이 필요합니다.');
    }

    if (data) {
      return user[data];
    }
    return user;
  },
);
