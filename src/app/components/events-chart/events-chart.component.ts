import { Component, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsCoreOption } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EventsStoreService } from '../../shared/services/events-store.service';
import { getNextBusinessDays, UsefulDay } from '../../shared/utils/getDate.util';
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);

@Component({
  selector: 'events-chart',
  imports: [CommonModule, MatCardModule, NgxEchartsDirective],
  templateUrl: './events-chart.component.html',
  styleUrl: './events-chart.component.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class EventsChartComponent {
  private store = inject(EventsStoreService);

  // Lista de dias úteis (considerando dia atual como 1, mockado por enquanto)
  businessDays: UsefulDay[] = getNextBusinessDays();

  chartOptions = signal<EChartsCoreOption>(this.getChartOptions());
  chartBaseOptions = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: 40,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: 0,
      itemWidth: 13,
      itemHeight: 13,
    },
    xAxis: {},
    yAxis: {
      type: 'value',
      name: 'Quantidade de Eventos',
      nameLocation: 'middle',
      nameGap: 38,
      axisLabel: {
        interval: 'auto',
      },
      splitNumber: 5,
      minInterval: 50,
    },
    series: [],
  };

  constructor() {
    effect(() => {
      this.chartOptions.set(this.getChartOptions());
    });
  }

  getChartOptions() {
    const eventsProjection = this.store.eventsProjection();
    const entities = this.store.entities();
    const cyclesWithEventsToday = this.store.cyclesWithEventsToday();
    const selectedCycles = this.store.selectedCycles();
    const days = this.businessDays;
    const accumulated: Record<number, any> = {};

    // Inicializa com os eventos existentes
    for (const day of days) {
      const existing = eventsProjection.find(p => p.day === day.number);
      accumulated[day.number] = {
        meetings: existing?.events.meetings || 0,
        emails: existing?.events.emails || 0,
        calls: existing?.events.calls || 0,
        follows: existing?.events.follows || 0,
      };
    }

    // 🔐 Retorno antecipado: se nenhum ciclo está selecionado, usa apenas os dados do projection
    if (!selectedCycles || selectedCycles.size === 0) {
      return {
        ...this.chartBaseOptions,
        xAxis: {
          type: 'category',
          data: this.businessDays.map(d => d.name),
          axisLine: { show: true },
          axisTick: { show: true },
          splitLine: { show: false },
        },
        series: [
          {
            name: 'Meetings',
            type: 'bar',
            stack: 'total',
            data: days.map(d => accumulated[d.number].meetings),
          },
          {
            name: 'Emails',
            type: 'bar',
            stack: 'total',
            data: days.map(d => accumulated[d.number].emails),
          },
          {
            name: 'Calls',
            type: 'bar',
            stack: 'total',
            data: days.map(d => accumulated[d.number].calls),
          },
          {
            name: 'Follows',
            type: 'bar',
            stack: 'total',
            data: days.map(d => accumulated[d.number].follows),
          },
        ],
      };
    }

    let remainingEntities = entities;

    for (const priority of this.store.priorityOrder) {
      const cyclesByPriority = cyclesWithEventsToday.filter(c => !c.disabled && selectedCycles.has(c.cycle.name) && c.cycle.priority === priority).map(c => c.cycle);

      for (const cycle of cyclesByPriority) {
        if (remainingEntities <= 0) break;

        const use = Math.min(cycle.availableEntities, remainingEntities);
        for (const structure of cycle.structure) {
          if (!days.some(d => d.number === structure.day)) continue;

          accumulated[structure.day].meetings += structure.meetings * use;
          accumulated[structure.day].emails += structure.emails * use;
          accumulated[structure.day].calls += structure.calls * use;
          accumulated[structure.day].follows += structure.follows * use;
        }

        remainingEntities -= use;
      }

      if (remainingEntities <= 0) break;
    }

    return {
      ...this.chartBaseOptions,
      xAxis: {
        type: 'category',
        data: this.businessDays.map(d => d.name),
        axisLine: { show: true },
        axisTick: { show: true },
        splitLine: { show: false },
      },
      series: [
        {
          name: 'Meetings',
          type: 'bar',
          stack: 'total',
          data: days.map(d => accumulated[d.number].meetings),
        },
        {
          name: 'Emails',
          type: 'bar',
          stack: 'total',
          data: days.map(d => accumulated[d.number].emails),
        },
        {
          name: 'Calls',
          type: 'bar',
          stack: 'total',
          data: days.map(d => accumulated[d.number].calls),
        },
        {
          name: 'Follows',
          type: 'bar',
          stack: 'total',
          data: days.map(d => accumulated[d.number].follows),
        },
      ],
    };
  }
}
