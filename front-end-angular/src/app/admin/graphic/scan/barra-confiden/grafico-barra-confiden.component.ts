import {
  Component,
  Input,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  Chart,
  ChartConfiguration,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarController
} from 'chart.js';

import { ConfidenceStat } from '../../../../models/scan-chart-data.model';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-grafico-barra-confiden',
  standalone: true,
  templateUrl: './grafico-barra-confiden.component.html',
  styles: ``
})
export class GraficoBarraConfidenComponent {
  @Input() confidence: ConfidenceStat[] = [];

  @ViewChild('barConfidenceCanvas') barConfidenceCanvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['confidence'] && this.confidence?.length) {
      this.crearGrafico(this.confidence);
    }
  }

  ngAfterViewInit(): void {
    if (this.confidence?.length) {
      this.crearGrafico(this.confidence);
    }
  }

  crearGrafico(confidences: ConfidenceStat[]): void {
    if (!this.barConfidenceCanvas) return;
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = confidences.map(c => c.confidence);
    const data = confidences.map(c => c.total);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Cantidad por Nivel de Confianza',
            data,
            backgroundColor: ['#90caf9', '#42a5f5', '#1e88e5', '#1565c0', '#0d47a1'],
            borderRadius: 5,
            barThickness: 30
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Nivel de Confianza de Vulnerabilidades'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Nivel de Confianza'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Cantidad'
            }
          }
        }
      }
    };

    this.chart = new Chart(this.barConfidenceCanvas.nativeElement, config);
  }
}
