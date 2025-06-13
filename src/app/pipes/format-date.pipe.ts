import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(date: string | Date, format: string = 'DD/MM/YYYY HH:mm'): string {
    return dayjs(date).format(format);
  }
}
