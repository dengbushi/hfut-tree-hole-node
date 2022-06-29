import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PWD,
  database: 'hfut-tree-hole',
  autoLoadEntities: true,
  synchronize: true,
}))
