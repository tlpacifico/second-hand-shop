import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';
import { SupplierHttpService } from '../../../core/http-services/supplier.http-service';
import { UpdateConsignmentSupplierRequest, ConsignmentSupplierResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-supplier-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    ToastModule,
    RippleModule
  ],
  templateUrl: './supplier-edit.html',
  styleUrl: './supplier-edit.scss',
  providers: [MessageService]
})
export class SupplierEdit implements OnInit, OnDestroy {
  supplierForm: FormGroup;
  isLoading = false;
  supplierId: number | null = null;
  supplier: ConsignmentSupplierResponse | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierHttpService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.supplierForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.supplierId = +params['id'];
      if (this.supplierId) {
        this.loadSupplier();
      }
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      initial: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      address: ['', [Validators.maxLength(200)]],
      commissionPercentageInCash: [0, [Validators.min(0), Validators.max(100)]],
      commissionPercentageInProducts: [0, [Validators.min(0), Validators.max(100)]]
    });
  }

  private loadSupplier(): void {
    if (!this.supplierId) return;

    this.isLoading = true;
    this.supplierService.getSupplierById(this.supplierId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (supplier: ConsignmentSupplierResponse) => {
          this.supplier = supplier;
          this.populateForm(supplier);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load supplier details'
          });
          console.error('Error loading supplier:', error);
          this.router.navigate(['/suppliers']);
        }
      });
  }

  private populateForm(supplier: ConsignmentSupplierResponse): void {
    this.supplierForm.patchValue({
      name: supplier.name,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      initial: supplier.initials,
      address: supplier.address || '',
      commissionPercentageInCash: supplier.commissionPercentageInCash || 0,
      commissionPercentageInProducts: supplier.commissionPercentageInProducts || 0
    });
  }

  onSubmit(): void {
    if (this.supplierForm.valid && !this.isLoading && this.supplierId) {
      this.isLoading = true;

      const formValue = this.supplierForm.value;
      const supplierRequest: UpdateConsignmentSupplierRequest = {
        name: formValue.name,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        initial: formValue.initial,
        address: formValue.address || undefined,
        commissionPercentageInCash: formValue.commissionPercentageInCash || 0,
        commissionPercentageInProducts: formValue.commissionPercentageInProducts || 0
      };

      this.supplierService.updateSupplier(this.supplierId, supplierRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedSupplier) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Supplier updated successfully'
            });

            // Navigate back to suppliers list after a short delay
            setTimeout(() => {
              this.router.navigate(['/suppliers']);
            }, 1500);
          },
          error: (error) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update supplier. Please try again.'
            });
            console.error('Error updating supplier:', error);
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.supplierForm);
    }
  }

  onCancel(): void {
    this.router.navigate(['/suppliers']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.supplierForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.supplierForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['min']) return 'Value must be at least 0';
      if (field.errors['max']) return 'Value must not exceed 100';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
