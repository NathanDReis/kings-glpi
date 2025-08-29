import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    inject,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { StepperModule } from 'primeng/stepper';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputNumber } from 'primeng/inputnumber';

import { BudgetInterface } from '../../../interfaces/budget';
import { BudgetService } from '../../../services/budget';
import { ToastService } from '../../../services/toast';
import { LoadingService } from '../../../services/loading';
import { Router } from '@angular/router';
import { Timestamp } from '@angular/fire/firestore';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
  selector: 'app-budget',
  imports: [
    TableModule,
    ToolbarModule,
    ConfirmDialog,
    InputTextModule,
    TextareaModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    StepperModule,
    IconField,
    InputIcon,
  ],
  providers: [ConfirmationService],
  templateUrl: './budget.html',
  styleUrl: './budget.css'
})
export class BudgetComponent implements OnInit {
    budgets: BudgetInterface[] = [];
    selectedBudgets!: BudgetInterface[] | null;
    @ViewChild('dt') dt!: Table;

    cols: Column[] = [
        { field: 'name', header: 'Nome' },
        { field: 'status', header: 'Status' },
        { field: 'price', header: 'Preço' },
        { field: 'responsible', header: 'Responsável' },
    ];

    statusMap: { [key: string]: string } = {
        pending: 'Pendente',
        approved: 'Aprovado',
        rejected: 'Rejeitado'
    };

    private router = inject(Router);
    private budgetService = inject(BudgetService);
    private confirmationService = inject(ConfirmationService);
    private toast = inject(ToastService);
    private loading = inject(LoadingService);
    private cd = inject(ChangeDetectorRef);

    ngOnInit() {
        this.loadData();
    }

    async loadData(): Promise<void> {
        try {
            this.loading.run();
            this.budgets = await this.budgetService.findAll();
            this.cd.markForCheck();
        } catch (error) {
            this.toast.show('Não foi possível buscar orçamentos', 'error', 5000);
        } finally {
            this.loading.stop();
        }
    }

    deleteSelectedBudgets() {
        this.confirmationService.confirm({
            message: 'Deseja deletar todos os orçamentos selecionados?',
            header: 'Confirme',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Não',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Sim'
            },
            accept: async () => {
                try {
                    this.loading.run();
                    const promiseDelete = this.selectedBudgets?.map(async (budget) => this.budgetService.delete(budget.id!));
                    const results = await Promise.allSettled(promiseDelete || []);

                    const failedDeletions = results.filter(result => result.status === 'rejected');

                    if (failedDeletions.length > 0) {
                        this.toast.show(`${failedDeletions.length} orçamento(s) não puderam ser deletados`, 'error', 5000);
                    }

                    this.loadData();
                } catch (error) {
                    this.toast.show('Não foi possível deletar os orçamentos', 'error', 5000);
                } finally {
                    this.loading.stop();
                }
            }
        });
    }

    deleteBudget(budget: BudgetInterface): void {
        this.confirmationService.confirm({
            message: 'Você deseja deletar ' + budget.name + '?',
            header: 'Confirme',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Não',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Sim'
            },
            accept: async () => {
                try {
                    this.loading.run();
                    await this.budgetService.delete(budget.id!);
                    this.loadData();
                    this.toast.show('Orçamento excluído', 'success');
                } catch (error) {
                    this.toast.show('Não foi possível deletar orçamento', 'error', 5000);
                } finally {
                    this.loading.stop();
                }
            }
        });
    }

    openNew() {
        this.router.navigate(['/orcamento-criar']);
    }

    editBudget(budget: BudgetInterface) {
        this.router.navigate([`/orcamento-editar/${budget.id!}`]);
    }
}
