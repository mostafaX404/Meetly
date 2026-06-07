import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string | null | undefined): number | null {
    if (!value) return null;

    const [year, month, day] = value.split('T')[0].split('-').map(Number);
    if (year < 1900 || !month || !day) return null;

    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() + 1 - month;

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }

    return age >= 0 ? age : null;
  }
}
