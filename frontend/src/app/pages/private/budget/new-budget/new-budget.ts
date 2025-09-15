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
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';

import { BudgetClientInterface, BudgetInterface, BudgetProductInterface, BudgetServiceInterface } from '../../../../interfaces/budget';
import { ProductService } from '../../../../services/product';
import { LoadingService } from '../../../../services/loading';
import { ProductInterface } from '../../../../interfaces/product';
import { ToastService } from '../../../../services/toast';
import { Column } from '../../../../interfaces/table';
import { BudgetService } from '../../../../services/budget';

import { CurrencyPipe, registerLocaleData } from '@angular/common';
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
    DatePickerModule,
    AutoCompleteModule,
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
    price: 0,
    responsible: '',
    client: {
      name: '',
      email: '',
      phone: '',
    },
    products: [],
    services: [],
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

  service: BudgetServiceInterface = {
    name: '',
    quantity: 1,
    price: 0,
    total: 0
  };

  idProductCounter: number = 1;
  idServiceCounter: number = 1;

  ngOnInit(): void {
    this.loadProducts();
    this.loadAutoComplete();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loadBudget(id);
  }

  
  // Arrays para armazenar as sugestões dos autocompletes
  budgetsNameAutoComplete: string[] = [];
  budgetsResponsibleAutoComplete: string[] = [];
  servicesAutoComplete: string[] = [];
  clientNameAutoComplete: string[] = [];
  clientEmailAutoComplete: string[] = [];
  clientStateAutoComplete: string[] = [];
  clientAddressAutoComplete: string[] = [];
  clientCityAutoComplete: string[] = [];

  // Arrays com todos os dados carregados
  budgetsName: string[] = [];
  budgetsResponsible: string[] = [];
  services: string[] = [];
  clientName: string[] = [];
  clientEmail: string[] = [];
  clientState: string[] = [];
  clientAddress: string[] = [];
  clientCity: string[] = [];

  loadAutoComplete(): void {
    try {
      // Carregar dados dos orçamentos
      const budgets: { name: string, responsible: string }[] = JSON.parse(sessionStorage.getItem('budgets') ?? '[]');
      budgets.forEach((b) => {
        if (b.name) this.budgetsName.push(b.name);
        if (b.responsible) this.budgetsResponsible.push(b.responsible);
      });

      // Carregar dados dos serviços
      const services: string[] = JSON.parse(sessionStorage.getItem('services') ?? '[]');
      this.services = services.map((s) => s.toLowerCase());

      // Carregar dados dos clientes
      const clients: BudgetClientInterface[] = JSON.parse(sessionStorage.getItem('clients') ?? '[]');
      clients.forEach((c) => {
        if (c.name) this.clientName.push(c.name);
        if (c.email) this.clientEmail.push(c.email);
        if (c.state) this.clientState.push(c.state.toString());
        if (c.address) this.clientAddress.push(c.address.toString());
        if (c.city) this.clientCity.push(c.city.toString());
      });

      // Remover duplicatas dos arrays principais
      this.budgetsName = [...new Set(this.budgetsName)];
      this.budgetsResponsible = [...new Set(this.budgetsResponsible)];
      this.services = [...new Set(this.services)];
      this.clientName = [...new Set(this.clientName)];
      this.clientEmail = [...new Set(this.clientEmail)];
      this.clientState = [...new Set(this.clientState)];
      this.clientAddress = [...new Set(this.clientAddress)];
      this.clientCity = [...new Set(this.clientCity)];
    } catch (error) {
      console.error('Erro ao carregar dados do autocomplete:', error);
    }
  }

  // Métodos específicos para cada autocomplete
  searchBudgetNames(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.budgetsNameAutoComplete = [];
      return;
    }
    
    this.budgetsNameAutoComplete = this.budgetsName
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10); // Limitar a 10 resultados para melhor performance
  }

  searchBudgetResponsible(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.budgetsResponsibleAutoComplete = [];
      return;
    }
    
    this.budgetsResponsibleAutoComplete = this.budgetsResponsible
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
  }

  searchServices(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.servicesAutoComplete = [];
      return;
    }
    
    this.servicesAutoComplete = this.services
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
  }

  searchClientNames(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.clientNameAutoComplete = [];
      return;
    }
    
    this.clientNameAutoComplete = this.clientName
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
  }

  searchClientEmails(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.clientEmailAutoComplete = [];
      return;
    }
    
    this.clientEmailAutoComplete = this.clientEmail
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
  }

  searchClientStates(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.clientStateAutoComplete = [];
      return;
    }
    
    this.clientStateAutoComplete = this.clientState
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
  }

  searchClientAddresses(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.clientAddressAutoComplete = [];
      return;
    }
    
    this.clientAddressAutoComplete = this.clientAddress
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
  }

  searchClientCities(event: AutoCompleteCompleteEvent): void {
    const query = event.query.trim().toLowerCase();
    if (query.length === 0) {
      this.clientCityAutoComplete = [];
      return;
    }
    
    this.clientCityAutoComplete = this.clientCity
      .filter(item => item.toLowerCase().includes(query))
      .slice(0, 10);
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
      this.idProductCounter = budget.products.length + 1;

      if (budget.services) {
        budget.services = budget.services.map((s, index) => {
          this.removeProductSelect(s);
          return { id: index + 1, ...s };
        });

        this.idServiceCounter = budget.services.length + 1;
      }
      this.budget = {...this.budget, ...budget};
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

  addService(): void {
    if (this.formInvalidService()) return;

    this.service.id = this.idServiceCounter++;

    this.budget.services = [...this.budget.services, { ...this.service }];
    this.calculatePriceBudget();
    this.cd.markForCheck();
    this.service = {
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    };
  }

  editProduct(product: BudgetProductInterface): void {
    this.product = { ...product };
    this.deleteProduct(product);
  }

  editService(service: BudgetServiceInterface): void {
    this.service = { ...service };
    this.deleteService(service);
  }

  deleteProduct(product: BudgetProductInterface): void {
    this.budget.products = this.budget.products.filter(p => p.id !== product.id);
    this.addProductSelect(product);
    this.calculatePriceBudget();
  }

  deleteService(service: BudgetServiceInterface): void {
    this.budget.services = this.budget.services.filter(p => p.id !== service.id);
    this.calculatePriceBudget();
  }

  addProductSelect(product: BudgetProductInterface): void {
    this.productsSelect = [...this.productsSelect, this.productsSelectCache.find(p => p.name === product.name)!];
    this.productsSelect.sort((a, b) => a.name.localeCompare(b.name));
  }

  removeProductSelect(product: BudgetProductInterface): void {
    this.productsSelect = this.productsSelect.filter(p => p.name !== product.name);
    this.productsSelect.sort((a, b) => a.name.localeCompare(b.name));
  }

  calculateTotalProduct(): void {
    this.product.total = (this.product.quantity ?? 0) * (this.product.price ?? 0);
  }
  calculateTotalService(): void {
    this.service.total = (this.service.quantity ?? 0) * (this.service.price ?? 0);
  }

  calculatePriceBudget(): void {
    let total = 0;
    this.budget.products.forEach(p => {
      total += p.total;
    });
    if (this.budget.services) {
      this.budget.services.forEach(s => {
        total += s.total;
      });
    }
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

  formInvalidService(): boolean {
    return (
      !this.service.name.trim() ||
      !(this.service.quantity > 0) ||
      !(this.service.price > 0)
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

    if (this.budget.services) {
      this.budget.services = this.budget.services.map(s => {
        delete s.id;
        return s;
      });
    }

    try {
      if (this.formInvalid()) return 

      this.loading.run();

      if (this.budget.deliveryExpected) {
        const date = new Date(this.budget.deliveryExpected);
        const valueNum = (num: number) => {
          return num < 10 ? `0${num}` : `${num}`;
        };
        this.budget.deliveryExpected = `${valueNum(date.getDate())}/${valueNum(date.getMonth() + 1)}/${valueNum(date.getFullYear())}`;
        if (this.budget.deliveryExpected.includes('NaN')) {
          this.budget.deliveryExpected = '';
        }
      }

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

  async getAddressByCEP(): Promise<void> {
    if (!this.budget.client.cep || this.budget.client.cep.replace(/\D/g, '').length !== 8) return;

    try {
      this.loading.run();
      const cep = this.budget.client.cep.replace(/\D/g, '');
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        this.toast.show('CEP não encontrado', 'error', 5000);
        return;
      }

      this.budget.client.address = data.logradouro;
      this.budget.client.city = data.localidade;
      this.budget.client.state = data.uf;

      this.cd.markForCheck();
    } catch (error) {
      this.toast.show('Não foi possível buscar o endereço pelo CEP', 'error', 5000);
    } finally {
      this.loading.stop();
    }
  }
}
