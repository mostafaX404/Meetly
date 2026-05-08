import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../../types/member';
import { PaginationResult } from '../../types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  
  private http = inject(HttpClient);
  baseUrl = environment.baseUrl
  public likeIds = signal<string[]>([]);


  toggleLike(targetId : string){

    return this.http.post(`${this.baseUrl}`+`likes/`+targetId,{});
  }

getLikes(predicate: string, pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);
  params = params.append('predicate', predicate);

  return this.http.get<PaginationResult<Member>>(this.baseUrl + 'likes', {params});
}

 getLikeIds(){
  return this.http.get<string[]>(`${this.baseUrl}`+`likes/list`).subscribe({
    next : data =>{
      this.likeIds.set(data)
    }
  })
 }

clearLikeIds(){
  this.likeIds.set([]);
}

}
