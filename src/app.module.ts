import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { CommonModule } from './common/common.module';
import databaseConfig from './config/database.config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: any) => config.internalConfig.database,
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
