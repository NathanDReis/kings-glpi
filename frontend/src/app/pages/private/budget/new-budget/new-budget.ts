import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

import { BudgetInterface } from '../../../../interfaces/budget';
import { ProductService } from '../../../../services/product';
import { LoadingService } from '../../../../services/loading';
import { ProductInterface } from '../../../../interfaces/product';
import { ToastService } from '../../../../services/toast';

@Component({
  selector: 'app-new-budget',
  imports: [
    CardModule,
    ButtonModule,
    FormsModule,
    TextareaModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './new-budget.html',
  styleUrl: './new-budget.css'
})
export class NewBudgetComponent implements OnInit {
  private route = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);
  
  budget: BudgetInterface = {
    name: '',
    description: '' ,
    status: 'pending',
    workforce: 0,
    price: 0,
    responsible: '',
    client: {
      name: '',
      email: '',
      phone: '',
      cnpj: ''
    },
    products: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  statusSelect: { label: string; value: 'pending' | 'approved' | 'rejected' }[] = [
    { label: 'Pendente', value: 'pending' },
    { label: 'Aprovado', value: 'approved' },
    { label: 'Rejeitado', value: 'rejected' },
  ]

  productsSelect: ProductInterface[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    try {
      this.loading.run();
      const data = await this.productService.findAll();
      this.productsSelect = data;
      
      this.cd.markForCheck();
    } catch (error) {
      this.toast.show('Não foi possível buscar produtos', 'error', 5000);
    } finally {
      this.loading.stop();
    }
  }

  formInvalid(): boolean {
    return (
      !this.budget.name.trim() ||
      !this.budget.responsible.trim() ||
      !this.budget.status.trim() ||
      !this.budget.client.name.trim() ||
      !this.budget.client.email.trim() ||
      !this.budget.client.phone.trim() ||
      !this.budget.client.cnpj.trim() ||
      !this.budget.products.length
    )
  }

  hidePage(): void {
    this.route.navigate(['orcamento']);
  }

  saveBudget(): void {
    if (this.formInvalid()) return;
    console.log(this.budget);
  }
}
