import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SupplierForm } from './supplier-form';
import { SupplierHttpService } from '../../../core/http-services/supplier.http-service';
import { CreateConsignmentSupplierRequest } from '../../../core/models/api.models';

describe('SupplierForm', () => {
  let component: SupplierForm;
  let fixture: ComponentFixture<SupplierForm>;
  let mockSupplierService: jasmine.SpyObj<SupplierHttpService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const supplierServiceSpy = jasmine.createSpyObj('SupplierHttpService', ['createSupplier']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SupplierForm, ReactiveFormsModule],
      providers: [
        { provide: SupplierHttpService, useValue: supplierServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierForm);
    component = fixture.componentInstance;
    mockSupplierService = TestBed.inject(SupplierHttpService) as jasmine.SpyObj<SupplierHttpService>;
    mockMessageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.supplierForm.get('name')?.value).toBe('');
    expect(component.supplierForm.get('email')?.value).toBe('');
    expect(component.supplierForm.get('phoneNumber')?.value).toBe('');
    expect(component.supplierForm.get('initial')?.value).toBe('');
    expect(component.supplierForm.get('address')?.value).toBe('');
    expect(component.supplierForm.get('commissionPercentageInCash')?.value).toBe(0);
    expect(component.supplierForm.get('commissionPercentageInProducts')?.value).toBe(0);
  });

  it('should validate required fields', () => {
    const form = component.supplierForm;

    expect(form.get('name')?.hasError('required')).toBeTruthy();
    expect(form.get('email')?.hasError('required')).toBeTruthy();
    expect(form.get('phoneNumber')?.hasError('required')).toBeTruthy();
    expect(form.get('initial')?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.supplierForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should create supplier successfully', () => {
    const mockSupplier = {
      id: 1,
      name: 'Test Supplier',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      initials: 'TS',
      address: 'Test Address',
      commissionPercentageInCash: 10,
      commissionPercentageInProducts: 15
    };

    mockSupplierService.createSupplier.and.returnValue(of(mockSupplier));

    component.supplierForm.patchValue({
      name: 'Test Supplier',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      initial: 'TS',
      address: 'Test Address',
      commissionPercentageInCash: 10,
      commissionPercentageInProducts: 15
    });

    component.onSubmit();

    expect(mockSupplierService.createSupplier).toHaveBeenCalledWith({
      name: 'Test Supplier',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      initial: 'TS',
      address: 'Test Address',
      commissionPercentageInCash: 10,
      commissionPercentageInProducts: 15
    } as CreateConsignmentSupplierRequest);

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Supplier created successfully'
    });
  });

  it('should handle create supplier error', () => {
    mockSupplierService.createSupplier.and.returnValue(throwError(() => new Error('API Error')));

    component.supplierForm.patchValue({
      name: 'Test Supplier',
      email: 'test@example.com',
      phoneNumber: '1234567890',
      initial: 'TS'
    });

    component.onSubmit();

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create supplier. Please try again.'
    });
  });

  it('should navigate to suppliers list on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/suppliers']);
  });
});
