import { Timestamp } from "@angular/fire/firestore"

export interface SoftBaseInterface {
  id?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt?: Timestamp | null
}