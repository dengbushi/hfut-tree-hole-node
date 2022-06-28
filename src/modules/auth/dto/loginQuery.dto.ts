import { IsNumber, IsString, Length } from 'class-validator'
import { NumberLength } from '../../../common/decorators/NumberLength.decorator'

export class LoginQueryDto {
  @IsNumber({}, {
    message: '学号格式错误',
  })
  @NumberLength(10, 10, {
    message: '学号只能为10位长度',
  })
    studentId: number

  @IsString({
    message: '密码必须是字符串',
  })
  @Length(6, 20, {
    message: '密码只能为6-20位长度',
  })
    password: string
}
