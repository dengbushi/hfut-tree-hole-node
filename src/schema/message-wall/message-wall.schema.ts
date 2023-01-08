import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Comment } from '../treehole/holes.schema'
import { MessageWallTagsTypes } from './tags.schema'
import { BaseSchema } from '@/common/decorators/BaseSchema.decorator'

export type MessageWallDocument = MessageWall & Document

@BaseSchema()
export class MessageWall {
  @Prop({ type: Number, index: 1 })
  userId: number

  @Prop({ type: String, index: 1, enum: MessageWallTagsTypes })
  tag: MessageWallTagsTypes

  @Prop(String)
  content: string

  @Prop({ type: Number, default: 0 })
  like: number

  @Prop({ type: [{ type: Object, ref: () => Comment }] })
  comments: Comment[]

  @Prop(Number)
  color: number
}

export const MessageWallSchema = SchemaFactory.createForClass(MessageWall)
