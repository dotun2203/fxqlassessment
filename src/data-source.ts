import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FxqlEntry } from './fxql/entities/fxql-entry.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [FxqlEntry],
  migrations: ['dist/migrations/*.ts'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: !isProduction,
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
  //   ssl:
  //     process.env.NODE_ENV === 'production'
  //       ? { rejectUnauthorized: false }
  //       : false,
});
