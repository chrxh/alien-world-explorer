import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from "@angular/common";

@Pipe({
  name: 'numberArrayRenderer'
})

export class NumberArrayRenderer implements PipeTransform {
  transform(vector: number[], separator: string, digitsInfo): string {
    const decimalPipe = new DecimalPipe("en-US");
    const sizeXString = decimalPipe.transform(vector[0], digitsInfo);
    const sizeYString = decimalPipe.transform(vector[1], digitsInfo);
    return sizeXString + separator + sizeYString;
  }
}

