import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateDto {
  @ApiProperty({
    description: '树洞用户名',
  })
  @IsString()
  @IsOptional()
  @Length(1, 20, {
    message: '用户名长度不能超过20个字符',
  })
    username?: string
}
