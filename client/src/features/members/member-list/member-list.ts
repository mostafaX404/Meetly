import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { filter, Observable } from 'rxjs';
import { Member, MemberParams } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginationResult } from '../../../types/Pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from "../filter-modal/filter-modal";

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {

  protected memberService = inject(MemberService)
  protected memberParams = new MemberParams()
  protected paginatedMembers = signal<PaginationResult<Member> | null>(null);
  private updatedParams = new MemberParams()
  @ViewChild("filterModal") modal! : FilterModal


  constructor() {
    const filters = localStorage.getItem('filters');
    if(filters){
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }
  ngOnInit(): void {
    this.loadMembers()
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: data => {this.paginatedMembers.set(data)
         console.log('in load members method')
          console.log(data)
        }
         

    });
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber;
    this.loadMembers();
  }


  openModal() {
  this.modal.open();
}

onClose() {
  console.log('Modal closed');
}

onFilterChange(data: MemberParams) {
  this.memberParams = {...data};
  this.updatedParams = {...data}  ;
  this.memberParams.pageNumber = 1; 
  
  this.loadMembers(); 
}
resetFilters() {
  this.memberParams = new MemberParams();
  this.updatedParams = new MemberParams();
  this.loadMembers();
}

get displayMessage(): string {
  const defaultParams = new MemberParams();
  const filters: string[] = [];

  if (this.updatedParams.gender) {
    filters.push(this.memberParams.gender + 's')
  } else {
    filters.push('Males, Females');
  }

  if (this.updatedParams.minAge !== defaultParams.minAge 
    || this.updatedParams.maxAge !== defaultParams.maxAge) {
    filters.push(` ages ${this.memberParams.minAge}-${this.memberParams.maxAge}`)
  }

  filters.push(this.updatedParams.orderBy === 'lastActive' 
    ? 'Recently active' : 'Newest members');

  return filters.length > 0 ? `Selected: ${filters.join(' | ')}` : 'All members'
}


}
