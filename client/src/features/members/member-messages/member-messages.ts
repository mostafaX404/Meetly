import { Component, effect, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { MessageService } from '../../../core/services/message-service';
import { Message } from '../../../types/MessageType';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [TimeAgoPipe , DatePipe , FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnDestroy {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef
protected messageService = inject(MessageService);
private memberService = inject(MemberService);
private route = inject(ActivatedRoute)
protected presenceService = inject(PresenceService)
protected messageContent = '';

constructor() {
    effect(() => {
        const currentMessages = this.messageService.messageThread();
        if (currentMessages.length > 0) {
            this.scrollToBottom();
        }
    })
}
    ngOnDestroy(): void {
        this.messageService.stopHubConnection()
    }


ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
        next: params => {
            const otherUserId = params.get('id');
            if (!otherUserId) throw new Error('Cannot connect to hub');
            this.messageService.createHubConnection(otherUserId);
        }
    })
}

loadMessages() {
    const memberId = this.memberService.member()?.id;
    if (memberId) {
        this.messageService.getMessageThread(memberId).subscribe({
            next: messages => this.messageService.messageThread.set(messages.map(message => ({
              ...message,
              currentUserSender : message.senderId !== memberId
            })))
        })
    }
}

sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;

    this.messageService.sendMessage(recipientId, this.messageContent)?.then(() => {
        this.messageContent = '';
    })
}


scrollToBottom() {
    setTimeout(() => {
        if (this.messageEndRef) {
            this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' })
        }
    })
}
}
