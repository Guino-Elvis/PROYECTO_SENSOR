import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import {
  Chart,
  ChartConfiguration,
  ChartType,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,    // <--- agregar
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Sensor } from '../models/sensor.model';

// Registrar los componentes necesarios de Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,    // <--- agregar
  LineElement,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-sensor-grafico',
  standalone: true,
  templateUrl: './sensor-grafico.component.html',
  styleUrls: ['./sensor-grafico.component.css'],
})
export class SensorGraficoComponent implements OnChanges, AfterViewInit {
  @Input() sensor!: Sensor;

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensor'] && this.sensor) {
      this.crearGrafico();
    }
  }

  ngAfterViewInit(): void {
    if (this.sensor) {
      this.crearGrafico();
    }
  }

  crearGrafico() {
    if (!this.canvas) return;
    if (this.chart) {
      this.chart.destroy();
    }

    const lecturas = this.sensor.lectura || [];
    if (lecturas.length === 0) return;

    const minutos = 1
    const intervaloMuestreo = minutos * 60 * 1000; // 10 minutos en milisegundos

    // Primero, ordenar lecturas por fecha (por si acaso)
    const lecturasOrdenadas = lecturas.slice().sort((a, b) => {
      return (new Date(a.fecha!).getTime()) - (new Date(b.fecha!).getTime());
    });

    // Variables para agrupar datos
    let bloques: { fecha: Date, valores1: number[], valores2: number[] }[] = [];

    for (const lectura of lecturasOrdenadas) {
      const fecha = new Date(lectura.fecha!);
      // Verificar si existe bloque al que pertenezca esta fecha
      let bloque = bloques.find(b => Math.abs(fecha.getTime() - b.fecha.getTime()) < intervaloMuestreo);
      if (!bloque) {
        // Crear nuevo bloque
        bloque = { fecha, valores1: [], valores2: [] };
        bloques.push(bloque);
      }
      // Agregar valores a bloque
      bloque.valores1.push(Number(lectura.valor1) || 0);
      if (lectura.valor2 !== null && lectura.valor2 !== undefined) {
        bloque.valores2.push(lectura.valor2);
      }
    }

    // Calcular promedios para cada bloque
    const labels = bloques.map(b => b.fecha.toLocaleString());

    // Helper para promedio
    const promedio = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const dataValor1 = bloques.map(b => promedio(b.valores1));
    const dataValor2 = bloques.map(b => promedio(b.valores2));

    let datasets = [];

    if (this.sensor.tipo === 'DHT11') {
      datasets = [
        {
          label: `${this.sensor.nombre || 'Sensor'} - Valor 1 (Promedio cada ${minutos} min)`,
          data: dataValor1,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
          fill: true,
          tension: 0.4,
        },
        {
          label: `${this.sensor.nombre || 'Sensor'} - Valor 2 (Promedio cada ${minutos} min)`,
          data: dataValor2,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 255, 123, 0.3)',
          fill: true,
          tension: 0.4,
        }
      ];
    } else {
      datasets = [
        {
          label: `${this.sensor.nombre || 'Sensor'} (Promedio cada ${minutos} min)`,
          data: dataValor1,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
          fill: true,
          tension: 0.4,
        }
      ];
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
            display: true,
            title: { display: true, text: 'Fecha' }
          },
          y: {
            display: true,
            title: { display: true, text: 'Valor' }
          }
        }
      }
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
  }
}
