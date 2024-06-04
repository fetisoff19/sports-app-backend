import { IsUUID } from 'class-validator'

export class DefaultDto {
  @IsUUID()
  uuid: string
}
