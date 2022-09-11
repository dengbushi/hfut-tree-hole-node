import { Schema } from '@nestjs/mongoose'
import { SchemaOptions } from 'mongoose'

export const BaseSchema = (options: SchemaOptions = {}) => Schema({
  timestamps: {
    createdAt: 'createTime',
    updatedAt: 'updatedTime',
  },
  ...options,
})
