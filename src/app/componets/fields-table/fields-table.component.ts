import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Field } from 'src/app/core/interfaces/field.interface';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-fields-table',
  templateUrl: './fields-table.component.html',
  styleUrls: ['./fields-table.component.scss'],
})
export class FieldsTableComponent implements OnInit {
  fieldsList: Field[];
  selectedFields: Field[];
  tableForm!: FormGroup;
  changesSubmitted = false;
  mapColors;
  fieldTypeCountsArray!: any;
  addedFields: Field[] = [];
  removedFields: Field[] = [];
  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.fieldsList = this.dataService.getData();
    this.selectedFields = this.fieldsList.filter((field) => field.isChecked);
    this.mapColors = new Map(
      this.fieldsList.map((field) => [field.type, field.color])
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  onChange(e: any, row: Field) {
    row.type = e.value;
  }

  private initForm() : void{
    this.tableForm = this.fb.group({
      selectedFields: this.fb.array([]),
    });

    this.fieldsList.forEach((field) => this.createFormGroup(field));
  }

  private createFormGroup(group: Field): void {
    const formGroup = this.fb.group({
      name: [group.name, Validators.required],
      type: [group.type],
      value: [group.value, Validators.required],
      isChecked: [group.isChecked],
    });

    (this.tableForm.get('selectedFields') as FormArray).push(formGroup);
  }

  // Helper method to get the 'items' FormArray
  get rows() : FormArray{
    return this.tableForm.get('selectedFields') as FormArray;
  }

  rowSelected(e: MatCheckboxChange, field: Field, index: number): void {
    const selectedRow = this.rows.at(index).value as Field;
    field = { ...selectedRow };
    field.color =  this.mapColors.get(field.type) || "";
    field.isChecked = e.checked;
    this.rows.at(index).patchValue({ ...field });
    this.fieldsList[index] = field;
  }

  saveChanges(): void {
    this.changesSubmitted = true;
    this.dataService.storeData(this.rows.value);
    this.handelAfterChangesSubmit();
  }

  private handelAfterChangesSubmit(): void {
    this.dataService.getFields().subscribe(([previous, current]) => {
      this.selectedFields = current.filter(
        (element: Field) => element.isChecked
      );
      this.addColorToSelectedFields();
      this.calcCountOccurrences();
      this.handleAddedAndRemovedField(previous, current);
    }) 
  }

  private addColorToSelectedFields(): void {
    this.selectedFields.forEach((field) => {
      field.color = this.mapColors.get(field.type) || '';
    });
  }
  // Count occurrences of each field type
  private calcCountOccurrences(): void{
    const fieldTypeCounts: { [type: string]: number } = {};
    this.selectedFields.forEach((item) => {
      const type = item.type;
      fieldTypeCounts[type] = (fieldTypeCounts[type] || 0) + 1;
    });
    this.fieldTypeCountsArray = Object.keys(fieldTypeCounts).map((type) => ({
      type,
      count: fieldTypeCounts[type],
    }));
  }

  private handleAddedAndRemovedField(previous: Field[], current: Field[]) {
    previous = previous.filter((prevField) => prevField.isChecked);
    current = current.filter((currField) => currField.isChecked);
    this.removedFields = previous.filter(
      (prevField) =>
        !current.some((currField) => currField.name === prevField.name)
    );

    this.addedFields = current.filter(
      (currField) =>
        !previous.some((prevField) => prevField.name === currField.name)
    );
  }
}
