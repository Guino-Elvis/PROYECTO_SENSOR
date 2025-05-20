import { Component, ViewChild } from '@angular/core';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { ICONS } from '../../../core/icons';
import { Sensor } from '../../../models/sensor.model';
import { SensorService } from '../../../services/sensor.service';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../partials/layout.component';
import { CustomLinkComponent } from '../../../components/custom-link.component';
import { SensorFormComponent } from '../../form/sensor/sensor-form.component';
import { ModalFormComponent } from '../../../components/modal/modal-form.component';
import { ReusableButtonComponent } from '../../../components/reusable-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItemUpdatedAtComponent } from '../../../components/table/item-updated-at.component';
import { PaginationComponent } from '../../../components/table/pagination/pagination.component';
import { NoItemPageComponent } from '../../../components/no-item-page.component';
import { AdminOnlyComponent } from '../../../components/admin-only.component';
import { SensorlecturaComponent } from '../sensorlectura/sensorlectura.component';

@Component({
  selector: 'app-sensor',
  imports: [
    FormsModule,
    CommonModule,
    LayoutComponent,
    CustomLinkComponent,
    SensorFormComponent,
    ModalFormComponent,
    CustomDatepickerComponent,
    ReusableButtonComponent,
    FontAwesomeModule,
    ItemUpdatedAtComponent,
    PaginationComponent,
    NoItemPageComponent,
    SensorlecturaComponent,
    AdminOnlyComponent
  ],
  templateUrl: './sensor.component.html',
  styles: ``
})
export class SensorComponent {
  @ViewChild(CustomDatepickerComponent) datepicker!: CustomDatepickerComponent;
  icons = ICONS;
  sensors: Sensor[] = [];
  searchText: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  perPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  sensorForm: Sensor = { id: 0, nombre: '', tipo: '', estado: '1', updated_at: null, created_at: null };
  editMode: boolean = false;
  editId: number | null = null;
  modalOpen: boolean = false;
  comprimirItems: boolean = false;
  idSensorSeleccionada: number | null = null;
  constructor(
    private sensorService: SensorService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSensors();
  }

  loadSensors(): void {
    this.sensorService.getSensors(
      this.searchText,
      this.startDate,
      this.endDate,
      this.sortOrder,
      this.perPage,
      this.currentPage

    ).pipe(first()).subscribe({
      next: (response) => {
        if (Array.isArray(response.data)) {
          this.sensors = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(this.totalItems / this.perPage);
        } else {
          console.error('La respuesta no contiene un array de Sensors');
        }
      },
      error: (error) => console.error('Error al obtener Sensors:', error),
    });
  }

  filterSensors(): void {
    if (this.searchText.trim().length < 3) {
      return;
    }
    this.loadSensors();
  }
  updateDates(dates: { startDate: string | null; endDate: string | null }) {
    this.startDate = dates.startDate;
    this.endDate = dates.endDate;
    this.loadSensors();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadSensors();
  }

  resetFilters(): void {
    this.searchText = '';
    this.startDate = null;
    this.endDate = null;
    this.sortOrder = 'desc';
    this.perPage = 8;
    this.currentPage = 1;
    this.datepicker.reset();
    this.loadSensors();
  }

  hasActiveFilters(): boolean {
    return this.searchText.trim().length > 0;
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSensors();
    }
  }
  updateItemsPerPage(perPage: number): void {
    this.perPage = perPage;
    this.loadSensors();
  }


  createSensor(): void {
    this.editMode = false;
    this.sensorForm = { id: 0, nombre: '', tipo: '', estado: '1', updated_at: null, created_at: null };
    this.modalOpen = true;
  }


  editSensor(sensor: Sensor): void {
    if (sensor.id !== undefined) {
      this.editMode = true;
      this.editId = sensor.id;
      this.sensorForm = { ...sensor };
      this.modalOpen = true; // Abre el modal al editar
    } else {
      console.error('Error: La categoría seleccionada no tiene un ID válido.');
    }
  }

  saveSensor(sensorData: Sensor): void {
    if (this.editMode && this.editId !== null) {
      // Modo edición
      this.sensorService.updateSensor(this.editId, sensorData).pipe(first()).subscribe({
        next: () => {
          this.loadSensors();
          this.closeModal();
          this.alertService.showSuccess('Categoría actualizada correctamente');
        },
        error: () => {
          this.alertService.showError('Error al actualizar categoría');
        },
      });
    } else {
      // Modo creación
      this.sensorService.createSensor(sensorData).pipe(first()).subscribe({
        next: () => {
          this.loadSensors();
          this.closeModal();
          this.alertService.showSuccess('Categoría creada correctamente');
        },
        error: () => {
          this.alertService.showError('Error al crear categoría');
        },
      });
    }
  }

  deleteSensor(id: number): void {
    this.alertService.confirmDelete().then((confirmed: boolean) => {
      if (confirmed) {
        this.sensorService.deleteSensor(id).pipe(first()).subscribe({
          next: () => {
            this.alertService.showSuccess('Categoría eliminada correctamente');
            this.sensors = this.sensors.filter(cat => cat.id !== id);
          },
          error: () => {
            this.alertService.showError('Hubo un error al eliminar');
          },
        });
      }
    });
  }

  closeModal(): void {
    this.modalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.sensorForm = { id: 0, nombre: '', tipo: '', estado: '1', updated_at: null, created_at: null };
    this.editMode = false;
    this.editId = null;
  }

  detalleSensor(id: number): void {
    this.idSensorSeleccionada = id;
    this.comprimirItems = true;
    console.info('paso a true');
  }
}
