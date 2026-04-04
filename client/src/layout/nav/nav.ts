import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit{
  ngOnInit(): void {
      document.documentElement.setAttribute('data-theme', this.selectedTheme());

  }

  protected accounService = inject(AccountService)
  private router = inject(Router)
  private toast = inject(ToastService)
  protected creds :any ={};
  protected selectedTheme = signal<string>(localStorage.getItem("theme")||"light")
  protected themes = themes

handleSelectTheme(theme: string) {
  this.selectedTheme.set(theme);
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  const elem = document.activeElement as HTMLDivElement;
if (elem) elem.blur()
}

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
