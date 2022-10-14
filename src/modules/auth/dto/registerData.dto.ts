import { IsNotEmpty, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { HfutPasswordDto } from './hfutPassword.dto'

export class RegisterDataDto extends HfutPasswordDto {
  @ApiProperty({
    description: '树洞用户名',
  })
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @Length(1, 10, {
    message: '用户名长度不能超过10个字符',
  })
    username: string
}
