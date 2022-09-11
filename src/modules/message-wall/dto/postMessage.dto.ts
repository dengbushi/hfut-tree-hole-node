import { IsNumber, IsString, MaxLength, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MessageWallTags, MessageWallTagsDocument, MessageWallTagsTypes } from '../../../schema/message-wall/tags.schema'
import { createClassValidator } from '../../../shared/utils/create'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateMessageWallTag implements ValidatorConstraintInterface {
  @InjectModel(MessageWallTags.name)
  private readonly tagsModel: Model<MessageWallTagsDocument>

  async validate(tag: unknown) {
    const tagsQueryRes = await this.tagsModel.findOne()

    if (!tagsQueryRes.tags.includes(tag as MessageWallTagsTypes)) {
      throw new NotFoundException('无效的tag')
    }

    return true
  }
}

export const IsValidMessageWallTag = createClassValidator(ValidateMessageWallTag)

const maxLength = 500
export class PostMessageDto {
  @MaxLength(maxLength, {
    message: `最大字数不能超过${maxLength}字哦`,
  })
  @IsString()
    content: string

  @IsValidMessageWallTag()
  @IsString()
    tag: MessageWallTagsTypes

  @IsNumber()
    color: string
}
