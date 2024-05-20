import { CustomError } from '@custom-error'
import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  private readonly type: string[]
  private readonly maxSizeInMb: number
  constructor(type?: string[], maxSizeInMb?: number) {
    this.type = type
    this.maxSizeInMb = maxSizeInMb
  }

  transform(file: Express.Multer.File) {
    if (file) {
      const { originalname, size } = file
      const type = originalname.split('.').at(-1)
      const fileSize = Number((size / (1024 * 1024)).toFixed(2))

      if (!this.type.includes(type.toLowerCase())) {
        throw new CustomError(
          422,
          `A file ${originalname} not supported. The type file must be ${this.type.join(', ')}`,
        )
      }
      if (fileSize > this.maxSizeInMb) {
        throw new CustomError(
          422,
          `A file ${originalname} has size ${fileSize}mb. The max size supported file: ${this.maxSizeInMb}mb`,
        )
      }
      return file
    }
    throw new CustomError(400, `File not found`)
  }
}
