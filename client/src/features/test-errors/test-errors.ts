import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-errors',
  imports: [CommonModule],
  templateUrl: './test-errors.html',
  styleUrl: './test-errors.css',
})
export class TestErrors {

  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = "https://localhost:5001/api/"
  validationErrors = signal<string[]>([]);
  
   get404Error(){
    this.http.get(this.baseUrl + "buggy/not-found").subscribe({
      next : resopnse =>console.log(resopnse),
      error: err=>console.log(err)
    })}

    get401Error(){
    this.http.get(this.baseUrl + "buggy/auth").subscribe({
      next : resopnse =>console.log(resopnse),
      error: err=>console.log(err)
    })}

    get400ValidationError(){
    this.http.post(this.baseUrl + "account/register",{}).subscribe({
      next : resopnse =>console.log(resopnse),
      error: err=>{console.log(err)
         this.validationErrors.set(err)
        console.log(this.validationErrors())
      }
    })}


    get500Error(){
    this.http.get(this.baseUrl + "buggy/server-error").subscribe({
      next : resopnse =>console.log(resopnse),
      error: err=>console.log(err)
    })}

     get400Error(){
    this.http.get(this.baseUrl + "buggy/bad-request").subscribe({
      next : resopnse =>console.log(resopnse),
      error: err=>{console.log(err)
      }
    })}


}
