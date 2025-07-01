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
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler
} from 'chart.js';
import { Sensor } from '../../../../models/sensor.model';

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineController,
  Filler
);
@Component({
  selector: 'app-grafico-lineal-hum',
  standalone: true,
  templateUrl: './grafico-lineal-hum.component.html',
  styles: []
})
export class GraficoLinealHumComponent {
  @Input() humedad!: Sensor;
  @Input() rangoTiempo: string = '24h';
  @ViewChild('lineCanvas', { static: false }) lineCanvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['humedad'] || changes['rangoTiempo']) && this.humedad?.lectura?.length) {
      this.crearGrafico(this.humedad);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.humedad?.lectura?.length) {
        this.crearGrafico(this.humedad);
      }
    }, 0);
  }

  crearGrafico(sensor: Sensor): void {
    if (!this.lineCanvas?.nativeElement) return;
    if (this.chart) this.chart.destroy();

    const ahora = new Date();
    const limite = this.calcularLimiteFecha(this.rangoTiempo, ahora);

    const lecturas = (sensor.lectura ?? []).filter(l =>
      l.valor2 != null &&
      l.fecha &&
      new Date(l.fecha) >= limite
    );

    const labels = lecturas.map(l => this.formatearFecha(l.fecha ?? ''));
    const data = lecturas.map(l => Number(l.valor2));

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Humedad (%)',
          data,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false
          },
          tooltip: {
            mode: 'nearest',
            intersect: false,
            callbacks: {
              label: (context) => {
                const temp = context.parsed.y.toFixed(1);
                const fecha = labels[context.dataIndex];
                return `${fecha} - ${temp}%`;
              }
            }
          }
        },
        scales: {
          x: {
            display: false // 👈 Oculta las fechas del eje X
          },
          y: {
            title: {
              display: true,
              text: 'Humedad (%)',
              color: '#666',
              font: {
                size: 12
              }
            },
            ticks: {
              color: '#666'
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.2)'
            }
          }
        }
      }
    };

    this.chart = new Chart(this.lineCanvas.nativeElement, config);
  }

  private formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minuto = fecha.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes} ${hora}:${minuto}`;
  }

  private calcularLimiteFecha(rango: string, ahora: Date): Date {
    const fechaLimite = new Date(ahora);
    switch (rango) {
      case '60m': fechaLimite.setMinutes(fechaLimite.getMinutes() - 60); break;
      case '6h': fechaLimite.setHours(fechaLimite.getHours() - 6); break;
      case '12h': fechaLimite.setHours(fechaLimite.getHours() - 12); break;
      case '24h': fechaLimite.setHours(fechaLimite.getHours() - 24); break;
      case '7d': fechaLimite.setDate(fechaLimite.getDate() - 7); break;
      case '30d': fechaLimite.setDate(fechaLimite.getDate() - 30); break;
    }
    return fechaLimite;
  }
}
