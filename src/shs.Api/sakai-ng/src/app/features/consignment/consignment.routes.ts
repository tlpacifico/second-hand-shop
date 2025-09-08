import { Routes } from '@angular/router';
import { SupplierList } from './supplier-list/supplier-list';
import { SupplierForm } from './supplier-form/supplier-form';
import { SupplierEdit } from './supplier-edit/supplier-edit';

const consignmentRoutes: Routes = [
    { path: 'suppliers', component: SupplierList },
    { path: 'suppliers/new', component: SupplierForm },
    { path: 'suppliers/:id/edit', component: SupplierEdit }
]  as Routes;

export default consignmentRoutes;
