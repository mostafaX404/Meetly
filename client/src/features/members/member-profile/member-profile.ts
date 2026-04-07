import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})


export class MemberProfile implements OnInit, OnDestroy {

  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  @ViewChild('editForm') editForm?: NgForm;
  protected memberService = inject(MemberService)
  private toast = inject(ToastService);
  private accountService = inject(AccountService);

  protected editableMember: EditableMember = {
    displayName: "",
    description: "",
    city: "",
    country: ""
  };



  ngOnInit(): void {

  //access current activatd route details , then the parent of it , then access the shared data by reslover 
  //then sets this data to the member signal then automatically the form data changes due the attribute binding 
  //all thin during OnInit  
    
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || "",
      description: this.memberService.member()?.description || "",
      city: this.memberService.member()?.city || "",
      country: this.memberService.member()?.country || ""
    }

  }

  updateProfile() {
    if (!this.memberService.member()) return;

    const updatedMember = { ...this.memberService.member(), ...this.editableMember };
    const currentUser = this.accountService.currentUser();
    if(currentUser && currentUser.displayName != updatedMember.displayName){
      currentUser.displayName = updatedMember.displayName;
      this.accountService.currentUser.set(currentUser);
    }
    
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully');
        this.memberService.editMode.set(false);
        this.editForm?.reset(this.editableMember);
        this.memberService.member.set(updatedMember as Member)
      }
    })

  }


  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
