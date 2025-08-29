import { inject, Injectable } from '@angular/core';
import { 
  addDoc, 
  collection, 
  CollectionReference, 
  doc, 
  DocumentData, 
  DocumentReference, 
  Firestore, 
  getDocs, 
  orderBy, 
  query, 
  Timestamp, 
  updateDoc, 
  where 
} from '@angular/fire/firestore';
import { ProductInterface } from '../interfaces/product';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private fire = inject(Firestore);
  private productsCollection: CollectionReference;
  private toast = inject(ToastService);

  constructor() {
    this.productsCollection = collection(this.fire, 'products');
  }

  // CREATE - Criar novo produto
  async create(product: Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<DocumentReference<DocumentData, DocumentData>> {
    const now = Timestamp.now();
    const productData = {
      ...product,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    
    return addDoc(this.productsCollection, productData);
  }

  // READ - Buscar todos os produtos (exceto deletados)
    async findAll(): Promise<ProductInterface[]> {
    try {
      const q = query(
        this.productsCollection,
        where('deletedAt', '==', null),
        orderBy('name', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const products: ProductInterface[] = [];
      
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        products.push({ 
          id: docSnapshot.id, 
          ...data 
        } as ProductInterface);
      });
      
      return products;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE - Atualizar produto
  async update(id: string, product: Partial<Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<void> {
    const docRef = doc(this.fire, 'products', id);
    const updateData = {
      ...product,
      updatedAt: Timestamp.now()
    };
    
    return updateDoc(docRef, updateData);
  }

  // DELETE - Soft delete (marca como deletado)
  async delete(id: string): Promise<void> {
    const docRef = doc(this.fire, 'products', id);
    return updateDoc(docRef, {
      deletedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
}