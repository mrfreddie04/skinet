import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface PageChangedEventArgs {
  page: number; 
  itemsPerPage: number;
};

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
  @Input() pageSize: number;
  @Input() totalCount: number;
  @Input() currentPage: number = 1;
  @Output() pageChanged = new EventEmitter<number>();
  
  constructor() {
    console.log(`Current Page: ${this.currentPage}`);
  }

  ngOnInit(): void {
  }

  public onPageChanged(event: PageChangedEventArgs) {
    this.pageChanged.emit(event.page);
  }    
}
