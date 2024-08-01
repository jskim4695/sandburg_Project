import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AnnounceModule } from './announce/announce.module';
import { FreeModule } from './free/free.module';
import { ManageModule } from './manage/manage.module';

@Module({
  imports: [UsersModule, AnnounceModule, FreeModule, ManageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
