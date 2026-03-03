import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { User } from '../types/User';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit {
  private accoutService = inject(AccountService)
  private http = inject(HttpClient)
  protected readonly title = signal('Dating APP');
  protected members = signal<User[]>([]) ; 

  async ngOnInit(){
    this.members.set(await this.getMembers())
    this.setCurrentUser()
  }

  setCurrentUser(){
    const userString = localStorage.getItem("user");
    if(!userString) return;
    this.accoutService.currentUser.set(JSON.parse(userString))
  }


 async getMembers (){
  try{
    return firstValueFrom(this.http.get<User[]>("https://localhost:5001/api/members"))
  }catch(err){
    console.log(err)
    throw err;
  }
  }

}
