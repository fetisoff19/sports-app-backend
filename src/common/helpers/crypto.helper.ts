import { CustomError } from '@custom-error'
import { HttpException, HttpStatus } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'

export class CryptoHelper {
  public static hashPassword(password: string, salt: string | number): string {
    return bcrypt.hashSync(password, salt)
  }

  public static compareHashedPasswords(
    decrypted: string,
    encrypted: string,
  ): boolean {
    return bcrypt.compareSync(decrypted, encrypted)
  }

  public static async hash256File({
    buffer,
    originalname,
  }: {
    buffer: ArrayBuffer
    originalname: string
  }): Promise<string> {
    try {
      const hashBuffer = await globalThis.crypto.subtle.digest(
        'SHA-256',
        buffer,
      )
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch (e) {
      throw new CustomError(400, `File ${originalname} not supported`)
    }
  }
}
