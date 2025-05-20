import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { first, Observable } from 'rxjs'; // Importar first() de RxJS
import { LayoutComponent } from '../../partials/layout.component';
import { Categoria } from '../../../models/categoria.model';
import { CategoriaService } from '../../../services/categoria.service';
import { CustomLinkComponent } from '../../../components/custom-link.component';
import { CategoryFormComponent } from '../../form/category/category-form.component';
import { ModalFormComponent } from '../../../components/modal/modal-form.component';
import { AlertService } from '../../../services/alert.service';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { ReusableButtonComponent } from '../../../components/reusable-button.component';
import { ICONS } from '../../../core/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ItemUpdatedAtComponent } from '../../../components/table/item-updated-at.component';
import { PaginationComponent } from '../../../components/table/pagination/pagination.component';
import { NoItemPageComponent } from '../../../components/no-item-page.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LayoutComponent,
    CustomLinkComponent,
    CategoryFormComponent,
    ModalFormComponent,
    CustomDatepickerComponent,
    ReusableButtonComponent,
    FontAwesomeModule,
    ItemUpdatedAtComponent,
    PaginationComponent,
    NoItemPageComponent
  ],
  templateUrl: './category-list.component.html',
  styles: ``,
})
export class CategoryListComponent {
  @ViewChild(CustomDatepickerComponent) datepicker!: CustomDatepickerComponent;
  icons = ICONS;
  categorias: Categoria[] = [];
  searchText: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  perPage: number = 8;
  currentPage: number = 1;
  totalPages: number = 1;
  totalItems: number = 0;
  categoriaForm: Categoria = { id: 0, name: '', slug: '', status: '2', updated_at: null, created_at: null };
  editMode: boolean = false;
  editId: number | null = null;
  modalOpen: boolean = false;

  constructor(
    private categoriaService: CategoriaService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategorias(
      this.searchText,
      this.startDate,
      this.endDate,
      this.sortOrder,
      this.perPage,
      this.currentPage

    ).pipe(first()).subscribe({
      next: (response) => {
        if (Array.isArray(response.data)) {
          this.categorias = response.data;
          this.totalItems = response.total;
          this.totalPages = Math.ceil(this.totalItems / this.perPage);
        } else {
          console.error('La respuesta no contiene un array de categorías');
        }
      },
      error: (error) => console.error('Error al obtener categorías:', error),
    });
  }

  filterCategorias(): void {
    if (this.searchText.trim().length < 3) {
      return;
    }
    this.loadCategorias();
  }
  updateDates(dates: { startDate: string | null; endDate: string | null }) {
    this.startDate = dates.startDate;
    this.endDate = dates.endDate;
    this.loadCategorias();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadCategorias();
  }

  resetFilters(): void {
    this.searchText = '';
    this.startDate = null;
    this.endDate = null;
    this.sortOrder = 'desc';
    this.perPage = 8;
    this.currentPage = 1;
    this.datepicker.reset();
    this.loadCategorias();
  }

  hasActiveFilters(): boolean {
    return this.searchText.trim().length > 0;
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCategorias();
    }
  }
  updateItemsPerPage(perPage: number): void {
    this.perPage = perPage;
    this.loadCategorias();
  }

  createCategoria(): void {
    this.editMode = false;
    this.categoriaForm = { id: 0, name: '', slug: '', status: '2', updated_at: null, created_at: null };
    this.modalOpen = true;
  }


  editCategoria(categoria: Categoria): void {
    if (categoria.id !== undefined) {
      this.editMode = true;
      this.editId = categoria.id;
      this.categoriaForm = { ...categoria };
      this.modalOpen = true; // Abre el modal al editar
    } else {
      console.error('Error: La categoría seleccionada no tiene un ID válido.');
    }
  }

  saveCategoria(categoriaData: Categoria): void {
    if (this.editMode && this.editId !== null) {
      // Modo edición
      this.categoriaService.updateCategoria(this.editId, categoriaData).pipe(first()).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
          this.alertService.showSuccess('Categoría actualizada correctamente');
        },
        error: () => {
          this.alertService.showError('Error al actualizar categoría');
        },
      });
    } else {
      // Modo creación
      this.categoriaService.createCategoria(categoriaData).pipe(first()).subscribe({
        next: () => {
          this.loadCategorias();
          this.closeModal();
          this.alertService.showSuccess('Categoría creada correctamente');
        },
        error: () => {
          this.alertService.showError('Error al crear categoría');
        },
      });
    }
  }

  deleteCategoria(id: number): void {
    this.alertService.confirmDelete().then((confirmed: boolean) => {
      if (confirmed) {
        this.categoriaService.deleteCategoria(id).pipe(first()).subscribe({
          next: () => {
            this.alertService.showSuccess('Categoría eliminada correctamente');
            this.categorias = this.categorias.filter(cat => cat.id !== id);
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
    this.categoriaForm = { id: 0, name: '', slug: '', status: '2', updated_at: null, created_at: null };
    this.editMode = false;
    this.editId = null;
  }
}
