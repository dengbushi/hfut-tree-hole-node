import { IsMongoId, IsString, MaxLength } from 'class-validator'
import { IsValidHoleIdDto } from '../../treehole/dto/utils'
import { IsValidCommentId } from '../../treehole/dto/comment.dto'

export class ReportCommentDto {
  @IsValidCommentId()
  @IsMongoId()
    id: string

  @MaxLength(200, {
    message: '最多只能填写200字哦',
  })
  @IsString()
    msg: string
}

export class ReportHoleDto extends IsValidHoleIdDto {
  @IsString()
  @MaxLength(200, {
    message: '最多只能填写200字哦',
  })
    msg: string
}
