import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type HolesDocument = Holes & Document

export class Comment {
  @Prop({ type: Number, index: 1 })
    userId: number

  @Prop({ type: String, index: 1 })
    content: string

  @Prop(Date)
    create_date: Date
}

@Schema()
export class Holes {
  @Prop({ type: Number, index: 1 })
    userId: number

  @Prop({ type: String, index: 1 })
    title: string

  @Prop({ type: String })
    desc: string

  @Prop({ type: Date, index: 1 })
    create_date: Date

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
    comments: Comment[]
}

export const HolesSchema = SchemaFactory.createForClass(Holes)
