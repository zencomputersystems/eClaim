import { Component } from '@angular/core';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  text: string;

  constructor() {
    console.log('Called Menu Component');
    this.text = 'Hello World from a menu component';
  }

}

export interface MenuInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  order?: number;
  access?: string[];
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}
