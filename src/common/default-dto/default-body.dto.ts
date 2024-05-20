import { IsInt, IsPositive } from 'class-validator';

export class DefaultBodyDto {
  @IsInt()
  @IsPositive()
  id: number;
}
