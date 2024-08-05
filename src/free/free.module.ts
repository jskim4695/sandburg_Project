import { Module } from '@nestjs/common';
import { FreeController } from './free.controller';
import { FreeService } from './free.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Free } from './entities/free.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Free, User])
  ],
  controllers: [FreeController],
  providers: [FreeService],
  exports: [FreeService],
})
export class FreeModule {}
