import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(date: string | undefined, format: string = 'DD/MM/YYYY HH:mm'): string {
    if (!date) return '';
    return dayjs(date).format(format);
  }
}
