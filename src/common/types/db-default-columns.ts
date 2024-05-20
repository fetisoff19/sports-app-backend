type Nullable<T> = T | null
export interface DbDefaultColumns {
  id: number
  createdAt: Nullable<Date>
  updatedAt: Nullable<Date>
}
