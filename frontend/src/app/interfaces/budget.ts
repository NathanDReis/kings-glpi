import { SoftBaseInterface } from "./softdelete"

export interface BudgetInterface extends SoftBaseInterface {
  name: string
  description?: string 
  status: 'pending' | 'approved' | 'rejected'
  price: number
  responsible: string
  client: BudgetClientInterface
  products: BudgetProductInterface[]
  services: BudgetServiceInterface[]
  deliveryExpected?: Date | string
}

export interface BudgetClientInterface {
  name: string
  email: string
  phone: string
  cnpj?: string
  cpf?: string,

  cep?: string
  state?: string
  address?: string
  city?: string
}

export interface BudgetProductInterface {
  id?: number
  name: string
  quantity: number
  price: number
  total: number
}

export interface BudgetServiceInterface {
  id?: number
  name: string
  quantity: number
  price: number
  total: number
}