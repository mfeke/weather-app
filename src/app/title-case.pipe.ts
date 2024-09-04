import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase'
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string, excludeWords: string[] = []): string {
    if (!value) return '';

    // Split the string into words
    let words = value.split(' ');

    // Filter out unwanted words
    words = words.filter(word => !excludeWords.includes(word.toLowerCase()));

    // Capitalize each word
    words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

    // Join the words back into a string
    return words.join(' ');
  }

}
