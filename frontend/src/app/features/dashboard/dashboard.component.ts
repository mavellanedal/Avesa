import { Component, inject, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';
import { WelcomeLeadFilter } from '@models/welcome/welcome-lead-filter';
import { WelcomeService } from '@services/welcome/welcome.service';
import { LeadTrackingService } from '@services/lead-tracking/lead-tracking.service';
import { Util } from '@shared/utility/util';
import { firstValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-dashboard',
  imports: [
    TranslocoPipe,
    MatTabsModule,
    MatIconModule,
  ],
  providers: [provideTranslocoScope('welcome')],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export default class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef<HTMLDivElement>;

  private readonly welcomeSvc = inject(WelcomeService);
  private readonly leadTrackingSvc = inject(LeadTrackingService);
  private readonly fb = inject(FormBuilder);

  private chartInstance: echarts.ECharts | null = null;

  public welcomeLeadFilterForm!: FormGroup;
  public welcomeLeads: any;

  ngOnInit(): void {
    this.initWelcomeLeadFilter();
    this.onSearch();
  }

  ngAfterViewInit(): void {
    this.chartInstance = echarts.init(this.chartContainer.nativeElement);
    this.loadChartData();
  }

  ngOnDestroy(): void {
    this.chartInstance?.dispose();
  }

  public initWelcomeLeadFilter(): void {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    this.welcomeLeadFilterForm = this.fb.group({
      startDate: [startDate],
      endDate: [endDate],
    });
  }

  public onSearch() {
    if (this.welcomeLeadFilterForm.invalid) return;

    const filter = new WelcomeLeadFilter();
    filter.startDate = Util.valueOrNull(this.welcomeLeadFilterForm.get('startDate')?.value);
    filter.endDate = Util.valueOrNull(this.welcomeLeadFilterForm.get('endDate')?.value);

    this.getWelcomeLeads(filter);
  }

  getWelcomeLeads(filter: WelcomeLeadFilter) {
    firstValueFrom(this.welcomeSvc.getWelcomwLead(filter)).then(data => {
      this.welcomeLeads = data;
    });
  }

  public getInitials(name?: string, surname?: string): string {
    const n = name ? name.charAt(0).toUpperCase() : '';
    const s = surname ? surname.charAt(0).toUpperCase() : '';
    return (n + s) || 'U';
  }

  private loadChartData(): void {
    firstValueFrom(this.leadTrackingSvc.getLeadsLastMonthByDay()).then(data => {
      if (!this.chartInstance) return;

      const dates = data.map(p => p.date);
      const counts = data.map(p => p.count);

      this.chartInstance.setOption({
        grid: { top: 16, right: 16, bottom: 48, left: 44 },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any[]) => `${params[0].name}<br/>${params[0].value} leads`,
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: { fontSize: 11, rotate: 30, color: '#6B7280' },
          axisLine: { lineStyle: { color: '#E5E7EB' } },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisLabel: { fontSize: 11, color: '#6B7280' },
          splitLine: { lineStyle: { color: '#F3F4F6' } },
        },
        series: [{
          data: counts,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#1a3a5c', width: 2 },
          itemStyle: { color: '#1a3a5c' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(26,58,92,0.15)' },
              { offset: 1, color: 'rgba(26,58,92,0)' },
            ]),
          },
        }],
      });
    });
  }
}
