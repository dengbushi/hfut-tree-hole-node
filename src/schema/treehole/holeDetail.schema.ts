import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type HoleDetailDocument = HoleDetail & Document

@Schema()
export class HoleDetail {
  @Prop(Number)
  count: number
}

export const HoleDetailSchema = SchemaFactory.createForClass(HoleDetail)
