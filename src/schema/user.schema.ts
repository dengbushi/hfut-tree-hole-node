import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import Mongoose, { Document } from 'mongoose'

export type UsersDocument =Users & Document

export enum Roles {
  notch = 'notch',

  steve = 'steve',

  // 被关进小黑屋的角色
  banned = 'banned',
  muted = 'muted',
}

@Schema()
export class Users {
  @Prop({ type: Number, index: 1 })
    studentId: number

  @Prop({ type: String, index: 1 })
    username: string

  @Prop(String)
    password: string

  @Prop(String)
    avatar: string

  @Prop({ type: [{ type: Mongoose.SchemaTypes.Number }] })
    holeIds: number[]

  @Prop(String)
    role: Roles
}

export const UsersSchema = SchemaFactory.createForClass(Users)
