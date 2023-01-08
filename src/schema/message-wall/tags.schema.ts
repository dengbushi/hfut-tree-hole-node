import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from '@/common/decorators/BaseSchema.decorator'

export type MessageWallTagsDocument = MessageWallTags & Document

export enum MessageWallTagsTypes {
  WISH = '许愿',
  NONE = '无题',
  EMO = 'EMO',
}

@BaseSchema()
export class MessageWallTags {
  @Prop({ type: [String] })
  tags: MessageWallTagsTypes[]
}

export const MessageWallTagsSchema =
  SchemaFactory.createForClass(MessageWallTags)
