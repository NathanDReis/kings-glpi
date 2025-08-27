import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { ProductInterface } from '../../../interfaces/product';
import { ProductService } from '../../../services/product';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
  selector: 'app-product',
  imports: [
    TableModule, 
    Dialog, 
    Ripple, 
    SelectModule, 
    ToastModule, 
    ToolbarModule, 
    ConfirmDialog, 
    InputTextModule, 
    TextareaModule, 
    CommonModule, 
    FileUpload, 
    Tag, 
    RadioButton, 
    Rating, 
    InputTextModule, 
    FormsModule, 
    InputNumber, 
    IconFieldModule, 
    InputIconModule,
    ButtonModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent implements OnInit{
    productDialog: boolean = false;

    products!: ProductInterface[];

    product!: ProductInterface;

    selectedProducts!: ProductInterface[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];

    private productService = inject(ProductService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    constructor(
        private cd: ChangeDetectorRef
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
      this.productService.findAll()
      .then((data) => {
        console.clear();
        console.log('Produtos carregados com sucesso:', data);
      })
      .catch((error) => {
        console.clear()
        console.error('Erro ao carregar produtos:', error);
      });
        // this.loadDemoData();
    }
    
    loadDemoData() {
        this.productService.findAll().then((data) => {
            this.products = data;
            this.cd.markForCheck();
        }).catch((error) => {
          console.clear()
            console.error('Erro ao carregar produtos:', error);
        });

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];

        this.cols = [
            { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            { field: 'name', header: 'Name' },
            { field: 'image', header: 'Image' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    openNew() {
        // this.product = {};
        // this.submitted = false;
        // this.productDialog = true;
    }

    editProduct(product: ProductInterface) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected products?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                variant: 'text'
            },
            acceptButtonProps: {
                severity: 'danger',
                label: 'Yes'
            },
            accept: () => {
                this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    deleteProduct(product: ProductInterface) {
        // this.confirmationService.confirm({
        //     message: 'Are you sure you want to delete ' + product.name + '?',
        //     header: 'Confirm',
        //     icon: 'pi pi-exclamation-triangle',
        //     rejectButtonProps: {
        //         label: 'No',
        //         severity: 'secondary',
        //         variant: 'text'
        //     },
        //     acceptButtonProps: {
        //         severity: 'danger',
        //         label: 'Yes'
        //     },
        //     accept: () => {
        //         this.products = this.products.filter((val) => val.id !== product.id);
        //         this.product = {};
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Deleted',
        //             life: 3000
        //         });
        //     }
        // });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return undefined;
        }
    }

    saveProduct(): void {
        // this.submitted = true;

        // if (this.product.name?.trim()) {
        //     if (this.product.id) {
        //         this.products[this.findIndexById(this.product.id)] = this.product;
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Updated',
        //             life: 3000
        //         });
        //     } else {
        //         this.product.id = this.createId();
        //         this.products.push(this.product);
        //         this.messageService.add({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Created',
        //             life: 3000
        //         });
        //     }

        //     this.products = [...this.products];
        //     this.productDialog = false;
        //     this.product = {};
        // }
    }
}