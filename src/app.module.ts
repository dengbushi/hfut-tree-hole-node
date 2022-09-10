import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CommonModule } from './common/common.module'
import { TreeholeModule } from './modules/treehole/treehole.module'
import { DaoModule } from './dao/dao.module'
import { RoleModule } from './modules/role/role.module'
import { CaslModule } from './modules/casl/casl.module'
import { FileModule } from './modules/file/file.module'
import { ReportModule } from './modules/report/report.module'
import { MessageWallModule } from './modules/message-wall/message-wall.module'
import databaseConfig from './config/database.config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService): MongooseModuleFactoryOptions => ({
        uri: config.get('DATABASE_URL'),
        enableUtf8Validation: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
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
    CaslModule,
    FileModule,
    ReportModule,
    MessageWallModule,
  ],
  controllers: [],
})
export class AppModule {}
