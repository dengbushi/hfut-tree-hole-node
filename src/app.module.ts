import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CommonModule } from './common/common.module'
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
