import { IsNotEmpty, IsString, Length } from 'class-validator'
import { LoginDataDto } from './loginData.dto'

export class HfutPasswordDto extends LoginDataDto {
  @IsString()
  @Length(6, 30, {
    message: '信息门户密码长度只能为6-30位',
  })
  @IsNotEmpty({
    message: '信息门户密码不能为空',
  })
    hfutPassword: string
}
