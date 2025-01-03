import { DefaultDto } from 'src/common/dto'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class RenameDto extends DefaultDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @IsOptional()
  @IsString()
  note?: string
}
