import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { NumberLength } from '../../../common/decorators/NumberLength.decorator'

export class LoginDataDto {
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

  @ApiProperty({
    description: '树洞密码',
  })
  @IsString({
    message: '密码必须是字符串',
  })
  @Length(6, 20, {
    message: '密码只能为6-20位长度',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
    password: string
}
