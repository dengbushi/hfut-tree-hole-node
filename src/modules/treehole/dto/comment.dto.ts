import mongoose, { Model } from 'mongoose'
import {
  IsString,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { createClassValidator } from '@/shared/utils/create'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateCommentId implements ValidatorConstraintInterface {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

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

    return true
  }
}

export const IsValidCommentId = createClassValidator(ValidateCommentId)

export class IsValidCommentIdDto {
  @IsValidCommentId()
  @IsString()
  id: string
}
