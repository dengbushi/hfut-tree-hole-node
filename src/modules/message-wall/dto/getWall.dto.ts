import { IsString } from 'class-validator'
import { MessageWallTagsTypes } from '../../../schema/message-wall/tags.schema'
import { IsValidMessageWallTag } from './postMessage.dto'

export class GetWallDto {
  @IsValidMessageWallTag()
  @IsString()
    tag: MessageWallTagsTypes
}
