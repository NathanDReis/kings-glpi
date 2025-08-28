import { SoftBaseInterface } from "./softdelete"

export interface ProductInterface extends SoftBaseInterface {
    name: string
    brand?: string
    model?: string
}