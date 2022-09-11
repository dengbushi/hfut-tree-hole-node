import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { BaseSchema } from '../../common/decorators/BaseSchema.decorator'

export type HolesDocument = Holes & Document

@Schema()
export class Comment {
  @Prop(mongoose.Types.ObjectId)
    _id: mongoose.Types.ObjectId

  @Prop({ type: Number, index: 1 })
    userId: number

  @Prop(String)
    content: string

  @Prop(Date)
    createTime: Date

  constructor(attrs) {
    Object.assign(this, attrs)
  }
}

@BaseSchema()
export class Holes {
  @Prop({ type: Number, index: 1, required: true })
    id: number

  @Prop({ type: Number, index: 1, required: true })
    userId: number

  @Prop({ type: String, required: true })
    content: string

  @Prop({ type: Number, index: 1, default: 0 })
    stars: number

  @Prop({ type: [Number], default: [] })
    starUserIds: number[]

  @Prop({ type: [String] })
    imgs: string[]

  @Prop({ type: [{ type: Object, ref: () => Comment }] })
    comments: Comment[]

  constructor(props: { userId: number }) {
    Object.assign(this, props)
  }
}

export const HolesSchema = SchemaFactory.createForClass(Holes)
