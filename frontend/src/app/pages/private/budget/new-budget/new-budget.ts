import { ChangeDetectorRef, Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';

import { BudgetInterface, BudgetProductInterface } from '../../../../interfaces/budget';
import { ProductService } from '../../../../services/product';
import { LoadingService } from '../../../../services/loading';
import { ProductInterface } from '../../../../interfaces/product';
import { ToastService } from '../../../../services/toast';
import { CurrencyPipe, registerLocaleData } from '@angular/common';
import { Column } from '../../../../interfaces/table';
import { BudgetService } from '../../../../services/budget';

import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

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
    CurrencyPipe,
    TableModule,
    InputMaskModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './new-budget.html',
  styleUrl: './new-budget.css'
})
export class NewBudgetComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private loading = inject(LoadingService);
  private toast = inject(ToastService);
  private budgetService = inject(BudgetService);
  
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
  productsSelectCache: ProductInterface[] = [];
  loadingProducts: boolean = false;

  cols: Column[] = [
    { field: 'name', header: 'Nome' },
    { field: 'quantity', header: 'Quantidade' },
    { field: 'price', header: 'Preço' },
    { field: 'total', header: 'Total' },
  ];

  product: BudgetProductInterface = {
    name: '',
    quantity: 0,
    price: 0,
    total: 0
  };

  ngOnInit(): void {
    this.loadProducts();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadBudget(id);
  }

  async loadBudget(id: string): Promise<void> {
    try {
      this.loading.run();

      const budget = await this.budgetService.findById(id);
      if (!budget) throw new Error('Orçamento não encontrado');

      budget.products = budget.products.map((p, index) => {
        this.removeProductSelect(p);
        return { id: index + 1, ...p };
      });

      this.budget = budget;
      this.calculatePriceBudget();
      this.cd.markForCheck();
      this.product = {
        name: '',
        quantity: 0,
        price: 0,
        total: 0
      };
    } catch (error) {
      this.toast.show('Não foi possível carregar o orçamento', 'error', 5000);
      this.hidePage();
      return;
    } finally {
      this.loading.stop();
    }
  }

  async loadProducts(): Promise<void> {
    try {
      this.loadingProducts = true;
      const data = await this.productService.findAll();
      this.productsSelectCache = data.map(p => {
        p.name = `${p.name} ${p.model ?? ''} ${p.brand ?? ''}`;
        return p;
      });
      this.productsSelect = [...this.productsSelectCache];
      
      this.cd.markForCheck();
    } catch (error) {
      this.toast.show('Não foi possível buscar produtos', 'error', 5000);
    } finally {
      this.loadingProducts = false;
    }
  }

  idProductCounter: number = 1;
  addProduct(): void {
    if (this.formInvalidProduct()) return;

    this.product.id = this.idProductCounter++;

    this.budget.products = [...this.budget.products, { ...this.product }];
    this.removeProductSelect(this.product);
    this.calculatePriceBudget();
    this.cd.markForCheck();
    this.product = {
      name: '',
      quantity: 0,
      price: 0,
      total: 0
    };
  }

  editProduct(product: BudgetProductInterface): void {
    this.product = { ...product };
    this.deleteProduct(product);
  }

  deleteProduct(product: BudgetProductInterface): void {
    this.budget.products = this.budget.products.filter(p => p.id !== product.id);
    this.addProductSelect(product);
    this.calculatePriceBudget();
  }

  addProductSelect(product: BudgetProductInterface): void {
    this.productsSelect = [...this.productsSelect, this.productsSelectCache.find(p => p.name === product.name)!];
    this.productsSelect.sort((a, b) => a.name.localeCompare(b.name));
  }

  removeProductSelect(product: BudgetProductInterface): void {
    this.productsSelect = this.productsSelectCache.filter(p => p.name !== product.name);
    this.productsSelect.sort((a, b) => a.name.localeCompare(b.name));
  }

  calculateTotal(): void {
    this.product.total = (this.product.quantity ?? 0) * (this.product.price ?? 0);
  }

  calculatePriceBudget(): void {
    let total = this.budget.workforce ?? 0;
    this.budget.products.forEach(p => {
      total += p.total;
    });
    this.budget.price = total;
  }

  formInvalid(): boolean {
    return (
      !this.budget.name.trim() ||
      !this.budget.status.trim() ||
      !this.budget.client.name.trim() ||
      !this.budget.client.email.trim() ||
      !this.budget.client.phone.trim() ||
      (
        !this.budget.client.cnpj?.trim() &&
        !this.budget.client.cpf?.trim()
      ) ||
      !this.budget.products.length
    )
  }

  formInvalidCPFCNPJ(): boolean {
    return (
      !this.budget.client.cnpj?.trim() &&
      !this.budget.client.cpf?.trim()
    );
  }

  formInvalidProduct(): boolean {
    return (
      !this.product.name.trim() ||
      !(this.product.quantity > 0) ||
      !(this.product.price > 0)
    );
  }

  hidePage(): void {
    this.router.navigate(['/orcamento']);
  }

  async saveBudget(): Promise<void> {
    if (this.formInvalid()) return;

    this.budget.products = this.budget.products.map(p => {
      delete p.id;
      return p;
    });

    try {
      if (this.formInvalid()) return 

      this.loading.run();

      const {id, ...data} = this.budget; 
      
      if (this.budget?.id) {
        await this.budgetService.update(this.budget.id, data);
        this.toast.show('Orçamento atualizado', 'success');
      } else {
        await this.budgetService.create(data);
        this.toast.show('Orçamento criado', 'success');
      }

      this.hidePage();
    } catch (error) {
      this.toast.show(`Não foi possível ${this.budget?.id ? 'atualizar' : 'criar'} orçamento`, 'error', 5000);
    } finally { 
      this.loading.stop();
    }
  }
}
