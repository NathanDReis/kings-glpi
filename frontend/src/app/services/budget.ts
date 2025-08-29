import { inject, Injectable } from '@angular/core';
import { 
  addDoc, 
  collection, 
  CollectionReference, 
  doc, 
  DocumentData, 
  documentId, 
  DocumentReference, 
  Firestore, 
  getDocs, 
  query, 
  Timestamp, 
  updateDoc, 
  where 
} from '@angular/fire/firestore';
import { BudgetInterface } from '../interfaces/budget';
import { ToastService } from './toast';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private fire = inject(Firestore);
  private budgetsCollection: CollectionReference;
  private toast = inject(ToastService);

  constructor() {
    this.budgetsCollection = collection(this.fire, 'budgets');
  }

  // CREATE - Criar novo orçamento
  async create(budget: Omit<BudgetInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<DocumentReference<DocumentData, DocumentData>> {
    const now = Timestamp.now();
    const budgetData = {
      ...budget,
      createdAt: now,
      updatedAt: now,
      deletedAt: null
    };
    return addDoc(this.budgetsCollection, budgetData);
  }

  // READ - Buscar todos os orçamentos (exceto deletados)
  async findAll(): Promise<BudgetInterface[]> {
    try {
      const q = query(
        this.budgetsCollection,
        where('deletedAt', '==', null)
      );
      const querySnapshot = await getDocs(q);
      const budgets: BudgetInterface[] = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        budgets.push({ 
          id: docSnapshot.id, 
          ...data 
        } as BudgetInterface);
      });
      return budgets;
    } catch (error) {
      throw error;
    }
  }

  // READ - Buscar orçamento por ID
  async findById(id: string): Promise<BudgetInterface | null> {
    try {    
      const q = query(
        this.budgetsCollection,
        where(documentId(), '==', id),
        where('deletedAt', '==', null)
      );  
      const docSnapshot = await getDocs(q);
      if (docSnapshot.empty) return null;

      console.log(docSnapshot.docs[0].data());

      const data = docSnapshot.docs[0].data();
      return { id: docSnapshot.docs[0].id, ...data } as BudgetInterface;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE - Atualizar orçamento
  async update(id: string, budget: Partial<Omit<BudgetInterface, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>): Promise<void> {
    const docRef = doc(this.fire, 'budgets', id);
    const updateData = {
      ...budget,
      updatedAt: Timestamp.now()
    };
    return updateDoc(docRef, updateData);
  }

  // DELETE - Soft delete (marca como deletado)
  async delete(id: string): Promise<void> {
    const docRef = doc(this.fire, 'budgets', id);
    return updateDoc(docRef, {
      deletedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
}
