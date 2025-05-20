import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sensor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './sensor-form.component.html',
  styles: ``
})
export class SensorFormComponent {
  @Input() sensor: any = null;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  sensorForm: FormGroup;

  estadoOptions = [
    { id: '1', nombre: 'Activo' },
    { id: '0', nombre: 'Inactivo' },
  ];

  constructor(private fb: FormBuilder) {
    this.sensorForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sensor'] && changes['sensor'].currentValue) {
      const updatedSensor = {
        ...this.sensor,
        estado: Number(this.sensor.estado), // ✅ Convertimos a número
      };
      this.sensorForm.patchValue(updatedSensor);
    }
  }

  handleSubmit(): void {
    if (this.sensorForm.invalid) {
      return;
    }

    this.onSave.emit(this.sensorForm.value);
    this.sensorForm.reset();
  }
}
