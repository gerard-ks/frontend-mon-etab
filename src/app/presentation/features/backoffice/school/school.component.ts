import { FileUpload, FileSelectEvent , FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { NotificationService } from '../../../../core/services/notification.service';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SchoolService } from '../../../../core/services/school.service';
import { debounceTime, finalize, Subject } from 'rxjs';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { IPaginationParams, SchoolDetailResponse, SchoolResponse } from '../../../../domains/interfaces/request.interface';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-school',
  standalone: true,
  imports: [
    CommonModule, 
    CardModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule, 
    InputTextModule, 
    PasswordModule,
    TableModule,
    FileUploadModule,
    ProgressSpinnerModule,
    LottieComponent,
    IconFieldModule,
    InputTextModule,
    InputIconModule
  ],
  templateUrl: './school.component.html',
  styleUrl: './school.component.scss'
})
export class SchoolComponent implements OnInit {


  @ViewChild('fileUpload') fileUpload!: FileUpload;

  readonly MAX_FILE_SIZE = 5000000; // 5MB

  selectedFile?: File;

  schoolForm!: FormGroup;

  visible: boolean = false;

  totalSchools = 0;

  schools: SchoolResponse[] = [];

  loading: boolean = false;

  options: AnimationOptions = {
    path: 'Animation-emptybox.json',
    loop: true,
    autoplay: true
  };

   displayDetailDialog: boolean = false;
   selectedSchool: SchoolDetailResponse | null = null;


  pageNo: number = 0;
  pageSize: number = 5; // Taille fixe par page
  search: string = '';
  searchSubject = new Subject<string>();

  

 constructor(private readonly fb: FormBuilder, private readonly notificationService: NotificationService, private readonly schoolService: SchoolService) {
  this.searchSubject
    .pipe(debounceTime(300))
  .subscribe((searchTerm: string) => {
    this.search = searchTerm;
    this.pageNo = 0;
    this.loadSchools();
  });
 }


 ngOnInit(): void {
  this.initForm();
  this.loadSchools(); 
}

private initForm(): void {
   this.schoolForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],  
    file: [null, Validators.required],
    appSettingDTO: this.fb.group({
      smtp_server: ['', [Validators.required]],
      smtp_port: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],    
      smtp_username: ['', [Validators.required]],
      smtp_password: ['', [Validators.required, Validators.minLength(8)]]                 
    })
  });
}

// Navigation entre les pages
  onPageChange(event: any): void {
    this.pageNo = event.page; // PrimeNG fournit directement le numéro de page
    this.loadSchools();
  }

  // Recherche
  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  isFieldInvalid(field: string, parentGroup: string | null = null): boolean {
    const control = parentGroup ? 
      this.schoolForm.get(`${parentGroup}.${field}`) : 
      this.schoolForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

 getErrorMessage(field: string, parentGroup: string | null = null): string {
    const control = parentGroup ? 
      this.schoolForm.get(`${parentGroup}.${field}`) : 
      this.schoolForm.get(field);
    
    if (!control || !control.errors) return '';

    const errors = control.errors;
    
    // Vérifie chaque type d'erreur dans l'ordre de priorité
    if (errors['required']) {
      if (field === 'name') return 'Le nom de l\'école est requis';
      if (field === 'smtp_server') return 'Le serveur SMTP est requis';
      if (field === 'smtp_port') return 'Le port SMTP est requis';
      if (field === 'smtp_username') return 'Le nom d\'utilisateur SMTP est requis';
      if (field === 'smtp_password') return 'Le mot de passe SMTP est requis';
      return 'Ce champ est requis';
    }

    if (errors['minlength']) {
      if (field === 'name') return `Le nom doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
      if (field === 'smtp_password') return `Le mot de passe doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
      return `Minimum ${errors['minlength'].requiredLength} caractères`;
    }

    if (errors['maxlength']) {
      if (field === 'name') return `Le nom ne doit pas dépasser ${errors['maxlength'].requiredLength} caractères`;
      return `Maximum ${errors['maxlength'].requiredLength} caractères`;
    }

    if (errors['min']) {
      if (field === 'smtp_port') return `Le port doit être supérieur ou égal à ${errors['min'].min}`;
      return `Valeur minimum: ${errors['min'].min}`;
    }

    if (errors['max']) {
      if (field === 'smtp_port') return `Le port doit être inférieur ou égal à ${errors['max'].max}`;
      return `Valeur maximum: ${errors['max'].max}`;
    }
    
    return 'Erreur de validation';
}

  showDialog() {
    this.visible = true;
    this.resetForm();
  }

  saveSchool() {

    if (this.schoolForm.invalid) {
      this.notificationService.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    if (!this.selectedFile) {
      this.notificationService.error('Veuillez sélectionner un logo');
      return;
    }


    const { file, ...schoolData } = this.schoolForm.value;

    this.schoolService.createSchool(this.selectedFile, schoolData)
    .subscribe({
      next: (response) => {
        this.hideDialog();
        this.loadSchools();
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'école:', error);
      }
    });
    
  }

  private loadSchools() {

    this.loading = true;

    const params: IPaginationParams = {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      search: this.search || ''
    };

    this.schoolService.getSchools(params)
    .pipe(
        finalize(() => {
          this.loading = false;  // Désactive l'indicateur qu'il y ait succès ou erreur
        })
      )
    .subscribe({
      next: (response) => {
        this.schools = response.content;
        this.totalSchools = response.totalElements;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des écoles:', error);
      }
    });
  }



  onFileSelected(event: FileSelectEvent): void {
    if (event.currentFiles && event.currentFiles.length > 0) {
      this.selectedFile = event.currentFiles[0];

      const allowedTypes = ['image/png', 'image/svg+xml'];
      
      if (!allowedTypes.includes(this.selectedFile.type)) {
        this.notificationService.error('Type de fichier invalide', 'Seuls les fichiers PNG et SVG sont autorisés');
        this.fileUpload.clear();
        return;
      }

      this.schoolForm.patchValue({ file: 'dummy' });
      this.schoolForm.get('file')?.markAsTouched();
    }
  }

  onClearFile() {
    this.selectedFile = undefined;
    this.schoolForm.patchValue({ file: null });
    this.schoolForm.get('file')?.markAsTouched();
  }


  hideDialog() {
    this.visible = false;
  }

  resetForm() {
    this.schoolForm.reset();
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  deleteSchool(school: SchoolDetailResponse) {
   
  }

  editSchool(school: SchoolDetailResponse) {
    
  }

  detailSchool(school: SchoolDetailResponse) {
    console.log('school', school);
    this.selectedSchool = { ...school };
    this.displayDetailDialog = true;
  }
  
}
