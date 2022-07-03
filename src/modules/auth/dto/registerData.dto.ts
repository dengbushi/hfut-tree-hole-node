import { IsNotEmpty, IsString, Length } from 'class-validator'
import { HfutPasswordDto } from './hfutPassword.dto'

export class RegisterDataDto extends HfutPasswordDto {
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(1, 20, {
    message: '用户名长度不能超过20个字符',
  })
    username: string

  @IsString()
  @Length(6, 30, {
    message: '信息门户密码长度只能为6-30位',
  })
  @IsNotEmpty({
    message: '信息门户密码不能为空',
  })
    hfutPassword: string
}
