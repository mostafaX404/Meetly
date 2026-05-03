import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account-service';
import { EditableMember, Member, Photo } from '../../types/member';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  baseUrl = environment.baseUrl;
  private http = inject(HttpClient)
  private accountService = inject(AccountService)
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + "members")
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

  setMainPhoto(photo:Photo){
    return this.http.put(this.baseUrl + `members/set-main-image/${photo.id}`,{});
  }


  deletePhoto(photoId: number) {
  return this.http.delete(this.baseUrl + `members/delete-photo/${photoId}`);
}

}
