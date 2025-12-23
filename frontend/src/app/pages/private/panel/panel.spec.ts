import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelComponent } from './panel';
import { BudgetService } from '../../../services/budget';
import { ProductService } from '../../../services/product';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  let budgetServiceSpy: jasmine.SpyObj<BudgetService>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    const bSpy = jasmine.createSpyObj('BudgetService', ['findAll']);
    const pSpy = jasmine.createSpyObj('ProductService', ['findAll']);

    await TestBed.configureTestingModule({
      imports: [PanelComponent],
      providers: [
        { provide: BudgetService, useValue: bSpy },
        { provide: ProductService, useValue: pSpy }
      ]
    })
      .compileComponents();

    budgetServiceSpy = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    budgetServiceSpy.findAll.and.returnValue(Promise.resolve([]));
    productServiceSpy.findAll.and.returnValue(Promise.resolve([]));

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate stats correctly', async () => {
    const mockBudgets = [
      { status: 'pending', price: 100 },
      { status: 'approved', price: 200 },
      { status: 'rejected', price: 50 },
      { status: 'pending', price: 150 }
    ] as any[];
    const mockProducts = [{}, {}, {}] as any[];

    budgetServiceSpy.findAll.and.returnValue(Promise.resolve(mockBudgets));
    productServiceSpy.findAll.and.returnValue(Promise.resolve(mockProducts));

    await component.loadData();

    expect(component.totalBudgets).toBe(4);
    expect(component.totalProducts).toBe(3);
    expect(component.budgetsPending).toBe(2);
    expect(component.budgetsApproved).toBe(1);
    expect(component.budgetsRejected).toBe(1);
    expect(component.totalValue).toBe(500);
  });
});
