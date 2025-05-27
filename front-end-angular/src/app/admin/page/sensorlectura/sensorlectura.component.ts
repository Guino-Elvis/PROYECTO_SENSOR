import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoItemPageComponent } from '../../../components/no-item-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminOnlyComponent } from '../../../components/admin-only.component';
import { Sensor } from '../../../models/sensor.model';
import { ICONS } from '../../../core/icons';
import { SensorService } from '../../../services/sensor.service';
import { AlertService } from '../../../services/alert.service';
import { ItemUpdatedAtComponent } from '../../../components/table/item-updated-at.component';

@Component({
  selector: 'app-sensorlectura',
  standalone: true,
  imports: [NoItemPageComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ItemUpdatedAtComponent
  ],
  templateUrl: './sensorlectura.component.html',
  styles: ``
})
export class SensorlecturaComponent {


  @Input() sensorId!: number;
  sensor: Sensor | null = null;
  loading: boolean = true;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();
  icons = ICONS;
  isLoading: boolean = false;
  modalOpen: boolean = false;

  constructor(
    private sensorService: SensorService,
    private alertService: AlertService,

  ) {

  }

  ngOnInit(): void {
    if (this.sensorId) {
      this.loadSensor(this.sensorId);
    }
  }

  ngOnChanges(): void {
    if (this.sensorId) {
      this.loadSensor(this.sensorId);
    }
  }

  private loadSensor(id: number): void {
    this.loading = true;
    this.sensorService.getSensor(id).subscribe({
      next: (data) => {
        this.sensor = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cargar la sensor', err);
      }
    });
  }

  get valor1Header(): string {
    if (this.sensor?.nombre === "DHT11" && this.sensor?.tipo === "TempHum") {
      return "TEM";
    } else if (this.sensor?.tipo === "Gases" || this.sensor?.tipo === "CO") {
      return this.sensor.tipo;
    }
    return "Valor 1"; // default fallback
  }

  get showValor2Column(): boolean {
    // Mostrar solo si es DHT11 TempHum, que tiene valor 2, de lo contrario no
    return this.sensor?.nombre === "DHT11" && this.sensor?.tipo === "TempHum";
  }

  get valor2Header(): string {
    if (this.showValor2Column) {
      return "HUM";
    }
    return "";
  }

  isTempHum(): boolean {
    return this.sensor?.nombre === "DHT11" && this.sensor?.tipo === "TempHum";
  }

  getValor1Suffix(): string {
    if (this.isTempHum()) {
      return "°C";
    } else if (this.sensor?.tipo) {
      return this.sensor.tipo; // "Gases", "CO", etc.
    }
    return "";
  }

  getValor2Suffix(): string {
    if (this.isTempHum()) {
      return "%";
    }
    return "";
  }

  cerrarDetalle(): void {
    this.onClose.emit();
  }
}
