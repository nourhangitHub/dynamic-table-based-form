import { Component, Input, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent implements OnChanges, ControlValueAccessor, Validator {

  @Input() fieldType: any;
  input!: any;
  inputControl!: FormControl;
  errorMessage: string | null = null;
  showError: boolean = false;
  onChange: any = () => {};
  onTouch: any = () => {};


  ngOnChanges(changes: SimpleChanges): void {
    this.input = null;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(input: string) {
    if (this.fieldType === 'date') {
      this.input = new Date(input);
    } else {
      this.input = input;
    }
  }

  validate(control: FormControl) {
    this.inputControl = control;
    if (
      control.value &&
      this.fieldType === 'email' &&
      !this.isValidEmail(control.value)
    ) {
      this.errorMessage = 'Invalid email format';
      return { invalidEmail: true };
    }

    return null;
  }
  

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  

  public onBlur(): void {
    this.onTouch();
  }

  
}
