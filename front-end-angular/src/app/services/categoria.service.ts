import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Categoria } from '../models/categoria.model';
import { catchError, Observable, tap } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';
import { API_ENDPOINTS } from './api/api.endpoints';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endpoint = API_ENDPOINTS.CATEGORIES;

  constructor(private apiService: ApiService, private toast: HotToastService) {}

  getCategorias(
    search: string = '', 
    startDate: string | null = null, 
    endDate: string | null = null,
    sortOrder: 'asc' | 'desc' = 'desc',
    perPage: number = 10 ,
    page: number = 1
  ): Observable<any> {
    let params: string[] = [];
  
    if (search.trim()) {
      params.push(`search=${encodeURIComponent(search)}`);
    }
  
    if (startDate) {
      params.push(`start_date=${encodeURIComponent(startDate)}`);
    }
  
    if (endDate) {
      params.push(`end_date=${encodeURIComponent(endDate)}`);
    }
  
    params.push(`sort_order=${sortOrder}`);
    params.push(`per_page=${perPage}`); 
    params.push(`page=${page}`); 
  
    const queryString = params.length ? `?${params.join('&')}` : '';
    const url = `${this.endpoint}${queryString}`;
  
    return this.apiService.get(url).pipe(
      tap(() => this.toast.success('Categorías cargadas correctamente',{
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al cargar categorías');
        throw error;
      })
    );
  }

  getCategoria(id: number): Observable<Categoria> {
    return this.apiService.get<Categoria>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.toast.success('Categoría obtenida con éxito',{
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al obtener la categoría',{
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.apiService.post<Categoria>(this.endpoint, categoria).pipe(
      tap(() => this.toast.success('Categoría creada exitosamente',{
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al crear la categoría',{
          position: 'bottom-right',
        });
        throw error;
      }));
  }

  updateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.apiService.put<Categoria>(this.endpoint, id, categoria).pipe(
      tap(() => this.toast.success('Categoría actualizada correctamente',{
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al actualizar la categoría',{
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }

  deleteCategoria(id: number): Observable<void> {
    return this.apiService.delete<void>(this.endpoint, id).pipe(
      tap(() => this.toast.success('Categoría eliminada con éxito',{
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al eliminar la categoría',{
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }
  
  
}
