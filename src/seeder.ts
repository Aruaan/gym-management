import { createConnection } from 'typeorm'
import { DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import seedMeasurements from './database/seeds/measurement-create.seed'

dotenv.config()

const connectionOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/database/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
}

createConnection(connectionOptions)
  .then(async (connection) => {
    await seedMeasurements(connection)
    await connection.close()
    console.log('All seeders executed successfully')
  })
  .catch((error) => console.log('Error during seeding: ', error))
