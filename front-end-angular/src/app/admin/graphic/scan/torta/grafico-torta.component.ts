import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { Chart, ChartConfiguration, ArcElement, Tooltip, Legend, Title, PieController } from 'chart.js';
import { RiskStat } from '../../../../models/scan-chart-data.model';
import { Scan } from '../../../../models/scan.model';

Chart.register(ArcElement, Tooltip, Legend, Title, PieController);

@Component({
  selector: 'app-grafico-torta',
  standalone: true,
  templateUrl: './grafico-torta.component.html',
  styles: ``,
})
export class GraficoTortaComponent implements OnChanges, AfterViewInit {
  @Input() scan!: Scan;

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scan'] && this.scan?.chartData?.risks) {
      this.crearGrafico(this.scan.chartData.risks);
    }
  }

  ngAfterViewInit(): void {
    if (this.scan?.chartData?.risks) {
      this.crearGrafico(this.scan.chartData.risks);
    }
  }

  crearGrafico(risks: RiskStat[]): void {
    if (!this.pieCanvas) return;
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = risks.map(r => r.risk);
    const data = risks.map(r => r.total);

    const backgroundColors = [
      '#4CAF50', '#2196F3', '#FFC107',
      '#FF5722', '#9C27B0', '#607D8B'
    ];

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: 'Vulnerabilidades por Riesgo',
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Nivel de Riesgo'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    };

    this.chart = new Chart(this.pieCanvas.nativeElement, config);
  }
}
