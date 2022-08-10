import { IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { StudentIdDataDto } from './studentId.dto'

export class LoginDataDto extends StudentIdDataDto {
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
