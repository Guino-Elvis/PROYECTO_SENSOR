import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import {
  Chart,
  ChartConfiguration,
  Tooltip,
  Legend,
  LinearScale,
  Title,
  CategoryScale
} from 'chart.js';

import 'chartjs-chart-matrix';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

import { Sensor } from '../../../../models/sensor.model';

Chart.register(
  MatrixController,
  MatrixElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

@Component({
  selector: 'app-grafico-calor',
  standalone: true,
  templateUrl: './grafico-calor.component.html',
  styles: []
})
export class GraficoCalorComponent implements AfterViewInit {
  @Input() calor!: Sensor;
  @Input() rangoTiempo: string = '24h';
  @ViewChild('lineCanvas', { static: false }) lineCanvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.calor?.lectura?.length) {
        this.crearGrafico(this.calor);
      }
    }, 0);
  }

  crearGrafico(sensor: Sensor): void {
    if (!this.lineCanvas?.nativeElement) return;
    if (this.chart) this.chart.destroy();

    const ahora = new Date();
    const limite = this.calcularLimiteFecha(this.rangoTiempo, ahora);

    const lecturas = (sensor.lectura ?? []).filter(l =>
      l.valor1 != null &&
      l.fecha &&
      new Date(l.fecha) >= limite
    );

    const data = lecturas.map(l => {
      const fecha = new Date(l.fecha!);
      return {
        x: fecha.getHours(),
        y: fecha.getDate(),
        v: Number(l.valor1)
      };
    });

    const config: ChartConfiguration<'matrix'> = {
      type: 'matrix',
      data: {
        datasets: [{
          label: 'Concentración de gases (ppm)',
          data,
          backgroundColor(ctx) {
            const { v } = ctx.raw as { v: number };
            if (v < 100) return '#4caf50';
            if (v < 200) return '#ffeb3b';
            if (v < 300) return '#ff9800';
            return '#f44336';
          },
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          width: ({ chart }) => (chart.width / 24) - 2, // Ancho dinámico basado en horas
          height: ({ chart }) => (chart.height / 31) - 2, // Alto dinámico basado en días
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                return [
                  { text: 'Seguro (<100)', fillStyle: '#4caf50' },
                  { text: 'Precaución (100-199)', fillStyle: '#ffeb3b' },
                  { text: 'Peligro moderado (200-299)', fillStyle: '#ff9800' },
                  { text: 'Peligro alto (≥300)', fillStyle: '#f44336' }
                ];
              }
            }
          },
          tooltip: {
            callbacks: {
              title: () => '',
              label: (ctx) => {
                const d = ctx.raw as { x: number; y: number; v: number };
                return [
                  `Día: ${d.y} del mes`,
                  `Hora: ${d.x}:00 - ${d.x + 1}:00`,
                  `Concentración: ${d.v} ppm`,
                  `Nivel: ${this.getNivelRiesgo(d.v)}`
                ];
              }
            }
          },
          title: {
            display: true,
            text: `Mapa de Calor - Concentración de Gases (Últimas ${this.rangoTiempo})`,
            font: { size: 16 }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 23,
            title: { display: true, text: 'Hora del día (0-23)' },
            ticks: {
              stepSize: 1,
              callback: (value) => `${value}h`
            },
            grid: { display: false }
          },
          y: {
            type: 'linear',
            reverse: true, // Para que el día 1 aparezca arriba
            title: { display: true, text: 'Día del mes' },
            ticks: { stepSize: 1 },
            grid: { display: false }
          }
        }
      }
    };

    this.chart = new Chart(this.lineCanvas.nativeElement, config);
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

  private getNivelRiesgo(valor: number): string {
    if (valor < 100) return 'Seguro';
    if (valor < 200) return 'Precaución';
    if (valor < 300) return 'Peligro moderado';
    return 'Peligro alto';
  }
}
