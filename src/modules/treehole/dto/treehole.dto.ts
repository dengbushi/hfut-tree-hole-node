import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { TreeholeMode } from '../../../schema/treehole/treeholeMode.schema'
import { PaginationDto } from '../../../common/dto/pagination.schema'
import { TreeholeConst } from '../../../shared/constant/treehole'

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

function IsTreeholeMode(validationOptions?: ValidationOptions) {
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

export class TreeholeListDto extends PaginationDto {
  @ApiProperty({ type: String, description: '树洞mode' })
  @IsString()
  @IsNotEmpty()
  @IsTreeholeMode({
    message: 'mode不存在',
  })
    mode: string
}

export class TreeholeDetailDto {
  @ApiProperty({ type: Number, description: '树洞id' })
  @IsNotEmpty()
  @IsString()
    id: string
}

export class CreateHoleDto {
  @ApiProperty({ type: String, description: '正文' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TreeholeConst.maxContentLength, {
    message: `树洞正文字数不能超过${TreeholeConst.maxContentLength}`,
  })
    content: string

  @ApiProperty({ type: Array, description: '图片' })
  @IsArray()
  @ArrayMaxSize(3, { message: '最多只能上传3张照片' })
    imgs: string[]
}

export class CreateCommentDto {
  @ApiProperty({ type: String, description: '树洞id' })
  @IsString()
  @IsNotEmpty()
    id: string

  @ApiProperty({ type: String, description: '正文' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TreeholeConst.maxCommentLength, {
    message: `树洞正文字数不能超过${TreeholeConst.maxCommentLength}`,
  })
    content: string
}
