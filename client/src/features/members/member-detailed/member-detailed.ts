import { Component, computed, inject, Signal, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, RouterLinkActive, RouterOutlet, RouterLinkWithHref, Router, NavigationEnd } from '@angular/router';
import { Member } from '../../../types/member';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { filter } from 'rxjs';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterLinkActive, RouterOutlet, RouterLinkWithHref,AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed {
protected memberService = inject(MemberService);
private route = inject(ActivatedRoute);
private router = inject(Router);
private accountService = inject(AccountService)
protected title  =signal<string|undefined>('Profile');
protected isCurrentUser = computed(()=>{
  return this.accountService.currentUser()?.id == this.route.snapshot.paramMap?.get('id');
})

ngOnInit(): void {

  // router resolver : a method to transfer data between router based parent child 
  //  this.route.data.subscribe({
  //   next: data=> this.member.set(data['member']) 
  // }

  this.title.set(this.route.firstChild?.snapshot?.title);

  //get all events that happens in routing then choose the navigationEnd events and listen to them
  //and when it happens it means the page has changed then it excute the next and update the signal value title
  this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
).subscribe({
  next: () => {
    this.title.set(this.route.firstChild?.snapshot?.title)
  }
})
}

loadMember() {
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) return;
  return this.memberService.getMember(id);
}
}
