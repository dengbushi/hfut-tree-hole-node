import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from '../modules/auth/auth.module'
import { JwtAuthGuard } from '../modules/auth/guard/jwt.guard'

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [
    // 全局Auth守卫
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class CommonModule {}
