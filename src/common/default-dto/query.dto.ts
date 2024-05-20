import { IsNotEmpty, IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsNotEmpty()
  id: string;
}
