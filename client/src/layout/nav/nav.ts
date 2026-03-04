import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  protected accounService = inject(AccountService)
  private router = inject(Router)
  private toast = inject(ToastService)
  protected creds :any ={};

  login(){
    this.accounService.login(this.creds).subscribe({
      next: result => {
        this.router.navigateByUrl('/members')
        this.toast.success("Logged in succesfully")
        this.creds = {}
      },
      error: err=> {
        this.toast.error(err.error)
      }
    })

  }

  logout(){
    this.router.navigateByUrl('/')
    this.accounService.logout()
  }


}
