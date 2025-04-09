import { Component } from '@angular/core';
import { ConsignmentService } from '../consignment-data.services';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { combineLatest, filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-consignment-list',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule, ButtonModule, ConfirmDialogModule],
  templateUrl: './consignment-list.component.html',
  styleUrl: './consignment-list.component.scss'
})
export class ConsignmentListComponent {
    public data: any[] = [];
    public loading: boolean = false;
    public totalRecords = 0;
    public first = 0;
    public menuTranslated: { [name: string]: string } = {};

    private consignmentFilter: any = {};

    public supplierId: number;
    public vm$: Observable<{
        supplierId: string;
    }>;


    constructor(private consignmentService: ConsignmentService,
        private activatedRoute: ActivatedRoute
    ) {
        this.vm$ = combineLatest([
            this.activatedRoute.params.pipe(
                filter(params => params['id'] != null),
                map(params => params['id'])
            ),
            this.activatedRoute.queryParams
        ]).pipe(
            map(([id]) => {
                this.supplierId = id;
                return {
                    supplierId: id
                }
            }
            ));
    }

    public loadData(event: TableLazyLoadEvent) {
        this.consignmentFilter = {};

        for (let key in event.filters) {
            const f = event.filters[key] as {
                value?: any,
                matchMode?: string;
                operator?: string;
            }[];
            if (f[0].matchMode === 'contains') {
                this.consignmentFilter[key as keyof any] = f[0].value;
                continue;
            }
        }
        this.consignmentFilter.skip = event.first ?? 0;
        this.consignmentFilter.take = event.rows ?? 10;
        this.consignmentService.getSupplierConsigned(this.supplierId).subscribe(data => {
            this.totalRecords = data.length;
            this.data = data.map(item => {
                return {
                    ...item,
                };
            });
        });
    }
}
