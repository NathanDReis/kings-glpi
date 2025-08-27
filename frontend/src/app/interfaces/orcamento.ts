import { SoftBaseInterface } from "./softdelete"

export interface OrcamentoInterface extends SoftBaseInterface {
  name: string
  description?: string 
  status: 'pending' | 'approved' | 'rejected'
  workforce?: number
  price: number
  responsible: string
  client: OrcamentoClientInterface
  products: OrcamentoProductInterface[]
}

export interface OrcamentoClientInterface {
  name: string
  email: string
  phone: string
  cnpj: string
}

export interface OrcamentoProductInterface {
  name: string
  quantity: number
  price: number
  total: number
}