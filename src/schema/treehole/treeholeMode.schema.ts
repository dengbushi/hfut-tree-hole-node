import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type TreeholeModeDocument = TreeholeMode & Document

type TTreeholeMode = Record<'value' | 'cn', string>

export const treeholeModeDefaultData: TTreeholeMode[] = [
  {
    value: 'hot',
    cn: '热门',
  },
  {
    value: 'timeline',
    cn: '时间轴',
  },
  {
    value: 'timeline-reverse',
    cn: '时间轴倒叙',
  },
  {
    value: 'random',
    cn: '随机漫步',
  },
]

@Schema()
export class TreeholeMode {
  @Prop()
  modes: TTreeholeMode[]
}

export const TreeholeModeSchema = SchemaFactory.createForClass(TreeholeMode)
