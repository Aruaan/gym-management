import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'

dotenv.config()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['src/database/entities/*{.ts,.js}'],
      synchronize: false,
      migrations: [`${__dirname}/../../src/migrations/*{.ts,.js}`],
      migrationsTableName: 'migrations',
    }),
  ],
})
export class DatabaseModule {}
