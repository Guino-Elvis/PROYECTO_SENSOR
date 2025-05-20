import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from './api/api.endpoints';
import { HotToastService } from '@ngxpert/hot-toast';
import { ApiService } from './api.service';
import { catchError, Observable, tap } from 'rxjs';
import { Configuration } from '../models/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private endpoint = API_ENDPOINTS.CONFIGURATIONS;

  constructor(private apiService: ApiService, private toast: HotToastService) { }

  getConfigurations(
    search: string = '',
    startDate: string | null = null,
    endDate: string | null = null,
    sortOrder: 'asc' | 'desc' = 'desc',
    perPage: number = 10,
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
      tap(() => this.toast.success('configuraciones cargadas correctamente', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al cargar configuracions');
        throw error;
      })
    );
  }

  getConfiguration(id: number): Observable<Configuration> {
    return this.apiService.get<Configuration>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.toast.success('configuracion obtenida con éxito', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al obtener la configuracion', {
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }


  createConfiguration(configuration: Configuration): Observable<Configuration> {

    return this.apiService.post<Configuration>(`${this.endpoint}`, configuration);
  }

  updateConfiguration(id: number, configuration: Configuration): Observable<Configuration> {
    return this.apiService.put<Configuration>(this.endpoint, id, configuration);
  }
  
  deleteConfiguration(id: number): Observable<void> {
    return this.apiService.delete<void>(this.endpoint, id).pipe(
      tap(() => this.toast.success('item eliminada con éxito', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al eliminar item', {
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }

}
