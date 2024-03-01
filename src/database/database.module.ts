import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Member } from './entities/Member';
import { Exercise } from './entities/Exercise';
import { Equipment } from './entities/Equipment';
import { Workout } from './entities/Workout';
import { Measurement } from './entities/Measurement';
import { Meal } from './entities/Meal';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'samojako',
      database: 'test',
      entities: [Member, Exercise, Equipment, Workout, Measurement, Meal],
      synchronize: true,
      migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
      migrationsTableName: 'migrations',
    })
  ]
})
export class DatabaseModule {}
