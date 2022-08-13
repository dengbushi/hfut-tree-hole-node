import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationDto } from '../../../common/dto/pagination.schema'
import { TreeholeConst } from '../../../shared/constant/treehole'
import { IsTreeholeMode, IsValidHoleIdDto, IsValidId } from './utils'

export class TreeholeListDto extends PaginationDto {
  @ApiProperty({ type: String, description: '树洞mode' })
  @IsString()
  @IsNotEmpty()
  @IsTreeholeMode({
    message: 'mode不存在',
  })
    mode: string
}

export class TreeholeDetailDto extends IsValidHoleIdDto {}

export class CreateHoleDto {
  @ApiProperty({ type: String, description: '正文' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TreeholeConst.maxContentLength, {
    message: `树洞正文字数不能超过${TreeholeConst.maxContentLength}`,
  })
    content: string

  @ApiProperty({ type: Array, description: '图片' })
  @IsArray()
  @ArrayMaxSize(3, { message: '最多只能上传3张照片' })
    imgs: string[]
}

export class CreateCommentDto extends IsValidHoleIdDto {
  @ApiProperty({ type: String, description: '正文' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(TreeholeConst.maxCommentLength, {
    message: `树洞正文字数不能超过${TreeholeConst.maxCommentLength}`,
  })
    content: string
}

export class StarHoleDto extends IsValidHoleIdDto {}

export class RemoveHoleCommentDto extends IsValidHoleIdDto {
  @ApiProperty({ type: String, description: '留言id' })
  @IsString()
  @IsNotEmpty()
  @IsValidId()
    commentId: string
}
