import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmnetFormComponent } from './consignment-form.component';

describe('ConsignmnetFormComponent', () => {
  let component: ConsignmnetFormComponent;
  let fixture: ComponentFixture<ConsignmnetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsignmnetFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsignmnetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
