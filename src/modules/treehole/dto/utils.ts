import {
  IsNumber, ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Cache } from 'cache-manager'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { createClassValidator } from '@/shared/utils/create'
import { InjectMemoryCache } from '@/common/decorators/utils'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateHoleId implements ValidatorConstraintInterface {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @InjectMemoryCache
  private readonly cacheManager: Cache

  async validate(id: unknown, args: ValidationArguments) {
    const isHoleExist = await this.holesModel.findOne({ id })

    if (!isHoleExist) {
      throw new NotFoundException('没有找到这个树洞哦~')
    }

    return true
  }
}

export const IsValidHoleId = createClassValidator(ValidateHoleId)

export class IsValidHoleIdDto {
  @ApiProperty({ type: Number, description: '树洞id' })
  @IsValidHoleId()
  @IsNumber({ allowNaN: false, allowInfinity: false })
    id: number
}
