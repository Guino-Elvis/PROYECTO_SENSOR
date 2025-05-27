import { Component } from '@angular/core';
import { LayoutComponent } from '../../admin/partials/layout.component';
import { SensorService } from '../../services/sensor.service';
import { first } from 'rxjs';
import { Sensor } from '../../models/sensor.model';
import { CommonModule } from '@angular/common';
import { CustomLinkComponent } from '../../components/custom-link.component';
import { SensorGraficoComponent } from '../../graficos/sensor-grafico.component';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [LayoutComponent, CommonModule, CustomLinkComponent, SensorGraficoComponent], // agregar componente gráfico
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  sensors: Sensor[] = [];

  constructor(private sensorService: SensorService) {}

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors(): void {
    this.sensorService.getSensorGrafico().pipe(first()).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.sensors = response;
        } else {
          console.error('La respuesta no contiene un array de Sensors');
        }
      },
      error: (error) => console.error('Error al obtener Sensors:', error),
    });
  }
}
