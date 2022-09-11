import mongoose, { Model } from 'mongoose'
import {
  IsString,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface, registerDecorator,
} from 'class-validator'
import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cache } from 'cache-manager'
import { Holes, HolesDocument } from '../../../schema/treehole/holes.schema'
import { CommentDtoCacheKey } from '../../../shared/constant/cacheKeys'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateCommentId implements ValidatorConstraintInterface {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache

  async validate(id: string) {
    const commentId = new mongoose.Types.ObjectId(id)

    const isCommentExist = await this.holesModel.findOne({
      comments: {
        $elemMatch: { _id: commentId },
      },
    })

    if (!isCommentExist) {
      throw new NotFoundException('该评论不存在')
    }

    await this.cacheManager.set(CommentDtoCacheKey, isCommentExist)

    return true
  }
}

export function IsValidCommentId(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateCommentId,
    })
  }
}

export class IsValidCommentIdDto {
  @IsValidCommentId()
  @IsString()
    id: string
}