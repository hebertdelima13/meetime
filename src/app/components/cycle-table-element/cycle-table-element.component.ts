import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { EventsStoreService } from '../../shared/services/events-store.service';

@Component({
  selector: 'cycle-table-element',
  imports: [CommonModule, MatIconModule, MatListModule, MatCheckboxModule],
  templateUrl: './cycle-table-element.component.html',
  styleUrl: './cycle-table-element.component.scss',
})
export class CycleTableElementComponent implements OnInit {
  name = input<string>();
  isBold = input<boolean>(false);
  priority = input<'HIGH' | 'MEDIUM' | 'LOW'>();
  checked = input<boolean>();
  showCheckbox = input<boolean>(true);
  store = inject(EventsStoreService);
  selecionados = this.store.selectedCycles;
  isDisabled = input<boolean>();
  iconName: string = 'arrow_upward';
  checkedChange = output<string>();

  ngOnInit(): void {
    this.changeIcon();
  }

  toggleCycle(name: string) {
    this.store.toggleCycleSelection(name);
  }

  isChecked(name: string): boolean {
    return this.selecionados().has(name);
  }

  changeIcon() {
    this.iconName = this.isDisabled() ? 'arrow_downward' : 'arrow_upward';
    return this.iconName;
  }

  getPriorityClass(priority: string | undefined): string {
    if (this.isDisabled()) return 'priority-disabled';
    switch (priority) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return '';
    }
  }
}
