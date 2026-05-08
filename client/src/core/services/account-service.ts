import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/User';
import { tap } from 'rxjs';
import { LikesService } from './likes-service';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  
  private http = inject(HttpClient);
  private likeService = inject(LikesService)
  currentUser = signal<User | null>(null);
 baseUrl = "https://localhost:5001/api/"

  register(creds : RegisterCreds){
    return this.http.post<User>(this.baseUrl+"account/register",creds).pipe(
    tap(user => {
      if (user) {
        this.setCurrentUser(user)
      }
    })
  )
  }

  login(creds: any) {
  return this.http.post<User>(this.baseUrl + 'account/login', creds).pipe(
    tap(user => {
      if (user) {
        this.setCurrentUser(user)
      }
    })
  )
}

setCurrentUser(user:User){
    localStorage.setItem("user",JSON.stringify(user))
    this.currentUser.set(user)
    this.likeService.getLikeIds()
}

logout() {
  localStorage.removeItem("user")
  localStorage.removeItem("filters")
  this.likeService.clearLikeIds()
  this.currentUser.set(null);
}

}
