import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ConsignmentService } from '../../consignment-data.services';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [TableModule, RouterModule, ButtonModule, ConfirmDialogModule],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent {
    public data: any[] = [];
    public loading: boolean = false;
    public totalRecords = 0;
    public first = 0;
    public menuTranslated: { [name: string]: string } = {};

    private VehicleFilter: any = {};

    constructor(private consignmentService: ConsignmentService) {
    }


    public loadData(event: TableLazyLoadEvent) {
        this.VehicleFilter = {};

        for (let key in event.filters) {
          const f = event.filters[key] as {
            value?: any,
            matchMode?: string;
            operator?: string;
          }[]
          if (f[0].matchMode === 'contains') {
            this.VehicleFilter[key as keyof any] = f[0].value;
            continue;
          }
        }
        this.VehicleFilter.skip = event.first ?? 0;
        this.VehicleFilter.take = event.rows ?? 10;
        this.consignmentService.getSuppliers().subscribe(data => {
          this.totalRecords = data.length;
          //this.router.navigated = false;
          this.data = data.map(item => {
            return {
              ...item,
            }
          });
        });
      }
}
