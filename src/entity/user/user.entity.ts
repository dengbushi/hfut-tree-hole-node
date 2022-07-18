import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UsersDocument =Users & Document

@Schema()
export class Users {
  @Prop()
    studentId: number

  @Prop()
    username: string

  @Prop()
    password: string
}

export const UsersSchema = SchemaFactory.createForClass(Users)
