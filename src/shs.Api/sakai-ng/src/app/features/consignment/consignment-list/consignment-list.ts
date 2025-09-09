import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConsignmentHttpService } from '../../../core/http-services/consignment.http-service';
import {
  PageWithTotalOfConsignmentSearchResult,
  ConsignmentSearchResult,
  PaginationParams
} from '../../../core/models/api.models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-consignment-list',
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
  templateUrl: './consignment-list.html',
  styleUrl: './consignment-list.scss',
  providers: [ConfirmationService, MessageService]
})
export class ConsignmentList implements OnInit, OnDestroy {
  data: ConsignmentSearchResult[] = [];
  totalRecords: number = 0;
  rowCount: number = 10;

  private destroy$ = new Subject<void>();

  constructor(
    private consignmentService: ConsignmentHttpService,
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

    this.consignmentService.getConsignments(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: PageWithTotalOfConsignmentSearchResult) => {
          this.data = result.items;
          this.totalRecords = result.total;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load consignments'
          });
          console.error('Error loading consignments:', error);
        }
      });
  }

  confirmDeleteConsignment(consignment: ConsignmentSearchResult) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this consignment?',
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
        this.deleteConsignment(consignment);
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

  getRelativeRoute(consignment: ConsignmentSearchResult): string[] {
    return ['/consignments', consignment.id.toString()];
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  private deleteConsignment(consignment: ConsignmentSearchResult) {
    // Note: The current API doesn't have a delete consignment endpoint
    // This is a placeholder for future implementation
    this.messageService.add({
      severity: 'warn',
      summary: 'Not Implemented',
      detail: 'Delete consignment functionality is not yet available'
    });
    console.log('Delete consignment:', consignment.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
