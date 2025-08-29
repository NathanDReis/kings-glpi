import { Component, Input } from '@angular/core';
import { BudgetInterface } from '../../../../interfaces/budget';

@Component({
  selector: 'template-pdf',
  imports: [],
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
}
