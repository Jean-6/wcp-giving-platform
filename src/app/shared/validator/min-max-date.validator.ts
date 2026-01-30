import {AbstractControl, ValidationErrors} from '@angular/forms';



export function minMaxDateValidator(control: AbstractControl): ValidationErrors | null {

  const min = control.get('minDate')?.value;
  const max = control.get('maxDate')?.value;

  if (!min || !max ) return null;

  const minDate = new Date(min);
  const maxDate = new Date(max);

  return minDate > maxDate ? { minGreaterThanMax: true} : null;

}
