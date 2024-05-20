import { IsUUID } from 'class-validator';

export class DefaultParamsDto {
  @IsUUID()
  uuid: string
}
