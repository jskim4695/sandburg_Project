import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveUserDto {
    @ApiProperty({
        example: '1234aaaa',
        description: '유저 비밀번호',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}