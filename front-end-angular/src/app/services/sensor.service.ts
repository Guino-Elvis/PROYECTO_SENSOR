import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from './api/api.endpoints';
import { ApiService } from './api.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, Observable, tap } from 'rxjs';
import { Sensor } from '../models/sensor.model';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private endpoint = API_ENDPOINTS.SENSORES;
  constructor(
    private apiService: ApiService,
    private toast: HotToastService
  ) { }

  getSensors(
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
      tap(() => this.toast.success('Sensor cargados correctamente', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al cargar Sensores', {
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }

  getSensor(id: number): Observable<Sensor> {
    return this.apiService.get<Sensor>(`${this.endpoint}/${id}`).pipe(
      tap(() => this.toast.success('Sensor cargado correctamente', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al cargar picking', {
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }

  getSensorGrafico(
    tipo: string | null = null,
    tiempo: string | null = null,
  ): Observable<any> {
    const params: string[] = [];

    if (tipo) {
      params.push(`tipo=${encodeURIComponent(tipo)}`);
    }

    if (tiempo) {
      params.push(`tiempo=${encodeURIComponent(tiempo)}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';
    const url = `${this.endpoint}_grafico${queryString}`;

    return this.apiService.get(url).pipe(
      tap(() => this.toast.success('Sensor cargado correctamente', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al cargar sensores', {
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }

  createSensor(sensor: Sensor): Observable<Sensor> {

    return this.apiService.post<Sensor>(`${this.endpoint}`, sensor);
  }

  updateSensor(id: number, sensor: Sensor): Observable<Sensor> {
    return this.apiService.put<Sensor>(this.endpoint, id, sensor);
  }

  deleteSensor(id: number): Observable<void> {
    return this.apiService.delete<void>(this.endpoint, id).pipe(
      tap(() => this.toast.success('item eliminado con éxito', {
        position: 'bottom-right',
      })),
      catchError((error) => {
        this.toast.error('Error al eliminar la item', {
          position: 'bottom-right',
        });
        throw error;
      })
    );
  }
}
