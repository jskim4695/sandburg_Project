import { Module } from '@nestjs/common';
import { ManageController } from './manage.controller';
import { ManageService } from './manage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manage } from './entities/manage.entity';
import { User } from 'src/user/entities/user.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manage, User]),
    UtilsModule,
  ],
  controllers: [ManageController],
  providers: [ManageService],
  exports: [ManageService],
})
export class ManageModule {}
