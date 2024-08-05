import { Module } from '@nestjs/common';
import { AnnounceController } from './announce.controller';
import { AnnounceService } from './announce.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announce } from './entities/announce.entity';
import { User } from 'src/user/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Announce, User]),
    UtilsModule,
  ],
  controllers: [AnnounceController],
  providers: [AnnounceService],
  exports: [AnnounceService],
})
export class AnnounceModule {}
