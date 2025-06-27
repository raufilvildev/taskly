import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUnitCourse } from '../../../../../../interfaces/icourse.interface';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../shared/components/buttons/create-edit-cancel-remove-button/create-edit-cancel-remove-button.component';
import { SectionFormComponent } from '../section-form/section-form.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-unit-form',
  imports: [
    ReactiveFormsModule,
    CreateEditCancelRemoveButtonComponent,
    SectionFormComponent,
    MatIcon,
  ],
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.css',
})
export class UnitFormComponent {
  @Input() planning: IUnitCourse[] = [];
  @Output() updatePlanning = new EventEmitter<IUnitCourse[]>();

  unitForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  sectionForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  touchedUnit = -1;
  touchedSection = -1;
  editedUnit = -1;
  editedSection = -1;

  createUnitStatus = false;
  editUnitStatus = false;

  createSectionStatus = false;
  editSectionStatus = false;

  showUnitForm = false;
  showSectionForm = false;

  unitFormError = '';

  displayCreateUnit() {
    // Si se está creando o editando sección, limpiamos esos estados
    this.createSectionStatus = false;
    this.editSectionStatus = false;
    this.showSectionForm = false;
    this.touchedSection = -1;

    // Si estaba editando unidad y clic en crear unidad cancela edición
    if (this.editUnitStatus) {
      this.editUnitStatus = false;
      this.editedUnit = -1;
    }

    // Alternar el estado de crear unidad
    this.createUnitStatus = !this.createUnitStatus;

    // Reset formulario de unidad cuando se abre
    if (this.createUnitStatus) {
      this.unitForm.reset();
      this.showUnitForm = true;
    } else {
      this.showUnitForm = false;
    }
  }

  displayEditUnit(unit_index: number) {
    // Cancelar creación/edición de sección
    this.createSectionStatus = false;
    this.editSectionStatus = false;
    this.showSectionForm = false;
    this.touchedSection = -1;

    this.editUnitStatus = !this.editUnitStatus || this.touchedUnit !== unit_index;
    this.createUnitStatus = false;
    this.editedUnit = unit_index;

    this.unitForm.reset();

    if (this.editUnitStatus) {
      this.unitForm.setValue({ title: this.planning[unit_index].title });
      this.showUnitForm = true;
    } else {
      this.showUnitForm = false;
      this.editedUnit = -1;
    }
  }

  displayCreateSection(unit_index: number) {
    this.createUnitStatus = false;
    this.editUnitStatus = false;
    this.showUnitForm = false;
    this.editedUnit = -1;

    // Si ya estás creando o editando esta unidad y pulsas el botón para crear sección...
    if (this.touchedUnit === unit_index) {
      if (this.createSectionStatus) {
        // Ya estás creando, toggle para cerrar
        this.createSectionStatus = false;
        this.editSectionStatus = false;
        this.showSectionForm = false;
        this.touchedSection = -1;
        return;
      }
      if (this.editSectionStatus) {
        // Estabas editando, ahora quieres crear, cambiamos estado sin cerrar el form
        this.createSectionStatus = true;
        this.editSectionStatus = false;
        this.showSectionForm = true;
        this.touchedSection = -1;
        this.sectionForm.reset();
        return;
      }
    }

    // Caso normal: abrir crear sección en la unidad tocada
    this.createSectionStatus = true;
    this.editSectionStatus = false;
    this.showSectionForm = true;
    this.touchedUnit = unit_index;
    this.touchedSection = -1;
    this.sectionForm.reset();
  }

  addUnit() {
    if (!this.unitForm.value.title) {
      this.unitFormError = 'El título de la unidad no puede ser vacío.';
      return;
    }

    this.planning.push({ title: this.unitForm.value.title, sections: [] });
    this.unitForm.reset();
    this.unitFormError = '';

    this.updatePlanning.emit(this.planning);
  }

  editUnit(unit_index: number) {
    if (!this.unitForm.value.title) {
      this.unitFormError = 'El título de la unidad no puede ser vacío.';
      return;
    }
    this.planning[unit_index].title = this.unitForm.value.title;
    this.unitForm.reset();
    this.unitFormError = '';

    this.showUnitForm = false;

    this.createUnitStatus = false;
    this.editUnitStatus = false;

    this.editedUnit = -1;
    this.updatePlanning.emit(this.planning);
  }

  removeUnit(unit_index: number) {
    this.planning.splice(unit_index, 1);

    // Cancelar todo estado de formularios y edición
    this.createUnitStatus = false;
    this.editUnitStatus = false;
    this.showUnitForm = false;

    this.createSectionStatus = false;
    this.editSectionStatus = false;
    this.showSectionForm = false;

    this.editedUnit = -1;
    this.touchedUnit = -1;
    this.touchedSection = -1;

    this.updatePlanning.emit(this.planning);
  }

  increaseUnitNumber(unit_index: number) {
    const currentUnit = this.planning[unit_index];
    const previousUnit = this.planning[unit_index - 1];

    this.planning[unit_index] = previousUnit;
    this.planning[unit_index - 1] = currentUnit;

    this.resetAllStates();
  }

  decreaseUnitNumber(unit_index: number) {
    const currentUnit = this.planning[unit_index];
    const nextUnit = this.planning[unit_index + 1];

    this.planning[unit_index] = nextUnit;
    this.planning[unit_index + 1] = currentUnit;
    this.resetAllStates();
  }

  updateUnitSections(event: { title: string }[], unit_index: number) {
    this.planning[unit_index].sections = event;

    this.updatePlanning.emit(this.planning);
  }

  onCloseUnitForms() {
    this.createUnitStatus = false;
    this.editUnitStatus = false;
    this.showUnitForm = false;

    this.showSectionForm = false;

    this.editedUnit = -1;
  }

  cancelAllFormsHandler() {
    this.createSectionStatus = false;
    this.editSectionStatus = false;
    this.showSectionForm = false;
    this.touchedSection = -1;
  }

  resetAllStates() {
    this.createUnitStatus = false;
    this.editUnitStatus = false;
    this.showUnitForm = false;
    this.createSectionStatus = false;
    this.editSectionStatus = false;
    this.showSectionForm = false;
    this.touchedUnit = -1;
    this.touchedSection = -1;
    this.editedUnit = -1;
    this.editedSection = -1;
    this.unitForm.reset();
    this.sectionForm.reset();
  }

  handleRequestEditSection(event: { unit_index: number; section_index: number }) {
    const { unit_index, section_index } = event;

    // Si ya estás editando esta misma sección, cancela edición
    if (
      this.editSectionStatus &&
      this.touchedUnit === unit_index &&
      this.touchedSection === section_index
    ) {
      this.editSectionStatus = false;
      this.showSectionForm = false;
      this.touchedUnit = -1;
      this.touchedSection = -1;
      return;
    }

    // Resetear todos los estados anteriores
    this.resetAllStates();

    // Activar la edición en la sección deseada
    this.editSectionStatus = true;
    this.showSectionForm = true;
    this.touchedUnit = unit_index;
    this.touchedSection = section_index;

    // Si necesitas cargar el título en el formulario:
    const section = this.planning[unit_index].sections[section_index];
    this.sectionForm.setValue({ title: section.title });
  }
}
