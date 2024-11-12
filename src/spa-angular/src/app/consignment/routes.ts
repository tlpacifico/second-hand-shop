import { Route } from "@angular/router";
import { SupplierListComponent } from "./supplier/supplier-list/supplier-list.component";

export const CONSIGNMENT_ROUTES: Route[] = [
  {
    path:'',
    pathMatch: 'prefix',
    providers:[],
    children: [
        {
          path: 'suppliers', data: { breadcrumb: 'Clientes' },
          loadChildren: () => import('./supplier/routes').then(mod => mod.ROUTES)
        }
      ]
  }
] ;
