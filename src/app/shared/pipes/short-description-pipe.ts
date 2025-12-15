import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortDescription'
})
export class ShortDescriptionPipe implements PipeTransform {

   transform(
    value: string | null | undefined,
    maxLength: number = 15
  ): string {
    if (!value) {
      return '';
    }

    const safeMax = Number.isFinite(maxLength) && maxLength > 0
      ? Math.floor(maxLength)
      : 15;

    if (value.length <= safeMax) {
      return value;
    }

    //no cortar palabras
    const slice = value.slice(0, safeMax);
    const lastSpace = slice.lastIndexOf(' ');

    const base =
      lastSpace > safeMax * 0.6
        ? slice.slice(0, lastSpace)
        : slice;

    return base.trimEnd() + '…';
  }

}
