import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CommonModule } from './common/common.module'
import { TreeholeModule } from './modules/treehole/treehole.module'
import { DaoModule } from './dao/dao.module'
import { RoleModule } from './modules/role/role.module'
import databaseConfig from './config/database.config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    CommonModule,
    TreeholeModule,
    DaoModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
