import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { BudgetService } from '../../../services/budget';
import { ProductService } from '../../../services/product';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './panel.html',
  styles: ``
})
export class PanelComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private productService = inject(ProductService);

  totalBudgets = 0;
  totalProducts = 0;
  totalValue = 0;
  budgetsPending = 0;
  budgetsApproved = 0;
  budgetsRejected = 0;

  chartData: any;
  chartOptions: any;

  async ngOnInit() {
    await this.loadData();
    this.initChart();
  }

  async loadData() {
    const [budgets, products] = await Promise.all([
      this.budgetService.findAll(),
      this.productService.findAll()
    ]);

    this.totalBudgets = budgets.length;
    this.totalProducts = products.length;

    this.budgetsPending = budgets.filter(b => b.status === 'pending').length;
    this.budgetsApproved = budgets.filter(b => b.status === 'approved').length;
    this.budgetsRejected = budgets.filter(b => b.status === 'rejected').length;

    this.totalValue = budgets.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.chartData = {
      labels: ['Pendentes', 'Aprovados', 'Rejeitados'],
      datasets: [
        {
          data: [this.budgetsPending, this.budgetsApproved, this.budgetsRejected],
          backgroundColor: [
            documentStyle.getPropertyValue('--yellow-500') || '#eab308',
            documentStyle.getPropertyValue('--green-500') || '#22c55e',
            documentStyle.getPropertyValue('--red-500') || '#ef4444'
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--yellow-400') || '#facc15',
            documentStyle.getPropertyValue('--green-400') || '#4ade80',
            documentStyle.getPropertyValue('--red-400') || '#f87171'
          ]
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}
