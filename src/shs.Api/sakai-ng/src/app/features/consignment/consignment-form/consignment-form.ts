import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';
import { ConsignmentHttpService } from '../../../core/http-services/consignment.http-service';
import { SupplierHttpService } from '../../../core/http-services/supplier.http-service';
import {
  CreateConsignmentRequest,
  ConsignmentSupplierResponse
} from '../../../core/models/api.models';

@Component({
  selector: 'app-consignment-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    SelectButtonModule,
    ToastModule,
    RippleModule
  ],
  templateUrl: './consignment-form.html',
  styleUrl: './consignment-form.scss',
  providers: [MessageService]
})
export class ConsignmentForm implements OnInit, OnDestroy {
  consignmentForm: FormGroup;
  isLoading = false;
  suppliers: ConsignmentSupplierResponse[] = [];
  loadingSuppliers = false;
  maxDate = new Date().toISOString().split('T')[0];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private consignmentService: ConsignmentHttpService,
    private supplierService: SupplierHttpService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.consignmentForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      supplierId: ['', [Validators.required]],
      consignmentDate: [new Date().toISOString().split('T')[0], [Validators.required]]
    });
  }

  private loadSuppliers(): void {
    this.loadingSuppliers = true;
    this.supplierService.getAllSuppliers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          this.loadingSuppliers = false;
        },
        error: (error) => {
          this.loadingSuppliers = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load suppliers'
          });
          console.error('Error loading suppliers:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.consignmentForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formValue = this.consignmentForm.value;
      const consignmentRequest: CreateConsignmentRequest = {
        supplierId: parseInt(formValue.supplierId),
        consignmentDate: new Date(formValue.consignmentDate).toISOString()
      };

      this.consignmentService.createConsignment(consignmentRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (createdConsignment) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Consignment created successfully'
            });

            // Navigate back to consignments list after a short delay
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          },
          error: (error) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create consignment. Please try again.'
            });
            console.error('Error creating consignment:', error);
          }
        });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.consignmentForm);
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.consignmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.consignmentForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
    }
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
