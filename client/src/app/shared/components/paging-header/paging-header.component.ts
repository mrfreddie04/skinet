import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paging-header',
  templateUrl: './paging-header.component.html',
  styleUrls: ['./paging-header.component.scss']
})
export class PagingHeaderComponent implements OnInit {
  @Input() pageNumber: number;
  @Input() pageSize: number;
  @Input() totalCount: number;

  constructor() { }

  ngOnInit(): void {
  }

  public get currentRange(): string {
    const from = (this.pageNumber - 1) * this.pageSize + 1;
    const to = this.pageNumber * this.pageSize > this.totalCount ? this.totalCount : this.pageNumber * this.pageSize;
    return from.toString()+"-"+to.toString();
  }  
}
