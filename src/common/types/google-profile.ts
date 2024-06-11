export type GoogleProfile = {
  id: string
  email: string
  name: {
    givenName: string | null
    familyName: string | null
  },
  image: string
  photos: {value: string}[]
}
