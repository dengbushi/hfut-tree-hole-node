import { BaseSchema } from '@/common/decorators/BaseSchema.decorator'
import { Prop, SchemaFactory } from '@nestjs/mongoose'

export type NotifyDocument = Notify & Document

@BaseSchema()
export class Notify {
  @Prop(Number)
  userId: number

  @Prop(String)
  content: string

  @Prop(Boolean)
  isRead: boolean
}

export const NotifySchema = SchemaFactory.createForClass(Notify)
