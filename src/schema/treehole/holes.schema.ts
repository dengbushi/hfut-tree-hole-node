import { Prop, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { BaseSchema } from '../../common/decorators/BaseSchema.decorator'

export type HolesDocument = Holes & Document

export class Comment {
  @Prop({ type: Number, index: 1 })
    userId: number

  @Prop({ type: String, index: 1 })
    content: string

  @Prop({ type: Array })
    reply: any[]

  @Prop({ type: Date, required: true })
    createTime: Date
}

@BaseSchema()
export class Holes {
  @Prop({ type: Number, index: 1, required: true })
    userId: number

  @Prop({ type: String, required: true })
    content: string

  @Prop({ type: Number, index: 1, default: 0 })
    stars: number

  @Prop({ type: [String] })
    imgs: string[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
    comments: Comment[]
}

export const HolesSchema = SchemaFactory.createForClass(Holes)
