import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';
import { ConsignmentHttpService } from '../../../core/http-services/consignment.http-service';
import { StoreHttpService } from '../../../core/http-services/store.http-service';
import {
  ConsignmentDetailResponse,
  ConsignmentItemResponse,
  UpdateConsignmentRequest,
  AddConsignmentItemRequest,
  UpdateConsignmentItemRequest,
  BrandResponse,
  TagResponse
} from '../../../core/models/api.models';

@Component({
  selector: 'app-consignment-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    CardModule,
    TableModule,
    ConfirmDialog,
    ToastModule,
    RippleModule
  ],
  templateUrl: './consignment-edit.html',
  styleUrl: './consignment-edit.scss',
  providers: [ConfirmationService, MessageService]
})
export class ConsignmentEdit implements OnInit, OnDestroy {
  consignmentForm: FormGroup;
  itemForm: FormGroup;
  isLoading = false;
  loadingItems = false;
  consignmentId: number | null = null;
  consignment: ConsignmentDetailResponse | null = null;
  items: ConsignmentItemResponse[] = [];
  brands: BrandResponse[] = [];
  tags: TagResponse[] = [];
  selectedTags: number[] = [];
  editingItem: ConsignmentItemResponse | null = null;
  showItemForm = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private consignmentService: ConsignmentHttpService,
    private storeService: StoreHttpService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.consignmentForm = this.createConsignmentForm();
    this.itemForm = this.createItemForm();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.consignmentId = +params['id'];
      if (this.consignmentId) {
        this.loadConsignment();
        this.loadBrandsAndTags();
      }
    });
  }

  private createConsignmentForm(): FormGroup {
    return this.fb.group({
      supplierId: ['', [Validators.required]],
      consignmentDate: ['', [Validators.required]]
    });
  }

  private createItemForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      size: ['', [Validators.required, Validators.maxLength(20)]],
      brandId: [null],
      color: ['', [Validators.maxLength(50)]],
      tagIds: [[]]
    });
  }

  private loadConsignment(): void {
    if (!this.consignmentId) return;

    this.isLoading = true;
    this.consignmentService.getConsignmentById(this.consignmentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (consignment: ConsignmentDetailResponse) => {
          this.consignment = consignment;
          this.items = consignment.items;
          this.populateConsignmentForm(consignment);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load consignment details'
          });
          console.error('Error loading consignment:', error);
          this.router.navigate(['/']);
        }
      });
  }

  private loadBrandsAndTags(): void {
    this.storeService.getBrands()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (brands) => {
          this.brands = brands;
        },
        error: (error) => {
          console.error('Error loading brands:', error);
        }
      });

    this.storeService.getTags()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tags) => {
          this.tags = tags;
        },
        error: (error) => {
          console.error('Error loading tags:', error);
        }
      });
  }

  private populateConsignmentForm(consignment: ConsignmentDetailResponse): void {
    this.consignmentForm.patchValue({
      supplierId: consignment.supplierId,
      consignmentDate: new Date(consignment.consignmentDate).toISOString().split('T')[0]
    });
  }

  onConsignmentSubmit(): void {
    if (this.consignmentForm.valid && !this.isLoading && this.consignmentId) {
      this.isLoading = true;

      const formValue = this.consignmentForm.value;
      const updateRequest: UpdateConsignmentRequest = {
        supplierId: parseInt(formValue.supplierId),
        consignmentDate: new Date(formValue.consignmentDate).toISOString(),
        items: [],
        newItems: [],
        deletedItemsIds: []
      };

      this.consignmentService.updateConsignment(this.consignmentId, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Consignment updated successfully'
            });
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update consignment. Please try again.'
            });
            console.error('Error updating consignment:', error);
          }
        });
    } else {
      this.markFormGroupTouched(this.consignmentForm);
    }
  }

  showAddItemForm(): void {
    this.editingItem = null;
    this.itemForm.reset();
    this.selectedTags = [];
    this.showItemForm = true;
  }

  showEditItemForm(item: ConsignmentItemResponse): void {
    this.editingItem = item;
    this.itemForm.patchValue({
      name: item.name,
      description: item.description || '',
      price: item.evaluatedValue,
      size: item.size,
      brandId: item.brandId,
      color: item.color || '',
      tagIds: item.tagIds
    });
    this.selectedTags = [...item.tagIds];
    this.showItemForm = true;
  }

  onItemSubmit(): void {
    if (this.itemForm.valid && !this.loadingItems && this.consignmentId) {
      this.loadingItems = true;

      const formValue = this.itemForm.value;
      const itemRequest: AddConsignmentItemRequest = {
        name: formValue.name,
        description: formValue.description || undefined,
        price: formValue.price,
        size: formValue.size,
        brandId: formValue.brandId || 0,
        color: formValue.color || undefined,
        tagIds: this.selectedTags
      };

      if (this.editingItem) {
        // Update existing item
        const updateRequest: UpdateConsignmentItemRequest = {
          name: formValue.name,
          description: formValue.description || undefined,
          price: formValue.price,
          size: formValue.size,
          brandId: formValue.brandId || 0,
          color: formValue.color || undefined,
          tagIds: this.selectedTags
        };

        this.consignmentService.updateConsignmentItem(this.consignmentId, this.editingItem.id, updateRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item updated successfully'
              });
              this.loadConsignment(); // Reload to get updated data
              this.hideItemForm();
            },
            error: (error) => {
              this.loadingItems = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update item. Please try again.'
              });
              console.error('Error updating item:', error);
            }
          });
      } else {
        // Add new item
        this.consignmentService.addConsignmentItem(this.consignmentId, itemRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Item added successfully'
              });
              this.loadConsignment(); // Reload to get updated data
              this.hideItemForm();
            },
            error: (error) => {
              this.loadingItems = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add item. Please try again.'
              });
              console.error('Error adding item:', error);
            }
          });
      }
    } else {
      this.markFormGroupTouched(this.itemForm);
    }
  }

  confirmDeleteItem(item: ConsignmentItemResponse): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this item?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.deleteItem(item);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Delete operation cancelled'
        });
      }
    });
  }

  private deleteItem(item: ConsignmentItemResponse): void {
    if (!this.consignmentId) return;

    this.consignmentService.deleteConsignmentItem(this.consignmentId, item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Item deleted successfully'
          });
          this.loadConsignment(); // Reload to get updated data
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete item'
          });
          console.error('Error deleting item:', error);
        }
      });
  }

  hideItemForm(): void {
    this.showItemForm = false;
    this.editingItem = null;
    this.itemForm.reset();
    this.selectedTags = [];
    this.loadingItems = false;
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
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['min']) return 'Value must be greater than 0';
    }
    return '';
  }

  getBrandName(brandId: number): string {
    const brand = this.brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown';
  }

  getTagNames(tagIds: number[]): string {
    return tagIds.map(id => {
      const tag = this.tags.find(t => t.id === id);
      return tag ? tag.name : 'Unknown';
    }).join(', ');
  }

  onTagChange(tagId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedTags.includes(tagId)) {
        this.selectedTags.push(tagId);
      }
    } else {
      this.selectedTags = this.selectedTags.filter(id => id !== tagId);
    }
    this.itemForm.patchValue({ tagIds: this.selectedTags });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
