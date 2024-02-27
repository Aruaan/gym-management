import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'samojako',
      database: 'gym_db',
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
    })
  ]
})
export class DatabaseModule {}
