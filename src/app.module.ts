import { Module } from '@nestjs/common'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

const typeOrmModuleConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'hfut-tree-hole',
  autoLoadEntities: true,
  synchronize: true,
}

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModuleConfig), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
