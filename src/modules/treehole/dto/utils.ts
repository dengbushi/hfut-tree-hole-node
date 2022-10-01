import {
  IsNumber,
  ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator,
} from 'class-validator'
import { BadRequestException, CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { Cache } from 'cache-manager'
import { TreeholeDaoService } from '../../../dao/treehole/treehole-dao.service'
import { Holes, HolesDocument } from '../../../schema/treehole/holes.schema'
import { ValidateHoleCacheKey } from '../../../shared/constant/cacheKeys'
import { createClassValidator } from '../../../shared/utils/create'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateHoleId implements ValidatorConstraintInterface {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  @Inject(CACHE_MANAGER)
  private cacheManager: Cache

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {
  }

  async validate(id: unknown, args: ValidationArguments) {
    if (isNaN(id as number)) {
      throw new BadRequestException('id格式错误')
    }
    const isHoleExist = await this.holesModel.findOne({ id, delete: false })

    await this.cacheManager.set(ValidateHoleCacheKey, isHoleExist)

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
