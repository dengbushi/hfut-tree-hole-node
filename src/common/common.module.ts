import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from '../modules/auth/auth.module'
import { JwtAuthGuard } from '../modules/auth/guard/jwt.guard'
import { RolesGuard } from '../modules/role/guard/role.guard'
import { Users, UsersSchema } from '../schema/user/user.schema'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      limit: 2,
      ttl: 1,
    }),
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
    ]),
  ],
  providers: [
    // 全局Auth守卫
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class CommonModule {}
