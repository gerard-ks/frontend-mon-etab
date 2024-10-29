import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Gender } from "../enums/request.enum";

export interface IRequestOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  responseType?: any;
  withCredentials?: boolean;
  body?: any;
}

export interface IPaginationParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
}


export interface PagedResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface TableLazyLoadEvent {
  first: number;
  rows: number;
  sortField?: string;
  sortOrder?: number;
  filters?: { 
    [key: string]: {
      value: any;
      matchMode?: string;
    }; 
  };
  globalFilter?: any;
} 


export interface AppSettingResponse {
  id: number;
  smtpServer: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
}

export interface AppSettingDetailResponse {
  id: number;
  smtp_server: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
}

export interface SchoolResponse {
  id: number;
  name: string;
  url_logo: string;
  appSetting: AppSettingResponse;
}

export interface SchoolDetailResponse {
  id: number;
  name: string;
  url_logo: string;
  appSettingDTO: AppSettingDetailResponse;
}


export interface Address {
  id: number;
  street: string;
  city: string;
  country: string;
}

export interface RoleUserResponse {
  id: number;
  role: string;
}

export interface UserResponse {
  id: number;
  pseudo: string;
  password: string;
  creation_date: Date;
  schoolDTO: SchoolResponse;
  role: Set<RoleUserResponse>;
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone: string;
  urlPicture: string;
  address: Address;
  user?: UserResponse;
}

export interface StudentCardResponse {
  id: number;
  reference: string;
  issueDate: Date;
  expirationDate: Date;
}

export interface StudentResponse extends Person {
  matricule: string;
  phoneNumberFather: string;
  studentCards: StudentCardResponse[];
}

export interface AppSettingRequestDTO {
  smtp_server: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
}

export interface SchoolRequestDTO {
  name: string;
  appSettingDTO: AppSettingRequestDTO;
}


