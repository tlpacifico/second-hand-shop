import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { combineLatest, map, Observable } from 'rxjs';
import { CreateConsignmentModel, ConsignmentService, ConsignmentSupplierModel } from '../../consignment-data.services';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-consignmnet-form',
    standalone: true,
    imports: [CommonModule, ButtonModule, ReactiveFormsModule, CalendarModule, DropdownModule],
    templateUrl: './consignment-form.component.html',
    styleUrl: './consignment-form.component.scss'
})
export class ConsignmnetFormComponent {

    public consignmentForm: FormGroup<ConsignmnetFormControlModel>;

    public vm$: Observable<{
        suppliers: ConsignmentSupplierModel[];
    }>;

    constructor(private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private consignmnetService: ConsignmentService
    ) {

        this.consignmentForm = this.fb.group<ConsignmnetFormControlModel>({
            supplierId: new FormControl<number | null>({ value: null, disabled: true }, Validators.required),
            consignmentDate: new FormControl<Date | null>(null, Validators.required),
            pickupDate: new FormControl<Date | null>(null, Validators.required),
            items: this.fb.array<FormGroup<{
            name: FormControl<string | null>,
            description: FormControl<string | null>,
            price: FormControl<number | null>
            }>>([])
        });

        this.vm$ = combineLatest([
            this.activatedRoute.params.pipe(
                map(params => params['id']),
            ),
            this.consignmnetService.getSuppliers()
        ]).pipe(
            map(([
                supplierId,
                suppliers
            ]) => {

                this.consignmentForm.patchValue({
                    supplierId: Number(supplierId),
                })
                return {
                    suppliers
                }
            }));

    }

    get items(): FormArray {
        return this.consignmentForm.get('items') as FormArray;
    }

    addItem(): void {
        this.items.push(this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', Validators.required]
        }));
    }

    onSubmit(): void {
        if (this.consignmentForm.invalid) {
            return;
        }

        const consignment = this.consignmentForm.getRawValue() as CreateConsignmentModel;
        this.consignmnetService.create(consignment).subscribe(data => {
            this.back();
        })
    }

    public back(): void {
        window.history.back();
    }
}


export interface ConsignmnetFormControlModel {
    supplierId: FormControl<number | null>;
    consignmentDate: FormControl<Date | null>;
    pickupDate: FormControl<Date | null>;
    items: FormArray<FormGroup<{
        name: FormControl<string | null>,
        description: FormControl<string | null>,
        price: FormControl<number | null>
    }>>;
  }
