import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTableElementComponent } from './cycle-table-element.component';

describe('CycleTableElementComponent', () => {
  let component: CycleTableElementComponent;
  let fixture: ComponentFixture<CycleTableElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleTableElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CycleTableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
