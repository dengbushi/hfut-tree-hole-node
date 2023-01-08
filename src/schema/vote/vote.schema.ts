import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type VoteDocument = Vote & Document

@Schema()
export class Vote {}

export const VoteSchema = SchemaFactory.createForClass(Vote)
