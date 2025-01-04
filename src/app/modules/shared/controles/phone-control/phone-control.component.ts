import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { COUNTRY_CODES } from 'src/assets/country-codes';

@Component({
  selector: 'app-phone-control',
  templateUrl: './phone-control.component.html',
  styleUrls: ['./phone-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PhoneControlComponent,
      multi: true
    }
  ]
})
export class PhoneControlComponent implements ControlValueAccessor, OnDestroy {
  numberPrefixControl = new FormControl('', [Validators.required]);
  numberControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(12),
    Validators.pattern(/^\+?\d+$/)
  ]);
  sub = new Subscription();
  countryCodes = COUNTRY_CODES;
  selectedCode = '';

  constructor() {
    this.sub.add(
      combineLatest([
        this.numberPrefixControl.valueChanges,
        this.numberControl.valueChanges
      ]).subscribe(([prefix, number]) => {
        if (prefix && number) {
          this.onChange(`${prefix}${number}`);
        } else {
          this.onChange(null);
        }
      })
    );
  }

  onChange = (value: string | null) => {};

  onTouch = () => {};

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.numberControl.disable();
      this.numberPrefixControl.disable();
    } else {
      this.numberControl.enable();
      this.numberPrefixControl.enable();
    }
  }

  writeValue(value: string): void {
    if (value) {
      const valueWithoutPlus = value.startsWith('+') ? value.slice(1) : value;
      const matchedCode = this.countryCodes.find((country) =>
        valueWithoutPlus.startsWith(country.code.replace('+', ''))
      );

      if (matchedCode) {
        const prefixLength = matchedCode.code.replace('+', '').length;
        const prefix = valueWithoutPlus.slice(0, prefixLength);
        const number = valueWithoutPlus.slice(prefixLength);

        this.numberPrefixControl.setValue(matchedCode.code);
        this.numberControl.setValue(number);
      } else {
        console.warn('No matching area code found for the number:', value);
        this.numberPrefixControl.setValue('');
        this.numberControl.setValue(value);
      }
    } else {
      this.numberPrefixControl.setValue('');
      this.numberControl.setValue('');
    }
  }

  formatSelectedValue(code: string): string {
    return code;
  }

  onCountryChange(selectedCode: string): void {
    this.selectedCode = selectedCode;
    this.numberPrefixControl.setValue(selectedCode);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
