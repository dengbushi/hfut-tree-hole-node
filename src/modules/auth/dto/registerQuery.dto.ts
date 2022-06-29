import { IsNotEmpty, IsString, Length } from 'class-validator'
import { LoginQueryDto } from './loginQuery.dto'

export class RegisterQueryDto extends LoginQueryDto {
  @IsString()
  @IsNotEmpty({
    message: '信息门户密码不能为空',
  })
  @Length(6, 30, {
    message: '信息门户密码长度只能为6-30位',
  })
    hfutPassword: string
}
