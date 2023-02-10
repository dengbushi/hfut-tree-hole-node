import { Module } from '@nestjs/common'
import { NotifyController } from './notify.controller'
import { NotifyService } from './notify.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Users, UsersSchema } from '@/schema/user/user.schema'
import { Notify, NotifySchema } from '@/schema/notify/notify.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Notify.name, schema: NotifySchema },
    ]),
  ],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {}
