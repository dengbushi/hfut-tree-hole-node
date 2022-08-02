import { IsNotEmpty, IsNumber } from 'class-validator'

export class PaginationDto {
  @IsNotEmpty()
  @IsNumber()
    skip: number

  @IsNotEmpty()
  @IsNumber()
    limit: number
}
