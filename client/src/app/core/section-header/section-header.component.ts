import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {
  public breadcrumb$: Observable<string>;

  constructor(private bcService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadcrumb$ = this.bcService.breadcrumbs$.pipe(      
      map( breadcrumbs => 
        ( breadcrumbs.length > 0 && 
          breadcrumbs[breadcrumbs.length-1].label !== "Home" &&
          typeof breadcrumbs[breadcrumbs.length-1].label === "string"        
        ) 
        ? breadcrumbs[breadcrumbs.length-1].label as string
        : ""
      )
    )
  }

}
