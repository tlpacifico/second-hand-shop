import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsignmentSupplierResponse } from '../consignment-data.services';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-supplier-form',
    standalone: true,
    imports: [CommonModule, ButtonModule, ReactiveFormsModule   ],
    templateUrl: './supplier-form.component.html',
    styleUrl: './supplier-form.component.scss'
})
export class SupplierFormComponent {
    public vm$: Observable<{
        supplier: ConsignmentSupplierResponse;
    }>;
    public form: FormGroup<SupplierFormControlModel>;

    constructor(
        private formGroup: FormBuilder
    ) {
        this.form =  this.formGroup.group<SupplierFormControlModel>({
            name: new FormControl<string | null>(null, [Validators.required]),
            phoneNumber: new FormControl<string | null>(null, [Validators.required]),
            email: new FormControl<string | null>(null, [Validators.required]),
            address: new FormControl<string | null>(null),
        });
    }

    public submit(): void {
        if (this.form.valid) {
          return;
        }

    }

    public back(): void {
        window.history.back();
      }

}



export interface SupplierFormControlModel {
    name: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    email: FormControl<string | null>;
    address: FormControl<string | null>;
  }
