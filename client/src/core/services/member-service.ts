import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AccountService } from './account-service';
import { EditableMember, Member, MemberParams, Photo } from '../../types/member';
import { tap } from 'rxjs';
import { PaginationResult } from '../../types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  baseUrl = environment.baseUrl;
  private http = inject(HttpClient)
  private accountService = inject(AccountService)
  editMode = signal(false);
  member = signal<Member | null>(null);
  
getMembers(memberParams: MemberParams) {
    let params = new HttpParams();

    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    params = params.append('orderBy', memberParams.orderBy);
    
    if (memberParams.gender) {
        params = params.append('gender', memberParams.gender);
    }

    return this.http.get<PaginationResult<Member>>(this.baseUrl + 'members', {params}).pipe(tap(()=>{
      
      localStorage.setItem('filters',JSON.stringify(memberParams))

    }
    ));
}

  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + "members/" + id).pipe(tap(
      (res) => {
        this.member.set(res);
      }
    ))
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + "members/" + id + "/photos")
  }

  updateMember(member: EditableMember) {
    return this.http.put(this.baseUrl + 'members', member)
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + 'members/add-photo', formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + `members/set-main-image/${photo.id}`, {}).pipe(
      tap(() => this.updateMemberImageUrl(photo.url))
    );
  }

  updateMemberImageUrl(imageUrl: string) {
    const member = this.member();
    if (member) {
      this.member.set({ ...member, imageUrl });
    }

    const user = this.accountService.currentUser();
    if (user && user.id === member?.id) {
      this.accountService.setCurrentUser({ ...user, imageUrl });
    }
  }


  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + `members/delete-photo/${photoId}`);
  }

}
