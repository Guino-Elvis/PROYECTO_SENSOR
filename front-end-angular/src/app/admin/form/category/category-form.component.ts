import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './category-form.component.html',
  styles: ``,
})
export class CategoryFormComponent implements OnChanges {
  @Input() category: any = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  categoryForm: FormGroup;
  statusOptions = [
    { id: '2', nombre: 'Activo' },
    { id: '1', nombre: 'Inactivo' },
  ];

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && changes['category'].currentValue) {
      const updatedCategory = {
        ...this.category,
        status: Number(this.category.status), // ✅ Convertimos a número
      };
      this.categoryForm.patchValue(updatedCategory);
    }
  }

  handleSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.onSave.emit(this.categoryForm.value);
    this.categoryForm.reset();
  }
}
