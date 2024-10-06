import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {

  transform(array: any[], chunkSize: number): any[] {
    if (!array.length) {
      return [];
    }
    return array.reduce((acc, _, i) => {
      if (i % chunkSize === 0) {
        acc.push(array.slice(i, i + chunkSize));
      }
      return acc;
    }, []);
  }

}
