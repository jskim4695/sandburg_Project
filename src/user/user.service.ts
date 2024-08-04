import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserUpdateDto } from './dto/userUpdate.dto';
import { RemoveUserDto } from './dto/userLeave.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('이미 해당 이메일로 가입된 사용자가 있습니다.',);
    }

    const hashedPassword = await hash(registerDto.password, 10)

    await this.userRepository.save({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
      phone: registerDto.phone,
      is_admin: registerDto.is_admin
    });

    return { message: '회원가입이 완료되었습니다.' }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'], // 유저 엔터티에서 id, email, password 필드만 선택
      where: { email: loginDto.email }, // userRepository에서 제공된 이메일로 사용자 찾음
    });
    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    // 사용자가 일치하면 jwt 토큰 페이로드 구성
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '6h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async update(
    id: number,
    userUpdateDto: UserUpdateDto,
  ) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id })
      .getOne();

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const isMatch = await compare(userUpdateDto.present_pw, user.password);

    if (isMatch === true) {
      // 현재 비밀번호가 일치하는 경우
      if (userUpdateDto.password) {
        const hashedPassword = await hash(userUpdateDto.password, 10);
        user.password = hashedPassword;
      }
  
      if (userUpdateDto.phone) {
        user.phone = userUpdateDto.phone;
      }
  
      await this.userRepository.save({
        id: user.id,
        password: user.password, // 비밀번호가 변경된 경우에만 업데이트
        phone: user.phone // 전화번호가 변경된 경우에만 업데이트
      });
    } else {
      throw new NotFoundException('현재 비밀번호와 일치하지 않습니다.');
    }
  }

  async remove(userId: number, removeUserDto: RemoveUserDto) {
    const user = await this.userRepository
  .createQueryBuilder("user")
  .addSelect("user.password")
  .where("user.id = :id", { id: userId })
  .getOne();

    if (!user) {
        throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

const isMatch = await compare(removeUserDto.password, user.password);

      if (isMatch === true) {
        user.deleted_at = new Date(); // 현재 날짜로 설정
        await this.userRepository.save(user);
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findAllWithDeleted(): Promise<User[]> {
    return await this.userRepository.find({
        withDeleted: true,
    });
  }
}
