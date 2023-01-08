import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import Mongoose, { Document } from 'mongoose'
import { Role } from '@/modules/role/role.enum'

export type UsersDocument = Users & Document

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

  @Prop({ type: [{ type: Object }] })
  loginInfo: { ip: string; date: Date; ua: string }

  @Prop({ type: [{ type: Object }] })
  roles: Role[]
}

export const UsersSchema = SchemaFactory.createForClass(Users)
