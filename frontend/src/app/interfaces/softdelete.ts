import { Timestamp } from "@angular/fire/firestore"

export interface SoftBaseInterface {
  id?: string
  code?: number,
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt?: Timestamp | null
}