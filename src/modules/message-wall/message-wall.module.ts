import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MessageWallController } from './message-wall.controller'
import { MessageWallService } from './message-wall.service'
import { MessageWallTagsService } from './tags.service'
import { ValidateMessageWallTag } from './dto/postMessage.dto'
import { MessageWall, MessageWallSchema } from '@/schema/message-wall/message-wall.schema'
import { MessageWallTags, MessageWallTagsSchema } from '@/schema/message-wall/tags.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageWallTags.name, schema: MessageWallTagsSchema },
      { name: MessageWall.name, schema: MessageWallSchema },
    ]),
  ],
  providers: [MessageWallService, MessageWallTagsService, ValidateMessageWallTag],
  controllers: [MessageWallController],
})
export class MessageWallModule {}
