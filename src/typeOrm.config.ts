import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

export default new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/database/entities/*{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
})
