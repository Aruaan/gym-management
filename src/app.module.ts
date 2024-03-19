import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { MembersModule } from './database/members/members.module'

@Module({
  imports: [DatabaseModule, MembersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
