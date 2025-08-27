import { inject, Injectable } from '@angular/core';
import { addDoc, collection, CollectionReference, doc, Firestore, getDocs, query, Timestamp, updateDoc, where } from '@angular/fire/firestore';
import { ProductInterface } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private fire = inject(Firestore);
  private productsCollection: CollectionReference;

  constructor() {
    this.productsCollection = collection(this.fire, 'products');
  }

  // CREATE - Criar novo produto
  async create(product: Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const productData = {
        ...product,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
      };
      
      const docRef = await addDoc(this.productsCollection, productData);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // READ - Buscar todos os produtos (exceto deletados)
    async findAll(): Promise<ProductInterface[]> {
    try {
      const q = query(
        this.productsCollection,
        where('deletedAt', '==', null)
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

      console.log('Produtos buscados:', products);
      
      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  // UPDATE - Atualizar produto
  async update(id: string, product: Partial<Omit<ProductInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<void> {
    try {
      const docRef = doc(this.fire, 'products', id);
      const updateData = {
        ...product,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // DELETE - Soft delete (marca como deletado)
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.fire, 'products', id);
      await updateDoc(docRef, {
        deletedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
}