import { Component, Output, EventEmitter, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchName = ''

  @Output() searchNameClick: EventEmitter<string> = new EventEmitter<string>();

  onButtonClick() {
    this.searchNameClick.emit(this.searchName);
    // const offcanvasElement = this.el.nativeElement.querySelector('#offcanvasExample');
    // this.renderer.removeClass(offcanvasElement, 'show');
  }
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  closeOffcanvas() {
  
  }
}
