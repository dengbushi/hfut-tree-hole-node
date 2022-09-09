import { IsString, MaxLength } from 'class-validator'
import { IsValidHoleIdDto, IsValidId } from '../../treehole/dto/utils'
import { IsValidCommentId } from '../../treehole/dto/comment.dto'

export class ReportCommentDto {
  @IsValidCommentId()
  @IsValidId()
    id: string

  @IsString()
  @MaxLength(200, {
    message: '最多只能填写200字哦',
  })
    msg: string
}

export class ReportHoleDto extends IsValidHoleIdDto {
  @IsString()
  @MaxLength(200, {
    message: '最多只能填写200字哦',
  })
    msg: string
}
