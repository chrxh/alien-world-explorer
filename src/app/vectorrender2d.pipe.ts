import {LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import './vector2d';
import {DecimalPipe} from "@angular/common";

@Pipe({
  name: 'vectorRenderer2d'
})

export class VectorRenderer2d implements PipeTransform {
  transform(vector: Vector2d, separator: string, digitsInfo): string {
    const decimalPipe = new DecimalPipe("en-US");
    const sizeXString = decimalPipe.transform(vector.x,digitsInfo);
    const sizeYString = decimalPipe.transform(vector.y,digitsInfo);
    return sizeXString + separator + sizeYString;
  }
}

