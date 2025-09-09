import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ConsignmentForm } from './consignment-form';
import { ConsignmentHttpService } from '../../../core/http-services/consignment.http-service';
import { SupplierHttpService } from '../../../core/http-services/supplier.http-service';
import { MessageService } from 'primeng/api';

describe('ConsignmentForm', () => {
  let component: ConsignmentForm;
  let fixture: ComponentFixture<ConsignmentForm>;
  let mockConsignmentService: jasmine.SpyObj<ConsignmentHttpService>;
  let mockSupplierService: jasmine.SpyObj<SupplierHttpService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const consignmentServiceSpy = jasmine.createSpyObj('ConsignmentHttpService', ['createConsignment']);
    const supplierServiceSpy = jasmine.createSpyObj('SupplierHttpService', ['getAllSuppliers']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ConsignmentForm, ReactiveFormsModule],
      providers: [
        { provide: ConsignmentHttpService, useValue: consignmentServiceSpy },
        { provide: SupplierHttpService, useValue: supplierServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsignmentForm);
    component = fixture.componentInstance;
    mockConsignmentService = TestBed.inject(ConsignmentHttpService) as jasmine.SpyObj<ConsignmentHttpService>;
    mockSupplierService = TestBed.inject(SupplierHttpService) as jasmine.SpyObj<SupplierHttpService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;

    // Mock suppliers data
    mockSupplierService.getAllSuppliers.and.returnValue(of([
      { id: 1, name: 'Test Supplier 1', email: 'test1@example.com', phoneNumber: '1234567890', address: 'Test Address 1', initials: 'TS1', commissionPercentageInCash: 10, commissionPercentageInProducts: 15 },
      { id: 2, name: 'Test Supplier 2', email: 'test2@example.com', phoneNumber: '0987654321', address: 'Test Address 2', initials: 'TS2', commissionPercentageInCash: 12, commissionPercentageInProducts: 18 }
    ]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load suppliers on init', () => {
    component.ngOnInit();
    expect(mockSupplierService.getAllSuppliers).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    component.consignmentForm.patchValue({
      supplierId: '',
      consignmentDate: ''
    });

    expect(component.consignmentForm.invalid).toBeTruthy();
    expect(component.isFieldInvalid('supplierId')).toBeTruthy();
    expect(component.isFieldInvalid('consignmentDate')).toBeTruthy();
  });

  it('should create consignment when form is valid', () => {
    const mockConsignment = { id: 1, supplierId: 1, consignmentDate: '2024-01-01T00:00:00.000Z', items: [] };
    mockConsignmentService.createConsignment.and.returnValue(of(mockConsignment));

    component.consignmentForm.patchValue({
      supplierId: '1',
      consignmentDate: '2024-01-01'
    });

    component.onSubmit();

    expect(mockConsignmentService.createConsignment).toHaveBeenCalledWith({
      supplierId: 1,
      consignmentDate: new Date('2024-01-01').toISOString()
    });
  });
});
