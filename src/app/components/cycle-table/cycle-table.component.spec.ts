import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTableComponent } from './cycle-table.component';

describe('CycleTableComponent', () => {
  let component: CycleTableComponent;
  let fixture: ComponentFixture<CycleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CycleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
