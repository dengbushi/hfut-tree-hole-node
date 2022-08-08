import {
  IsNotEmpty,
  IsString,
  ValidationArguments,
  ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator,
} from 'class-validator'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { TreeholeMode } from '../../../schema/treehole/treeholeMode.schema'
import { TreeholeDaoService } from '../../../dao/treehole/treehole-dao.service'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsModeExist implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(TreeholeMode.name)
    private readonly treeholeModeModel: Model<TreeholeMode>,
  ) {
  }

  async validate(mode: any, args: ValidationArguments) {
    const res = (await this.treeholeModeModel.findOne()).modes

    return !!res.map(item => item.value).includes(mode)
  }
}

export function IsTreeholeMode(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsModeExist,
    })
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateId implements ValidatorConstraintInterface {
  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  async validate(id: string, args: ValidationArguments) {
    const isValid = mongoose.isObjectIdOrHexString(id)

    if (!isValid) {
      throw new BadRequestException('树洞id格式错误')
    }

    const isHoleExist = await this.treeholeDaoService.findById(id)
    if (!isHoleExist) {
      throw new NotFoundException('没有找到这个树洞哦~')
    }

    return true
  }
}

export function IsValidId(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateId,
    })
  }
}

export class IsValidIdDto {
  @ApiProperty({ type: Number, description: '树洞id' })
  @IsNotEmpty()
  @IsString()
  @IsValidId()
    id: string
}
