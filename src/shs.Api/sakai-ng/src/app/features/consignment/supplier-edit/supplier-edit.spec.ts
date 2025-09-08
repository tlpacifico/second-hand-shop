import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { SupplierEdit } from './supplier-edit';
import { SupplierHttpService } from '../../../core/http-services/supplier.http-service';
import { ConsignmentSupplierResponse } from '../../../core/models/api.models';

describe('SupplierEdit', () => {
  let component: SupplierEdit;
  let fixture: ComponentFixture<SupplierEdit>;
  let mockSupplierService: jasmine.SpyObj<SupplierHttpService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const mockSupplier: ConsignmentSupplierResponse = {
    id: 1,
    name: 'Test Supplier',
    email: 'test@example.com',
    phoneNumber: '1234567890',
    address: '123 Test St',
    initials: 'TS',
    commissionPercentageInCash: 10,
    commissionPercentageInProducts: 15
  };

  beforeEach(async () => {
    const supplierServiceSpy = jasmine.createSpyObj('SupplierHttpService', ['getSupplierById', 'updateSupplier']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [SupplierEdit, ReactiveFormsModule],
      providers: [
        MessageService,
        { provide: SupplierHttpService, useValue: supplierServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierEdit);
    component = fixture.componentInstance;
    mockSupplierService = TestBed.inject(SupplierHttpService) as jasmine.SpyObj<SupplierHttpService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    mockSupplierService.getSupplierById.and.returnValue(of(mockSupplier));
    mockSupplierService.updateSupplier.and.returnValue(of(mockSupplier));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load supplier data on init', () => {
    component.ngOnInit();
    expect(mockSupplierService.getSupplierById).toHaveBeenCalledWith(1);
  });

  it('should populate form with supplier data', () => {
    component.ngOnInit();
    expect(component.supplierForm.get('name')?.value).toBe(mockSupplier.name);
    expect(component.supplierForm.get('email')?.value).toBe(mockSupplier.email);
  });

  it('should validate required fields', () => {
    component.supplierForm.patchValue({
      name: '',
      email: '',
      phoneNumber: '',
      initial: ''
    });

    expect(component.supplierForm.invalid).toBeTruthy();
    expect(component.supplierForm.get('name')?.hasError('required')).toBeTruthy();
    expect(component.supplierForm.get('email')?.hasError('required')).toBeTruthy();
  });

  it('should navigate back to suppliers list on cancel', () => {
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/suppliers']);
  });
});
