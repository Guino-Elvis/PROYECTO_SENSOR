import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-configuration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './configuration-form.component.html',
  styles: ``
})
export class ConfigurationFormComponent {
  @Input() configuration: any = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  configurationForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.configurationForm = this.fb.group({
      nombre_config: ['', Validators.required],
      valor: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuration'] && changes['configuration'].currentValue) {
      const updatedConfiguration = {
        ...this.configuration,
      };
      this.configurationForm.patchValue(updatedConfiguration);
    }
  }

  handleSubmit(): void {
    if (this.configurationForm.invalid) {
      return;
    }

    this.onSave.emit(this.configurationForm.value);
    this.configurationForm.reset();
  }
}
