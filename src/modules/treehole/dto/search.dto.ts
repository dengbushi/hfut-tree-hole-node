import { IsString } from 'class-validator'

export class HoleSearchDto {
  @IsString()
  keywords: string
}
