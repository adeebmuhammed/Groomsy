import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle = '';

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
  };

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [],
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.pieChartOptions.plugins!.title!.text = this.chartTitle;

    this.pieChartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: this.chartData,
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e',
            '#e74a3b',
            '#858796',
            '#5a5c69',
          ],
        },
      ],
    };
  }
}
