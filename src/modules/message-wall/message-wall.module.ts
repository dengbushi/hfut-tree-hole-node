import { Module } from '@nestjs/common'
import { MessageWallService } from './message-wall.service'
import { MessageWallController } from './message-wall.controller'

@Module({
  providers: [MessageWallService],
  controllers: [MessageWallController],
})
export class MessageWallModule {}
