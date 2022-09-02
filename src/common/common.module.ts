import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { AuthModule } from '../modules/auth/auth.module'
import { JwtAuthGuard } from '../modules/auth/guard/jwt.guard'
import { RolesGuard } from '../modules/role/guard/role.guard'
import { Users, UsersSchema } from '../schema/user/user.schema'
import { TreeholeDaoService } from '../dao/treehole/treehole-dao.service'
import { Holes, HolesSchema } from '../schema/treehole/holes.schema'
import { FileService } from '../modules/file/file.service'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      limit: 10,
      ttl: 1,
    }),
    ConfigModule,
    AuthModule,
    RedisModule.forRoot({
      config: {
        port: 6379,
      },
    }, true),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  providers: [
    // 全局Auth守卫
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    TreeholeDaoService,
    FileService,
  ],
})
export class CommonModule {}
