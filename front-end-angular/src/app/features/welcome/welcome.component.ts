import { Component } from '@angular/core';
import { LayoutComponent } from '../../admin/partials/layout.component';
import { CommonModule } from '@angular/common';
import { CustomLinkComponent } from '../../components/custom-link.component';
import {
  GridsterConfig,
  GridsterItem
} from 'angular-gridster2';
import { GridsterModule } from 'angular-gridster2';
import { SensorService } from '../../services/sensor.service';
import { first } from 'rxjs';
import { Sensor } from '../../models/sensor.model';
import { Lectura } from '../../models/lectura.model';
import { GraficoLinealTemComponent } from '../../admin/graphic/scan/lineal-tem/grafico-lineal-tem.component';
import { GraficoLinealHumComponent } from '../../admin/graphic/scan/lineal-hum/grafico-lineal-hum.component';
import { GraficoCalorComponent } from '../../admin/graphic/scan/calor/grafico-calor.component';
import { GraficoLinealAireComponent } from '../../admin/graphic/scan/lineal-aire/grafico-lineal-aire.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    LayoutComponent,
    CommonModule,
    CustomLinkComponent,
    GridsterModule,
    GraficoLinealTemComponent,
    GraficoLinealHumComponent,
    GraficoCalorComponent,
    GraficoLinealAireComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  options: GridsterConfig = {};
  dashboard: Array<GridsterItem & { type: string; value: string; data: string }> = [];
  sensors: Sensor[] = [];
  rangoSeleccionado: string = '24h';
  tipo: string | null = null;
  tiempo: string | null = null;
  constructor(
    private sensorService: SensorService,
  ) { }

  ngOnInit(): void {
    this.loadSensors();

    this.options = {
      draggable: { enabled: true },
      resizable: { enabled: true },
      pushItems: true,
      swap: true,
      minCols: 6,
      minRows: 6,
      displayGrid: 'onDrag&Resize'
    };

  }

  private loadSensors(): void {
    this.sensorService.getSensorGrafico(
      this.tipo,
      this.tiempo,
    ).pipe(first()).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.sensors = response;
          console.log(this.sensors)
        } else {
          console.error('La respuesta no contiene un array ');
        }
      },
      error: (error) => console.error('Error al obtener sensores:', error),
    });
  }



  resetFilters(): void {
    this.tipo = null;
    this.tiempo = null;
    this.loadSensors();
  }

  tipoFilter(tipo: string): void {
    this.tipo = tipo;
    this.loadSensors();
  }

  tiempoFilter(tiempo: string): void {
    this.tiempo = tiempo;
    this.loadSensors();
  }

  // welcome.component.ts
  tipoFilterFromEvent(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.tipoFilter(value);
    this.rangoSeleccionado = value;
  }

  tiempoFilterFromEvent(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.tiempoFilter(value);
  }



  get sensoresTemp(): Sensor[] {
    return this.sensors
      .filter(sensor =>
        sensor.tipo === 'TempHum' &&
        sensor.lectura &&
        sensor.lectura.length > 0 &&
        sensor.lectura[sensor.lectura.length - 1].valor1 !== undefined &&
        sensor.lectura[sensor.lectura.length - 1].valor1 !== null
      );
  }


  get sensoresCalor(): Sensor[] {
    return this.sensors
      .filter(sensor =>
        sensor.tipo === 'Gases' &&
        sensor.lectura &&
        sensor.lectura.length > 0 &&
        sensor.lectura[sensor.lectura.length - 1].valor1 !== undefined &&
        sensor.lectura[sensor.lectura.length - 1].valor1 !== null
      );
  }

  
  get sensoresCO(): Sensor[] {
    return this.sensors
      .filter(sensor =>
        sensor.tipo === 'CO' &&
        sensor.lectura &&
        sensor.lectura.length > 0 &&
        sensor.lectura[sensor.lectura.length - 1].valor1 !== undefined &&
        sensor.lectura[sensor.lectura.length - 1].valor1 !== null
      );
  }


  get sensoresHum(): Sensor[] {
    return this.sensors
      .filter(sensor =>
        sensor.tipo === 'TempHum' &&
        sensor.lectura &&
        sensor.lectura.length > 0 &&
        sensor.lectura[sensor.lectura.length - 1].valor2 !== undefined &&
        sensor.lectura[sensor.lectura.length - 1].valor2 !== null
      );
  }

  getUltimaLectura(sensor: Sensor): Lectura | null {
    if (!sensor.lectura || sensor.lectura.length === 0) return null;

    // Asumimos que todas las lecturas tienen fecha válida
    return [...sensor.lectura].sort((a, b) =>
      new Date(b.fecha!).getTime() - new Date(a.fecha!).getTime()
    )[0];
  }
}
