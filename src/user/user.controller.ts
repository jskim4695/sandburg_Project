import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from './entities/user.entity';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { RemoveUserDto } from './dto/userLeave.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
@ApiTags('유저 API')
@ApiSecurity('cookieAuth', ['jwt'])
export class UserController {
  constructor(private readonly  userService: UserService) { }

  // 회원가입
  @Post('register')
  @ApiOperation({ summary: '회원가입', description: '사용자 정보를 추가합니다.' })
  @ApiCreatedResponse({ description: '유저를 생성한다', type: RegisterDto })
  @ApiResponse({ status: 201, description: '회원가입에 성공하였습니다' })
  @HttpCode(201)
  async register(@Body() body: any) {
    const registerDto: RegisterDto = body
    return await this.userService.register(registerDto);
  }

    //로그인
    @Post('login')
    @ApiOperation({ summary: '로그인', description: '아이디와 비밀번호를 통해 로그인을 진행' })
    @ApiCreatedResponse({
      description: '로그인 정보',
      schema: {
        example: {
          "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impza2ltNDY5NUBnbWFpbC5jb20iLCJzdWIiOjcsImlhdCI6MTcxMjczNjQyMiwiZXhwIjoxNzEyNzM2NzIyfQ.0DtlYn-38fcLj8A95XItC11jgOaWbdM7L1GbX5EYVso",
          "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impza2ltNDY5NUBnbWFpbC5jb20iLCJzdWIiOjcsImlhdCI6MTcxMjczNjQyMiwiZXhwIjoxNzEzMzQxMjIyfQ.YiQd2CG_gd80AcDqAAzAnQweBXtbFGtC6ezifslKaIU"
        },
      },
    })
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const token = await this.userService.login(loginDto);
      res.cookie('Authorization', `Bearer ${token.access_token}`);
      return token;
    }
  

      // 프로필
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  @ApiOperation({ summary: '프로필', description: '회원정보를 확인' })
  @ApiCreatedResponse({
    description: '회원 정보',
    schema: {
      example: {
        "id": 7,
        "email": "jskim4695@gmail.com",
        "name": "김진성",
        "phone": "010-1234-1234",
        "is_admin": false,
        "created_at": "2024-04-08T17:41:21.343Z"
      },
    },
  })
  async getInfo(@UserInfo() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      is_admin: user.is_admin,
      created_at: user.created_at,
    }
  }

    // 정보수정
    @UseGuards(AuthGuard('jwt'))
    @Patch('modify')
    @ApiOperation({ summary: '회원정보 수정', description: '회원정보를 수정' })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          password: { type: 'string', description: '유저 닉네임' },
          phone: { type: 'string', description: '유저 전화번호' },
        },
      },
    })
    async update(
      @UserInfo() user: User,
      @Body() userUpdateDto: UserUpdateDto,
    ) {
      const updatedUser = await this.userService.update(
        user.id,
        userUpdateDto,
      );
      return updatedUser
    }

      // 회원탈퇴
  @UseGuards(AuthGuard('jwt'))
  @Delete('leave')
  @ApiOperation({ summary: '회원 탈퇴', description: '유저를 시스템에서 삭제합니다.' })
  @ApiResponse({ status: 204, description: '회원 탈퇴 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 401, description: '비밀번호가 올바르지 않음' })
  @HttpCode(204)
  async remove(@UserInfo() user: User, @Body() removeUserDto: RemoveUserDto) {
    await this.userService.remove(user.id, removeUserDto);
  }
}
