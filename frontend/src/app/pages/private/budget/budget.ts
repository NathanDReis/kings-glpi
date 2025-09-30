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
        // this.loading.run();
        const html = document.querySelector('#content');
        const budgetLocal: BudgetTemplateInterface = { 
            ...budget,
            products: budget.products.map((p, index) => ({...p, num: index + 1})),
            services: budget.services.map((s, index) => ({...s, num: index + 1})),
            pageCount: 1,
            totalPage: 1
        };

        const maxItemPerPage = 10;
        const maxItemFirstPage = 10; // Limite maior para primeira página
        let resultPages: BudgetTemplateInterface[] = [];

        let servicesFirstPage = 0;
        let productsFirstPage = Math.min(budgetLocal.products!.length, maxItemFirstPage);
        let needsSignaturePage = false;

        // Primeira página com até 10 produtos
        if (productsFirstPage > 0) {
            servicesFirstPage = Math.max(0, maxItemFirstPage - productsFirstPage);
            const firstPageServices = budgetLocal.services && budgetLocal.services.length ? 
                budgetLocal.services.slice(0, Math.min(servicesFirstPage, budgetLocal.services.length)) : [];
            
            resultPages.push({
                ...budgetLocal,
                products: budgetLocal.products!.slice(0, productsFirstPage),
                services: firstPageServices,
                pageCount: 1,
            });

            // Se usou mais de 6 itens na primeira página, precisa de página de assinatura
            if (productsFirstPage + firstPageServices.length > maxItemPerPage) {
                needsSignaturePage = true;
            }
        }

        // Processar produtos restantes (a partir do item maxItemFirstPage)
        const remainingProducts = budgetLocal.products!.slice(productsFirstPage);
        if (remainingProducts.length > 0) {
            const pagesProducts = Math.ceil(remainingProducts.length / maxItemPerPage);
            const productsLastPage = remainingProducts.length % maxItemPerPage || maxItemPerPage;
            
            for (let i = 0; i < pagesProducts; i++) {
                const startP = i * maxItemPerPage;
                const endP = startP + maxItemPerPage;
                
                if (i === pagesProducts - 1) {
                    // Última página de produtos - tenta adicionar serviços
                    const spaceAvailable = maxItemPerPage - productsLastPage;
                    const servicesStart = servicesFirstPage;
                    const servicesEnd = servicesStart + spaceAvailable;
                    
                    resultPages.push({
                        ...budgetLocal,
                        products: remainingProducts.slice(startP, endP),
                        services: budgetLocal.services && budgetLocal.services.length ? 
                            budgetLocal.services.slice(servicesStart, servicesEnd) : [],
                        pageCount: resultPages.length + 1,
                    });
                    
                    servicesFirstPage = servicesEnd;
                } else {
                    resultPages.push({
                        ...budgetLocal,
                        products: remainingProducts.slice(startP, endP),
                        services: [],
                        pageCount: resultPages.length + 1,
                    });
                }
            }
        }

        // Processar serviços restantes
        if (budgetLocal.services && budgetLocal.services.length && budgetLocal.services.length - servicesFirstPage > 0) {
            const servicesRestantes = budgetLocal.services.length - servicesFirstPage;
            
            if (servicesRestantes <= maxItemPerPage) {
                resultPages.push({
                    ...budgetLocal,
                    products: [],
                    services: budgetLocal.services.slice(servicesFirstPage),
                    pageCount: resultPages.length + 1
                });
            } else {
                const remainingServices = budgetLocal.services.slice(servicesFirstPage);
                const pagesServices = Math.ceil(remainingServices.length / maxItemPerPage);
                
                for (let i = 0; i < pagesServices; i++) {
                    const startS = i * maxItemPerPage;
                    const endS = startS + maxItemPerPage;

                    resultPages.push({
                        ...budgetLocal,
                        products: [],
                        services: remainingServices.slice(startS, endS),
                        pageCount: resultPages.length + 1,
                    });
                }
            }
        }

        // Se a primeira página ultrapassou 6 itens e só tem 1 página, criar página de assinatura
        if (needsSignaturePage && resultPages.length === 1) {
            resultPages.push({
                ...budgetLocal,
                products: [],
                services: [],
                pageCount: 2,
            });
        }

        // Atualizar totalPage em todas as páginas
        if (resultPages.length) {
            resultPages = [...resultPages.map((page) => ({
                ...page,
                totalPage: resultPages.length,
            }))];
        }

        this.budgetSelected = resultPages.length ? resultPages : [budgetLocal];
        html?.classList.remove("hidden");

        // try {
        //     await new Promise(resolve => setTimeout(resolve, 500));

        //     const pdf = new jsPDF("p", "mm", "a4");
        //     const pdfWidth = pdf.internal.pageSize.getWidth();
        //     const pdfHeight = pdf.internal.pageSize.getHeight();

        //     // captura cada template separadamente
        //     const templates = html!.querySelectorAll("template-pdf");

        //     for (let i = 0; i < templates.length; i++) {
        //         const el = templates[i] as HTMLElement;

        //         const canvas = await html2canvas(el, {
        //             scale: 4,
        //             width: 794,
        //             height: 1123
        //         });
        //         const imgData = canvas.toDataURL("image/png");

        //         if (i > 0) pdf.addPage();
        //         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        //     }

        //     pdf.save(`${budget.name}.pdf`);
        // } catch (error) {
        //     console.error(error);
        //     this.toast.show("Erro no download", 'error', 5000);
        // } finally {
        //     html?.classList.add("hidden");
        //     this.loading.stop();
        // }
    }
}
