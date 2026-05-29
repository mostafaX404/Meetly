import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PaginationResult } from '../../types/Pagination';
import { environment } from '../../environments/environment';
import { Message } from '../../types/MessageType';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { AccountService } from './account-service';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private baseUrl = environment.baseUrl;
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  private hubConnection?: HubConnection;
  
  messageThread = signal<Message[]>([]);

  createHubConnection(otherUserId: string) {
    const currentUser = this.accountService.currentUser();
    if (!currentUser) return;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'messages?userId=' + otherUserId, {
        accessTokenFactory: () => currentUser.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

// Fix BOTH handlers - change currentUsersSender to currentUserSender
this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
  this.messageThread.set(messages.map(message => ({
    ...message,
    currentUserSender: message.senderId === currentUser.id  
  })));
});

this.hubConnection.on('NewMessage', (message: Message) => {
  this.messageThread.update(messages => [...messages, {
    ...message,
    currentUserSender: message.senderId === currentUser.id  
  }]);
});



    // this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
    //   this.messageThread.set(messages.map(message => ({
    //     ...message,
    //     currentUsersSender: message.senderId !== currentUser.id
    //   })));
    // });

    // this.hubConnection.on('NewMessage', (message: Message) => {
    //   this.messageThread.update(messages => [...messages, {
    //     ...message,
    //     currentUsersSender: message.senderId !== currentUser.id
    //   }]);
    // });


  
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    params = params.append('container', container);

    return this.http.get<PaginationResult<Message>>(this.baseUrl + 'message', { params });
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + memberId);
  }

sendMessage(recipientId: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', {recipientId, content});
}
  deleteMessage(id: string) {
    return this.http.delete(this.baseUrl + 'message/' + id);
  }
}