import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationDto } from '../../../common/dto/pagination.schema'
import { TreeholeConst } from '../../../shared/constant/treehole'
import { IsValidHoleIdDto, IsValidId } from './utils'
import { IsTreeholeMode } from './mode.dto'

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
