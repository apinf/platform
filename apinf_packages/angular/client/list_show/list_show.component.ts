import { Component, OnInit } from '@angular/core';
import template from './list_show.component.ng2.html';

@Component({
  template
})
export class ListShowComponent  implements OnInit  {

  constructor() {

  }

  ngOnInit() {
    console.log('on init, fffff')
  }

  test() {
    alert('rabotaet');
  }
}
