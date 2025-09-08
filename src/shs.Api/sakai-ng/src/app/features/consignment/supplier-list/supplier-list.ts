import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { SupplierHttpService } from '../../../core/http-services/supplier.http-service';
import {
  PageWithTotalOfConsignmentSupplierResponse,
  ConsignmentSupplierResponse,
  PaginationParams
} from '../../../core/models/api.models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-supplier-list',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialog,
    RouterModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    RippleModule
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
  providers: [ConfirmationService, MessageService]
})
export class SupplierList implements OnInit, OnDestroy {
  data: ConsignmentSupplierResponse[] = [];
  totalRecords: number = 0;
  rowCount: number = 10;
  expandedRowKeys: { [s: string]: boolean } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private supplierService: SupplierHttpService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Initial load will be handled by loadData when table initializes
  }

  loadData(event: TableLazyLoadEvent) {
    const params: PaginationParams = {
      Skip: event.first ?? 0,
      Take: event.rows ?? 10
    };

    this.supplierService.getSuppliers(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PageWithTotalOfConsignmentSupplierResponse) => {
          this.data = result.items;
          this.totalRecords = result.total;

          // Auto-expand all rows for better UX
          for (const item of result.items) {
            this.expandedRowKeys[item.id.toString()] = true;
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load suppliers'
          });
          console.error('Error loading suppliers:', error);
        }
      });
  }

  confirmDeleteSupplier(supplier: ConsignmentSupplierResponse) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this supplier?',
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
        this.deleteSupplier(supplier);
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

  getRelativeRoute(supplier: ConsignmentSupplierResponse): string[] {
    return ['/suppliers', supplier.id.toString()];
  }

  private deleteSupplier(supplier: ConsignmentSupplierResponse) {
    this.supplierService.deleteSupplier(supplier.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Supplier deleted successfully.'
          });
          this.loadData({ first: 0, rows: this.rowCount });
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete supplier'
          });
          console.error('Error deleting supplier:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
