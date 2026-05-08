import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { of } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService)
  private likeService = inject(LikesService)
  Init(){
    
       const userString = localStorage.getItem("user");
    if(!userString) return of(null);
    this.accountService.currentUser.set(JSON.parse(userString))
    this.likeService.getLikeIds()
    return of(null)
  }
}
