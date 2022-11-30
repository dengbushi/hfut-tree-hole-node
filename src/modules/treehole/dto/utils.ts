import {
  IsNumber,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Cache } from 'cache-manager'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'
import { cacheKey } from '@/shared/constant/cacheKeys'
import { createClassValidator } from '@/shared/utils/create'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateHoleId implements ValidatorConstraintInterface {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {
  }

  async validate(id: unknown, args: ValidationArguments) {
    const isHoleExist = await this.holesModel.findOne({ id, delete: false })

    await this.cacheManager.set(cacheKey.Hole, isHoleExist)

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
