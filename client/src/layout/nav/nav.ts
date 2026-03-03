import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  protected accounService = inject(AccountService)
  protected creds :any ={};

  login(){
    this.accounService.login(this.creds).subscribe({
      next: result => {
        console.log(result)
        this.creds = {}
      },
      error: err => alert(err.message)
    })

  }

  logout(){
    this.accounService.logout()
  }


}
