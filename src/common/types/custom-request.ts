import { UserModel } from '@/db/model'

export interface CustomRequest extends Request {
  user: UserModel
}
