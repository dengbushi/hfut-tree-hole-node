import {
  ArrayMaxSize,
  ArrayMinSize,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsValidHoleIdDto } from './utils'
import { IsTreeholeMode } from './mode.dto'
import { PaginationDto } from '@/common/dto/pagination.schema'
import { TreeholeConst } from '@/shared/constant/treehole'
import { Validate } from '@/shared/utils/dto'

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

  @ApiProperty({ type: String, description: '选项' })
  @ArrayMaxSize(5, {
    message: '选项最多只能有5项',
  })
  @ArrayMinSize(2, {
    message: '至少要有2项选择',
  })
  @Validate<string[]>(
    (val) => {
      for (const item of val) {
        if (item.length > 20) {
          return false
        }
      }

      return true
    },
    {
      message: '每项选项最长只能为20字哦',
    },
  )
  @IsOptional()
    options?: string[]
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
  @IsMongoId()
    commentId: string
}
