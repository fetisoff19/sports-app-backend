import { PROVIDER_TYPE } from '@/common/types/user-types.enum'

export type UserFromSocialMedia = {
  provider: PROVIDER_TYPE;
  provider_id: string;
  email?: string;
  login: string;
  image: string;
};
