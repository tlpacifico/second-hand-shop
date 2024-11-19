import { Route } from "@angular/router";
import { SupplierListComponent } from "./supplier-list/supplier-list.component";
import { ConsignmentService } from "../consignment-data.services";
import { SupplierFormComponent } from "./supplier-form/supplier-form.component";
import { ConsignmnetFormComponent } from "./consignment-form/consignment-form.component";
import { ConsignmentListComponent } from "../consignment-list/consignment-list.component";

export const ROUTES: Route[] = [
    {
        path: '',
        pathMatch: 'prefix',
        providers: [ConsignmentService],
        children: [
            {
                path: '',
                component: SupplierListComponent,
                data: { breadcrumb: 'List' },
            },
            {
                path: 'create',
                component: SupplierFormComponent,
                data: { breadcrumb: 'Create' },
            },
            {
                path: ':id/update',
                component: SupplierFormComponent,
                data: { breadcrumb: 'Update' },
            },
            {
                path: ':id/consigned/create',
                component: ConsignmnetFormComponent,
                data: { breadcrumb: 'Criar consiginação' },
            },
            {
                path: ':id/consigned',
                component: ConsignmentListComponent,
                data: { breadcrumb: 'Consigned' },
            }
        ]
    }
];
