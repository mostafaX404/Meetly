import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/User';
import { tap } from 'rxjs';
import { LikesService } from './likes-service';
import { PresenceService } from './presence-service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  
  private http = inject(HttpClient);
  private likeService = inject(LikesService)
  private presenceService = inject(PresenceService)
  currentUser = signal<User | null>(null);
  private refreshInterval: ReturnType<typeof setInterval> | null = null;

 baseUrl = "https://localhost:5001/api/"

  register(creds : RegisterCreds){
    return this.http.post<User>(this.baseUrl+"account/register",creds , {withCredentials:true}).pipe(
    tap(user => {
      if (user) {
        this.setCurrentUser(user)
        this.startTokenRefreshInterval()
      }
    })
  )
  }

  login(creds: any) {
  return this.http.post<User>(this.baseUrl + 'account/login', creds , {withCredentials:true}).pipe(
    tap(user => {
      if (user) {
        this.setCurrentUser(user)
        this.startTokenRefreshInterval()
      }
    })
  )
}

setCurrentUser(user:User){
    user.roles = this.getRolesFromToken(user)
    this.currentUser.set(user)
    this.likeService.getLikeIds()
    if(this.presenceService.hubConnection?.state != HubConnectionState.Connected){
        this.presenceService.createHubConnection(user);
    }
}


startTokenRefreshInterval() {
 this.refreshInterval =   setInterval(() => {
        this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, 
            {withCredentials: true}).subscribe({
                next: user => {
                    this.setCurrentUser(user)
                },
                error: () => {
                    this.logout()
                }
            })
    }, 5 * 60* 1000)
}

logout() {

   if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
    }
  this.http.post(this.baseUrl + 'account/logout', {}, { withCredentials: true }).subscribe({
    next: () => {
      localStorage.removeItem('filters');
      this.likeService.clearLikeIds();
      this.currentUser.set(null);
      this.presenceService.stopHubConnection();
    }
  })
}

refreshToken() {
    return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, 
        {withCredentials: true})
}

private getRolesFromToken(user: User): string[] {
    const payload = user.token.split('.')[1];
    const decoded = atob(payload);
    const jsonPayload = JSON.parse(decoded);
    return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role];
}



}
