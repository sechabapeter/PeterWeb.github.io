import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], txtName: string): any[] {

    if (!items) {
      return [];
    }
    if (!txtName) {
      return items;
    }
    txtName = txtName.toLocaleLowerCase();

    return items.filter(it => {
      return it.toLocaleLowerCase().includes(txtName);
    });
  }
}
