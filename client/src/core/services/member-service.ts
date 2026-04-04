import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account-service';
import { Member, Photo } from '../../types/member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  baseUrl = environment.baseUrl;
  private http = inject(HttpClient)
  private accountService = inject(AccountService)


  getMembers(){
    return this.http.get<Member[]>(this.baseUrl + "members")
  }

  
  getMember(id:string){
    return this.http.get<Member>(this.baseUrl + "members/"+id)
  }

  getMemberPhotos(id:string){
     return this.http.get<Photo[]>(this.baseUrl + "members/"+ id + "/photos" )
  }

}
