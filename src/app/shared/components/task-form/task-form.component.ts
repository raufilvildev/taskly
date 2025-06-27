import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ITask } from '../../../interfaces/itask';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Input() showBackButton: boolean = false;
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() createTask = new EventEmitter<any>();

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    description: new FormControl('', [Validators.required]),
    due_date: new FormControl('', [Validators.required]),
    time_start: new FormControl(''),
    time_end: new FormControl(''),
    is_urgent: new FormControl(false),
    is_important: new FormControl(false),
    priority_color: new FormControl('neutral'),
    is_completed: new FormControl(false),
    subtasks: new FormArray([])
  });

  // Opciones para priority_color
  priorityColors = [
    { value: 'neutral', label: 'Neutral', class: 'bg-gray-200 text-gray-800' },
    { value: 'yellow', label: 'Amarillo', class: 'bg-yellow-200 text-yellow-800' },
    { value: 'red', label: 'Rojo', class: 'bg-red-200 text-red-800' }
  ];

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  closeForm() {
    this.close.emit();
  }

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(new FormGroup({
      title: new FormControl('', Validators.required),
      is_completed: new FormControl(false)
    }));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      this.createTask.emit(taskData);
      console.log('Creando tarea:', taskData);
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  trackByIndex(index: number) {
    return index;
  }
}
