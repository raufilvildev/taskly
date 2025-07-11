import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatText',
})
export class FormatTextPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\\n/g, '\n');
  }
}
