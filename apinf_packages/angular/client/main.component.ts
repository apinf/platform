import 'reflect-metadata';

// Angluar packages import
import { Component } from '@angular/core';

@Component({
  selector: 'app',
  template: '<router-outlet></router-outlet>'
})
export class MainComponent {
  constructor() {

  }
}
