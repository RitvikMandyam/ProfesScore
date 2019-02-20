import {AbstractControl, ValidatorFn} from '@angular/forms';


export function checkIfNameMatches(items: any[], customCheckFunction?: (item: any, testValue: any) => boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valueExists = items.filter(e => customCheckFunction ? customCheckFunction(e, control.value) :
      e['name'].toLowerCase() === control.value.toLowerCase()).length > 0;
    return valueExists ? null : {'nonExistentValue': {value: control.value}};
  };
}

export function simpleValidator(item: any, testValue: any) {
  return item === testValue;
}
