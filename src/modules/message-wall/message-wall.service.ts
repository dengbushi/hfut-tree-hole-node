import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { PostMessageDto } from './dto/postMessage.dto'
import { GetWallDto } from './dto/getWall.dto'
import { MessageWall, MessageWallDocument } from '@/schema/message-wall/message-wall.schema'
import { IUser } from '@/env'
import { createResponse } from '@/shared/utils/create'

@Injectable()
export class MessageWallService {
  @InjectModel(MessageWall.name)
  private readonly messageWallModel: Model<MessageWallDocument>

  async postMessage(dto: PostMessageDto, user: IUser) {
    await new this.messageWallModel({
      userId: user.studentId,
      ...dto,
    }).save()

    return createResponse('留言成功')
  }

  async getWall(query: GetWallDto) {
    return this.messageWallModel.find({})
  }
}
