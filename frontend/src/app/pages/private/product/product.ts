import { CommonModule } from '@angular/common';
import { 
    ChangeDetectorRef, 
    Component, 
    inject, 
    OnInit, 
    ViewChild 
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

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

import { ProductInterface } from '../../../interfaces/product';
import { ProductService } from '../../../services/product';
import { ToastService } from '../../../services/toast';
import { LoadingService } from '../../../services/loading';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Component({
  selector: 'app-product',
  imports: [
    TableModule, 
    Dialog, 
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
  ],
  providers: [ConfirmationService],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent implements OnInit{
    productDialog: boolean = false;
    actionDialog: string = 'Criar Produto';

    products!: ProductInterface[];
    product: ProductInterface = {
        id: '',
        name: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
    };
    selectedProducts!: ProductInterface[] | null;
    submitted: boolean = false;

    @ViewChild('dt') dt!: Table;

    cols: Column[] = [
        { field: 'id', header: 'Código' },
        { field: 'name', header: 'Nome' },
        { field: 'brand', header: 'Marca' },
        { field: 'model', header: 'Modelo' },
    ];

    private productService = inject(ProductService);
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
            const data = await this.productService.findAll();
            this.products = data;
            this.product = {
                id: '',
                name: '',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };
            
            this.cd.markForCheck();
        } catch (error) {
            this.toast.show('Não foi possível buscar produtos', 'error', 5000);
        } finally {
            this.loading.stop();
        }
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Deseja deletar todos os produtos selecionados?',
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
                    const promiseDelete = this.selectedProducts?.map(async (product) => this.productService.delete(product.id!));
                    const results = await Promise.allSettled(promiseDelete || []);

                    const failedDeletions = results.filter(result => result.status === 'rejected');

                    if (failedDeletions.length > 0) {
                        this.toast.show(`${failedDeletions.length} produto(s) não puderam ser deletados`, 'error', 5000);
                    }

                    this.loadData();
                } catch (error) {
                    this.toast.show('Não foi possível deletar os produtos', 'error', 5000);
                } finally {
                    this.loading.stop();
                }
            }
        });
    }

    deleteProduct(product: ProductInterface): void {
        this.confirmationService.confirm({
            message: 'Você deseja deletar ' + product.name + '?',
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
                    await this.productService.delete(product.id!);
                    this.loadData();
                    this.toast.show('Produto excluido', 'success');
                } catch (error) {
                    this.toast.show('Não foi possível deletar produto', 'error', 5000);
                } finally {
                    this.loading.stop();
                }
            }
        });
    }

    async saveProduct(): Promise<void> {
        try {
            this.loading.run();
            this.submitted = true;
    
            if (!this.product?.name.trim()) return 

            const {id, ...data} = this.product; 
            
            if (this.product?.id) {
                await this.productService.update(this.product.id, data);
                this.toast.show('Produto atualizado', 'success');
            } else {
                await this.productService.create(data);
                this.toast.show('Produto criado', 'success');
            }
    
            this.productDialog = false;
            this.loadData();
        } catch (error) {
            this.loading.stop();
            this.toast.show(`Não foi possível ${this.product?.id ? 'atualizar' : 'criar'} produto`, 'error', 5000);
        }
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    openNew() {
        this.product = {
            id: '',
            name: '',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };
        this.submitted = false;
        this.productDialog = true;
        this.actionDialog = 'Criar Produto';
    }

    editProduct(product: ProductInterface) {
        this.product = { ...product };
        this.productDialog = true;
        this.actionDialog = 'Editar Produto';
    }
}