import { SoftBaseInterface } from "./softdelete"

export interface BudgetInterface extends SoftBaseInterface {
  name: string
  description?: string 
  status: 'pending' | 'approved' | 'rejected'
  workforce?: number
  price: number
  responsible: string
  client: BudgetClientInterface
  products: BudgetProductInterface[]
}

export interface BudgetClientInterface {
  name: string
  email: string
  phone: string
  cnpj: string
}

export interface BudgetProductInterface {
  name: string
  quantity: number
  price: number
  total: number
}