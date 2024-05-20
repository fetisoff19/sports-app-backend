import { UserModel } from '@db/model'

export interface CustomRequest extends Request {
  user: UserModel
  headers: Headers & {
    'x-access-token': string
    'x-refresh-token': string
  }
}
