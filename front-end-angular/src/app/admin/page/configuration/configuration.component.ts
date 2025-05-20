import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../partials/layout.component';
import { CustomLinkComponent } from '../../../components/custom-link.component';
import { ModalFormComponent } from '../../../components/modal/modal-form.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { ReusableButtonComponent } from '../../../components/reusable-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItemUpdatedAtComponent } from '../../../components/table/item-updated-at.component';
import { PaginationComponent } from '../../../components/table/pagination/pagination.component';
import { NoItemPageComponent } from '../../../components/no-item-page.component';
import { ICONS } from '../../../core/icons';
import { AlertService } from '../../../services/alert.service';
import { Router } from '@angular/router';
import { ConfigurationService } from '../../../services/configuration.service';
import { first } from 'rxjs';
import { Configuration } from '../../../models/configuration.model';
import { ConfigurationFormComponent } from '../../form/configuration/configuration-form.component';
import { AdminOnlyComponent } from '../../../components/admin-only.component';

@Component({
  selector: 'app-configuration',
  imports: [
    FormsModule,
    CommonModule,
    LayoutComponent,
    CustomLinkComponent,
    ModalFormComponent,
    ConfigurationFormComponent,
    CustomDatepickerComponent,
    ReusableButtonComponent,
    FontAwesomeModule,
    ItemUpdatedAtComponent,
    PaginationComponent,
    NoItemPageComponent,
    AdminOnlyComponent
  ],
  templateUrl: './configuration.component.html',
  styles: ``
})
export class ConfigurationComponent {
  @ViewChild(CustomDatepickerComponent) datepicker!: CustomDatepickerComponent;
  icons = ICONS;
  configurations: Configuration[] = [];
  searchText: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  perPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  configurationForm: Configuration = { id: 0, nombre_config: '', valor: '', updated_at: null, created_at: null };
  editMode: boolean = false;
  editId: number | null = null;
  modalOpen: boolean = false;
  constructor(
    private configurationService: ConfigurationService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations(): void {
    this.configurationService.getConfigurations(
      this.searchText,
      this.startDate,
      this.endDate,
      this.sortOrder,
      this.perPage,
      this.currentPage

    ).pipe(first()).subscribe({
      next: (response) => {
        if (Array.isArray(response.data)) {
          this.configurations = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(this.totalItems / this.perPage);
        } else {
          console.error('La respuesta no contiene un array de Configurations');
        }
      },
      error: (error) => console.error('Error al obtener Configurations:', error),
    });
  }

  filterConfigurations(): void {
    if (this.searchText.trim().length < 3) {
      return;
    }
    this.loadConfigurations();
  }
  updateDates(dates: { startDate: string | null; endDate: string | null }) {
    this.startDate = dates.startDate;
    this.endDate = dates.endDate;
    this.loadConfigurations();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadConfigurations();
  }

  resetFilters(): void {
    this.searchText = '';
    this.startDate = null;
    this.endDate = null;
    this.sortOrder = 'desc';
    this.perPage = 8;
    this.currentPage = 1;
    this.datepicker.reset();
    this.loadConfigurations();
  }

  hasActiveFilters(): boolean {
    return this.searchText.trim().length > 0;
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadConfigurations();
    }
  }
  updateItemsPerPage(perPage: number): void {
    this.perPage = perPage;
    this.loadConfigurations();
  }

  createConfiguration(): void {
    this.editMode = false;
    this.configurationForm = { id: 0, nombre_config: '', valor: '', updated_at: null, created_at: null };
    this.modalOpen = true;
  }


  editConfiguration(configuration: Configuration): void {
    if (configuration.id !== undefined) {
      this.editMode = true;
      this.editId = configuration.id;
      this.configurationForm = { ...configuration };
      this.modalOpen = true; // Abre el modal al editar
    } else {
      console.error('Error: La categoría seleccionada no tiene un ID válido.');
    }
  }

  saveConfiguration(configurationData: Configuration): void {
    if (this.editMode && this.editId !== null) {
      // Modo edición
      this.configurationService.updateConfiguration(this.editId, configurationData).pipe(first()).subscribe({
        next: () => {
          this.loadConfigurations();
          this.closeModal();
          this.alertService.showSuccess('Categoría actualizada correctamente');
        },
        error: () => {
          this.alertService.showError('Error al actualizar categoría');
        },
      });
    } else {
      // Modo creación
      this.configurationService.createConfiguration(configurationData).pipe(first()).subscribe({
        next: () => {
          this.loadConfigurations();
          this.closeModal();
          this.alertService.showSuccess('Categoría creada correctamente');
        },
        error: () => {
          this.alertService.showError('Error al crear categoría');
        },
      });
    }
  }

  deleteConfiguration(id: number): void {
    this.alertService.confirmDelete().then((confirmed: boolean) => {
      if (confirmed) {
        this.configurationService.deleteConfiguration(id).pipe(first()).subscribe({
          next: () => {
            this.alertService.showSuccess('Categoría eliminada correctamente');
            this.configurations = this.configurations.filter(cat => cat.id !== id);
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
    this.configurationForm = { id: 0, nombre_config: '', valor: '', updated_at: null, created_at: null };
    this.editMode = false;
    this.editId = null;
  }

}
