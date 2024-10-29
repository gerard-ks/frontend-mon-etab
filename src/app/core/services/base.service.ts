import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IPaginationParams, PagedResponse, TableLazyLoadEvent } from "../../domains/interfaces/request.interface";
import { catchError, Observable, tap, throwError } from "rxjs";
import { NotificationService } from "./notification.service";
import { FilterMetadata } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {
  private readonly apiUrl = environment.apiUrl;

  constructor(protected readonly http: HttpClient, protected readonly notificationService: NotificationService) {}

  private readonly jsonHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  protected get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, { ...this.jsonHeaders, params })
      .pipe(catchError((error) => this.handleError(error)));
  }

  protected post<T>(endpoint: string, data: any, successMessage?: string): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, data, this.jsonHeaders)
      .pipe(
        tap(() => {
          if (successMessage) this.handleSuccess(successMessage);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  protected postMultipart<T>(endpoint: string, formData: FormData, successMessage?: string): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, formData)
      .pipe(
        tap(() => {
          if (successMessage) this.handleSuccess(successMessage);
        }),
        catchError((error) => this.handleError(error))
      );
  }

 protected put<T>(endpoint: string, data: any, successMessage?: string): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, data, this.jsonHeaders)
      .pipe(
        tap(() => {
          if (successMessage) this.handleSuccess(successMessage);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  protected putMultipart<T>(endpoint: string, formData: FormData, successMessage?: string): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, formData)
      .pipe(
        tap(() => {
          if (successMessage) this.handleSuccess(successMessage);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  protected delete<T>(endpoint: string, successMessage?: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, this.jsonHeaders)
      .pipe(
        tap(() => {
          if (successMessage) this.handleSuccess(successMessage);
        }),
        catchError((error) => this.handleError(error))
      );
  }

  protected getPaginated<T>(endpoint: string, paginationParams: Partial<IPaginationParams> = {}): Observable<PagedResponse<T>> {
    
    const {
      pageNo = 0,
      pageSize = 10,
      sortBy,
      sortDir = 'asc',
      search
    } = paginationParams;
   
    let params = this.buildPaginationParams(pageNo, pageSize, sortBy, sortDir);


    if (search) {
      params = params.append('search', search);
    }

    return this.get<PagedResponse<T>>(endpoint, params)
        .pipe(catchError((error) => this.handleError(error)));
  }



  protected getPaginatedPrimeNG<T>(
    endpoint: string,
    event: TableLazyLoadEvent
  ): Observable<PagedResponse<T>> {

    const params = this.buildPaginationParamsPrimeNG(event);  

    return this.get<PagedResponse<T>>(endpoint, params);
  }

  private handleSuccess(message: string): void {
    this.notificationService.success(message);
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur client: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }


    this.notificationService.error(errorMessage);
    return throwError(() => ({
      error,
      message: errorMessage,
      timestamp: new Date()
    }));
  }

  private buildPaginationParams(
    pageNo: number,
    pageSize: number,
    sortBy?: string,
    sortDir: 'asc' | 'desc' = 'asc'
  ): HttpParams {
    let params = new HttpParams()
      .append('pageNo', pageNo.toString())
      .append('pageSize', pageSize.toString());

    if (sortBy) {
      params = params.append('sortBy', sortBy)
                    .append('sortDir', sortDir);
    }

    return params;
  }

  private buildPaginationParamsPrimeNG(event: TableLazyLoadEvent): HttpParams {
    let params = new HttpParams()
      .set('page', this.calculatePageNumber(event).toString())
      .set('size', (event.rows || 10).toString());

    params = this.addSortingParams(params, event);
    params = this.addFilterParams(params, event);
    params = this.addSearchParams(params, event);

    return params;
  }

  private calculatePageNumber(event: TableLazyLoadEvent): number {
    return Math.floor((event.first || 0) / (event.rows || 10));
  }

  private addSortingParams(params: HttpParams, event: TableLazyLoadEvent): HttpParams {
    if (event.sortField) {
      const sortDir = event.sortOrder === 1 ? 'asc' : 'desc';
      params = params.append('sort', `${event.sortField},${sortDir}`);
    }
    return params;
  }

  private addFilterParams(params: HttpParams, event: TableLazyLoadEvent): HttpParams {
    let updatedParams = params;

    if (event.filters) {
      Object.entries(event.filters).forEach(([key, filterMeta]) => {
        if (this.isValidFilterValue(filterMeta?.value)) {
          updatedParams = this.appendFilterValues(updatedParams, key, filterMeta);
        }
      });
    }

    return updatedParams;
  }

  private isValidFilterValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  private appendFilterValues(params: HttpParams, key: string, filterMeta: FilterMetadata | FilterMetadata[]): HttpParams {
    let updatedParams = params;

    if (Array.isArray(filterMeta)) {
      filterMeta.forEach(meta => updatedParams = this.appendFilterValues(updatedParams, key, meta));
    } else {
      updatedParams = updatedParams.append(key, filterMeta.value.toString());
    }

    return updatedParams;
  }

  private addSearchParams(params: HttpParams, event: TableLazyLoadEvent): HttpParams {
    if (this.isValidFilterValue(event.globalFilter)) {
      return params.set('search', event.globalFilter.toString());
    }
    return params;
  }
}
