import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService)

  Init(){
    
       const userString = localStorage.getItem("user");
    if(!userString) return of(null);
    this.accountService.currentUser.set(JSON.parse(userString))
    
    return of(null)
  }
}
