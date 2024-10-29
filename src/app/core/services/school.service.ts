
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Observable } from "rxjs";
import { IPaginationParams, PagedResponse, SchoolRequestDTO, SchoolResponse } from "../../domains/interfaces/request.interface";
import { API_ENDPOINTS } from "../../domains/constants/api.constants";
import { BaseService } from "./base.service";

@Injectable({ providedIn: 'root' })
export class SchoolService extends BaseService {


   constructor(protected override http: HttpClient, protected override notificationService: NotificationService) {
    super(http, notificationService);
   }

  
   getSchools(paginationParams: Partial<IPaginationParams> = {}): Observable<PagedResponse<SchoolResponse>> {
    return this.getPaginated<SchoolResponse>(API_ENDPOINTS.SCHOOLS.GET_ALL, paginationParams);
   }
   
   getSchoolById(id: number): Observable<SchoolResponse> {
    return this.get<SchoolResponse>(API_ENDPOINTS.SCHOOLS.GET_BY_ID(id));
   }

   createSchool(file: File, school: SchoolRequestDTO): Observable<SchoolResponse> {
    
    const formData = new FormData();
    
    // Ajouter le fichier
    formData.append('file', file);
    
    // Ajouter les données de l'école en tant que JSON string dans la partie 'school'
    formData.append('school', new Blob([JSON.stringify(school)], {
      type: 'application/json'
    }));


    return this.postMultipart<SchoolResponse>(API_ENDPOINTS.SCHOOLS.CREATE, formData, 'École créée avec succès');
   }

   updateSchool(id: number, school: SchoolRequestDTO): Observable<SchoolResponse> {
    return this.put<SchoolResponse>(API_ENDPOINTS.SCHOOLS.UPDATE(id), school, 'École modifiée avec succès');
   }

   deleteSchool(id: number): Observable<void> {
    return this.delete<void>(API_ENDPOINTS.SCHOOLS.DELETE(id), 'École supprimée avec succès');
   }
}
