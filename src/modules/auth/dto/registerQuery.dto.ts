import { IsNotEmpty, IsString, Length } from 'class-validator'
import { LoginQueryDto } from './loginQuery.dto'

export class RegisterQueryDto extends LoginQueryDto {
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(1, 10, {
    message: '用户名长度不能超过10个字符',
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
