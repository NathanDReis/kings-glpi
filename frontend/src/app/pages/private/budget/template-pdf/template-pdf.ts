import { Component, Input } from '@angular/core';

import { TableModule } from 'primeng/table';

import { BudgetInterface } from '../../../../interfaces/budget';
import { Column } from '../../../../interfaces/table';

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

  cols: Column[] = [
    { field: 'name', header: 'Nome' },
    { field: 'quantity', header: 'Quantidade' },
    { field: 'price', header: 'Preço' },
    { field: 'total', header: 'Total' },
  ];

  get date(): string {
    const now = new Date();
    const format = (num: number) => num < 10 ? `0${num}` : num;
    return `${format(now.getDate())}/${format(now.getMonth() + 1)}/${format(now.getFullYear())}`;
  }
}
