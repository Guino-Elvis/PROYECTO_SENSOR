import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { ApiService } from '../../../services/api.service';
import { Subscription } from 'rxjs';
import { Contract } from '../../../models/contract.model';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-contract-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contract-form.component.html',
  styles: ``
})
export class ContractFormComponent {
  @Input() isSaving: boolean = false;
  @Input() contract: Contract | null = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();
  isLoading: boolean = false;

  contractForm: FormGroup;
  companyOptions: Company[] = [];
  userData: User | null = null;
  isAdmin: boolean = false;

  private companySubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  statusOptions = [
    { id: '2', nombre: 'Activo' },
    { id: '1', nombre: 'Inactivo' },
  ];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private authService: AuthService,
  ) {
    this.contractForm = this.fb.group({
      sheet_name: ['Detalle', Validators.required],
      start_row: ['11', [Validators.required, Validators.min(1)]],
      file: [null, Validators.required],
      // name: ['', Validators.required],
      status: ['', Validators.required],
      company_id: [null],
    });
  }

  ngOnInit(): void {
    this.companySubscription = this.companyService.getCompanies().subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.companyOptions = response;
        } else if (response?.data && Array.isArray(response.data)) {
          this.companyOptions = response.data;
        } else {
          console.error('Formato inesperado de compañias:', response);
        }
      },
      (error) => console.error('Error al obtener los compañias:', error)
    );


    this.userSubscription = this.authService.getUserData().subscribe(
      (response) => {
        if (response && typeof response === 'object') {
          this.userData = response;
          this.isAdmin = this.userData.roles?.some(role => role.name === 'Administrador') || false;
        } else {
          console.error('Formato inesperado de usuario:', response);
        }
      },
      (error) => console.error('Error al obtener los datos del usuario:', error)
    );

  }

  ngOnDestroy(): void {
    this.companySubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contract'] && changes['contract'].currentValue) {
      const contractData = changes['contract'].currentValue;
      console.log('Datos recibidos para edición:', contractData);

      this.contractForm.patchValue({
        sheet_name: contractData.sheet_name || '',
        start_row: contractData.start_row || '',
        file: null,
        status: Number(this.contract?.status),
        company_id: changes['contract'].currentValue.company?.id || null,
      });
      console.log('Formulario actualizado:', this.contractForm.value);
      this.isLoading = false;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tipo de archivo
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(file.type)) {
        console.error('Formato de archivo no permitido:', file.type);
        return;
      }

      this.contractForm.patchValue({ file });
    }
  }


  handleSubmit(): void {
    if (this.contractForm.invalid) {
      console.error('Formulario inválido:', this.contractForm.value);
      return;
    }

    const formData = new FormData();


    Object.keys(this.contractForm.value).forEach((key) => {
      if (key !== 'file') {
        const value = this.contractForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      }
    });
    // Adjuntar archivo
    const file = this.contractForm.get('file')?.value;
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      console.error('El archivo no es válido:', file);
      return;
    }

    console.log('Enviando FormData:', Array.from(formData.entries()));
    // Eliminar company_id si no es admin
    if (!this.isAdmin) {
      formData.delete('company_id');
    }
    this.onSave.emit(formData);
  }
}
