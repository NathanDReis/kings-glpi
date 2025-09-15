import { CommonModule, registerLocaleData } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    LOCALE_ID,
    OnInit,
    ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
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
import { DialogModule } from 'primeng/dialog';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { BudgetClientInterface, BudgetInterface, BudgetTemplateInterface } from '../../../interfaces/budget';
import { BudgetService } from '../../../services/budget';
import { ToastService } from '../../../services/toast';
import { LoadingService } from '../../../services/loading';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

import localePt from '@angular/common/locales/pt';
import { TemplatePdf } from './template-pdf/template-pdf';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
registerLocaleData(localePt);

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
        DialogModule,
        TemplatePdf,
    ],
    providers: [
        ConfirmationService,
        { provide: LOCALE_ID, useValue: 'pt-BR' }
    ],
    templateUrl: './budget.html',
    styleUrl: './budget.css'
})
export class BudgetComponent implements OnInit {
    budgets: BudgetInterface[] = [];
    selectedBudgets!: BudgetInterface[] | null;
    @ViewChild('dt') dt!: Table;

    budgetSelected: BudgetTemplateInterface[] = [];

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

    visibleInfoClient: boolean = false;
    client: BudgetClientInterface = {
        name: '',
        email: '',
        phone: ''
    };

    @ViewChild('content', { static: false }) el!: ElementRef;

    private router = inject(Router);
    private budgetService = inject(BudgetService);
    private confirmationService = inject(ConfirmationService);
    private toast = inject(ToastService);
    private loading = inject(LoadingService);
    private cd = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.loadData();
    }

    async loadData(): Promise<void> {
        try {
            this.loading.run();
            this.budgets = await this.budgetService.findAll();
            this.formatAutoComplete();
            this.cd.markForCheck();
        } catch (error) {
            this.toast.show('Não foi possível buscar orçamentos', 'error', 5000);
        } finally {
            this.loading.stop();
        }
    }

    formatAutoComplete(): void {
        const clients: BudgetClientInterface[] = [];
        const budgets: { name: string, responsible: string }[] = [];
        const services: string[] = [];

        this.budgets.forEach((b) => {
            clients.push(b.client);
            budgets.push({
                name: b.name,
                responsible: b.responsible
            });
            b.services.forEach((s) => {
                services.push(s.name);
            });
        });

        sessionStorage.setItem('clients', JSON.stringify(clients));
        sessionStorage.setItem('budgets', JSON.stringify(budgets));
        sessionStorage.setItem('services', JSON.stringify(services));
    }

    deleteSelectedBudgets(): void {
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

    openNew(): void {
        this.router.navigate(['/orcamento-criar']);
    }

    editBudget(budget: BudgetInterface): void {
        this.router.navigate([`/orcamento-editar/${budget.id!}`]);
    }

    openDialogClient(client: BudgetClientInterface): void {
        this.visibleInfoClient = true;
        this.client = client;
    }


    async download(budget: BudgetInterface): Promise<void> {
        this.loading.run();
        const html = document.querySelector('#content');
        const budgetLocal: BudgetTemplateInterface = { 
            ...budget,
            pageCount: 1,
            totalPage: 1
        };

        const totalItems = budgetLocal.products!.length + (budgetLocal.services ? budgetLocal.services.length : 0);
        let maxItemsPerPage = 6;
        const maxItemPerPage = (items: number) => {
            return Math.ceil(items / totalItems * maxItemsPerPage);
        };
        const pages = Math.ceil(totalItems / maxItemsPerPage);

        const resultPages: BudgetTemplateInterface[] = [];

        if (pages > 1) {
            for (let i = 0; i < pages; i++) {
                const startP = i * maxItemPerPage(budgetLocal.products!.length);
                const startS = i * maxItemPerPage(budgetLocal.services ? budgetLocal.services.length : 0);
                const endP = startP + maxItemPerPage(budgetLocal.products!.length);
                const endS = startS + maxItemPerPage(budgetLocal.services ? budgetLocal.services.length : 0);
                const budgetPage: BudgetTemplateInterface = {
                    ...budgetLocal,
                    products: budget.products!.slice(startP, endP),
                    services: budget.services?.slice(startS, endS),
                    pageCount: i + 1,
                    totalPage: pages
                };1
                resultPages.push(budgetPage);
            }
        }

        this.budgetSelected = resultPages.length ? resultPages : [budgetLocal];
        html?.classList.remove("hidden");

        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // captura cada template separadamente
            const templates = html!.querySelectorAll("template-pdf");

            for (let i = 0; i < templates.length; i++) {
                const el = templates[i] as HTMLElement;

                const canvas = await html2canvas(el, {
                    scale: 4,
                    width: 794,
                    height: 1123
                });
                const imgData = canvas.toDataURL("image/png");

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`${budget.name}.pdf`);
        } catch (error) {
            console.error(error);
            this.toast.show("Erro no download", 'error', 5000);
        } finally {
            html?.classList.add("hidden");
            this.loading.stop();
        }
    }
}
