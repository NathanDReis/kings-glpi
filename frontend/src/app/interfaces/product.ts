export interface ProductInterface {
    id?: string
    name?: string
    quantity?: number
    unitValue?: number
    totalValue?: number
    manpower?: number
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date | null
}