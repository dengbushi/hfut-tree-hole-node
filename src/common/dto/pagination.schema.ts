import { IsNotEmpty, IsNumber } from 'class-validator'

export class PaginationDto {
  @IsNotEmpty()
  @IsNumber()
    page: number

  @IsNotEmpty()
  @IsNumber()
    limit: number
}
