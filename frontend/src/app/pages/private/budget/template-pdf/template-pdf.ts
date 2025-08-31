import { Component, Input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { BudgetInterface } from '../../../../interfaces/budget';

import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

@Component({
  selector: 'template-pdf',
  imports: [TableModule, CurrencyPipe],
  templateUrl: './template-pdf.html',
  styleUrl: './template-pdf.css'
})
export class TemplatePdf {
  @Input() budget: BudgetInterface | null = null;

  get date(): string {
    const now = new Date();
    const format = (num: number) => num < 10 ? `0${num}` : num;
    return `${format(now.getDate())}/${format(now.getMonth() + 1)}/${format(now.getFullYear())}`;
  }

  get getProductsTotal(): number {
    return this.budget?.products.reduce((acc, product) => acc + product.total, 0) || 0;
  }

  get getServicesTotal(): number {
    return this.budget?.services.reduce((acc, service) => acc + service.total, 0) || 0;
  }
}
