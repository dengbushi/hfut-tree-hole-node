import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { BaseSchema } from '@/common/decorators/BaseSchema.decorator'
import { Holes } from '@/schema/treehole/holes.schema'

export type HolesCountDocument = HolesCount & Document

@BaseSchema()
export class HolesCount {
  @Prop({ type: Number, default: 0 })
  count: number

  @Prop({ type: [{ type: Object, ref: 'Holes' }], default: [] })
  removedList: Holes[]
}

export const HolesCountSchema = SchemaFactory.createForClass(HolesCount)
