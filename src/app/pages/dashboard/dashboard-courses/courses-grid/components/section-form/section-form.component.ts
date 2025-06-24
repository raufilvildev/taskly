import { Component, EventEmitter, Input, Output } from '@angular/core';
import { initUnit } from '../../../../../../shared/utils/initializers';
import { CreateEditCancelRemoveButtonComponent } from '../../../../../../shared/components/buttons/create-edit-cancel-remove-button/create-edit-cancel-remove-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-section-form',
  imports: [CreateEditCancelRemoveButtonComponent, ReactiveFormsModule, MatIcon],
  templateUrl: './section-form.component.html',
  styleUrl: './section-form.component.css',
})
export class SectionFormComponent {
  @Input() unit = initUnit();
  @Input() unit_index = 0;
  @Input() createSectionStatus = false;
  @Input() editSectionStatus = false;
  @Input() showSectionForm = false;
  @Input() touchedUnit = -1;
  @Input() touchedSection = -1;
  @Input() sectionForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  @Output() updateUnitForm = new EventEmitter<{ title: string }[]>();
  @Output() setEditSectionStatus = new EventEmitter<boolean>();
  @Output() setTouchedSection = new EventEmitter<number>();
  @Output() closeUnitForms = new EventEmitter<void>();
  sectionFormError = '';
  @Output() cancelAllForms = new EventEmitter<void>();
  @Output() setShowSectionForm = new EventEmitter<boolean>();
  @Output() requestEditSection = new EventEmitter<{ unit_index: number; section_index: number }>();

  displayEditSection(section_index: number) {
    this.requestEditSection.emit({ unit_index: this.unit_index, section_index: section_index });
  }

  addSection() {
    if (!this.sectionForm.value.title) {
      this.sectionFormError = 'El título de la sección no puede ser vacío.';
      return;
    }

    this.unit.sections.push({ title: this.sectionForm.value.title });
    this.sectionForm.reset();

    this.updateUnitForm.emit(this.unit.sections);
  }

  editSection(section_index: number) {
    if (!this.sectionForm.value.title) {
      this.sectionFormError = 'El título de la sección no puede ser vacío.';
      return;
    }

    this.unit.sections[section_index] = { title: this.sectionForm.value.title };

    this.sectionForm.reset();

    this.setShowSectionForm.emit(false);
    this.setEditSectionStatus.emit(false);
    this.setTouchedSection.emit(-1);

    this.updateUnitForm.emit(this.unit.sections);
  }

  removeSection(section_index: number) {
    this.unit.sections.splice(section_index, 1);
    this.updateUnitForm.emit(this.unit.sections);

    // Emitir evento para cancelar creación/edición en padre
    this.cancelAllForms.emit();
  }

  increaseSectionNumber(section_index: number) {
    const currentSection = this.unit.sections[section_index];
    const previousSection = this.unit.sections[section_index - 1];

    this.unit.sections[section_index] = previousSection;
    this.unit.sections[section_index - 1] = currentSection;

    this.updateUnitForm.emit(this.unit.sections);
    this.resetAllStates();
  }

  decreaseSectionNumber(section_index: number) {
    const currentSection = this.unit.sections[section_index];
    const nextSection = this.unit.sections[section_index + 1];

    this.unit.sections[section_index] = nextSection;
    this.unit.sections[section_index + 1] = currentSection;

    this.updateUnitForm.emit(this.unit.sections);
    this.resetAllStates();
  }

  resetAllStates() {
    this.setEditSectionStatus.emit(false);
    this.setTouchedSection.emit(-1);
    this.setShowSectionForm.emit(false);
    this.closeUnitForms.emit(); // cierra formularios de unidad desde el padre
    this.sectionForm.reset();
  }
}
