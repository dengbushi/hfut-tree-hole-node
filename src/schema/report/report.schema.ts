import { Prop, SchemaFactory } from '@nestjs/mongoose'
import Mongoose, { Document } from 'mongoose'
import { BaseSchema } from '../../common/decorators/BaseSchema.decorator'

export type ReportDocument = Report & Document

export enum ReportTypes {
  HOLE = 'HOLE',
  COMMENT = 'COMMENT',
}

class ReportItem {
  id: number
  msg: string
}

@BaseSchema()
export class Report {
  @Prop({ type: String, index: 1, enum: ReportTypes })
    type: ReportTypes

  @Prop({ type: Mongoose.Schema.Types.ObjectId, index: 0 })
    id: Mongoose.Schema.Types.ObjectId

  @Prop({ type: Number, default: 0 })
    times: number

  @Prop({ type: [{ type: Object, ref: 'ReportItem' }] })
    reportUsers: ReportItem[]
}

export const ReportSchema = SchemaFactory.createForClass(Report)
