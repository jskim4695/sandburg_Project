import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  constructor(
  ) {
      super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
      const authenticated = await super.canActivate(context);
      if (!authenticated) {
          throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
      }

      const req = context.switchToHttp().getRequest();
      const user = req.user;

      if (!user) {
        throw new UnauthorizedException('사용자 정보가 없습니다.');
    }

      if (!user.is_admin) {
          throw new ForbiddenException('관리자 권한이 필요합니다.');
      }

      return true;
  }
}
