import { createConnection } from 'typeorm';
import seedMembers from './database/seeds/member-create.seed';
import { DataSourceOptions } from 'typeorm'; 

const connectionOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'samojako',
  database: 'test',
  entities: ['src/database/entities/*.ts'],
  migrations: ['migrations']
};

createConnection(connectionOptions)
    .then(async (connection) => {
        await seedMembers(connection);
        await connection.close();
        console.log('All seeders executed successfully');
    })
    .catch((error) => console.log('Error during seeding: ', error));
