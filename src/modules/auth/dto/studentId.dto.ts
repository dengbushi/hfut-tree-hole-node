import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber, ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { NumberLength } from '../../../common/decorators/NumberLength.decorator'
import { UserService } from '../../user/user.service'
import { createClassValidator } from '../../../shared/utils/create'

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidateStudentExistId implements ValidatorConstraintInterface {
  @Inject()
  private readonly userService: UserService

  async validate(id: number, args: ValidationArguments) {
    const user = await this.userService.findOne(id)

    if (!user) {
      throw new NotFoundException('用户不存在，可能是我手抖删掉了(bushi')
    }

    return true
  }
}

export const IsValidStudentId = createClassValidator(ValidateStudentExistId)

export class StudentIdDataDto {
  @ApiProperty({
    description: '学号',
  })
  @IsNumber({
    allowNaN: false,
  }, {
    message: '学号格式错误',
  })
  @NumberLength(10, 10, {
    message: '学号只能为10位长度',
  })
    studentId: number
}

export class StudentIdDataWithValidateExistDto {
  @ApiProperty({
    description: '学号',
  })
  @IsNumber({
    allowNaN: false,
  }, {
    message: '学号格式错误',
  })
  @NumberLength(10, 10, {
    message: '学号只能为10位长度',
  })
  @IsValidStudentId()
    studentId: number
}
