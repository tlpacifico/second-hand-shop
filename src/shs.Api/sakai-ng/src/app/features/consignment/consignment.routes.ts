import { Routes } from '@angular/router';
import { SupplierList } from './supplier-list/supplier-list';
import { SupplierForm } from './supplier-form/supplier-form';
import { SupplierEdit } from './supplier-edit/supplier-edit';
import { ConsignmentList } from './consignment-list/consignment-list';
import { ConsignmentForm } from './consignment-form/consignment-form';
import { ConsignmentEdit } from './consignment-edit/consignment-edit';

const consignmentRoutes: Routes = [
    { path: '', component: ConsignmentList },
    { path: 'new', component: ConsignmentForm },
    { path: ':id/edit', component: ConsignmentEdit },
    { path: 'suppliers', component: SupplierList },
    { path: 'suppliers/new', component: SupplierForm },
    { path: 'suppliers/:id/edit', component: SupplierEdit }
]  as Routes;

export default consignmentRoutes;
