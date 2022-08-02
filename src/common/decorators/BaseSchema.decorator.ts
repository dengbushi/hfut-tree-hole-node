import { Schema } from '@nestjs/mongoose'

export const BaseSchema = () => Schema({
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updatedTime',
  },
})
