import { Component, inject, signal } from '@angular/core';
import { MessageService } from '../../core/services/message-service';
import { PaginationResult } from '../../types/Pagination';
import { Message } from '../../types/MessageType';
import { Paginator } from '../../shared/paginator/paginator';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [Paginator , RouterLink , DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {


    private messageService = inject(MessageService);
    protected container = 'Inbox';
    protected fetchedContainer = 'Inbox';
    protected pageNumber = 1;
    protected pageSize = 10;
    protected paginatedMessages = signal<PaginationResult<Message> | null>(null);

    tabs = [
    {label: 'Inbox', value: 'Inbox'},
    {label: 'Outbox', value: 'Outbox'},
    ]


    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages() {
        this.messageService.getMessages(this.container, this.pageNumber, this.pageSize).subscribe({
            next: response => {this.paginatedMessages.set(response)
                this.fetchedContainer = this.container
            }
        })
    }

    
    get isInbox() {
    return this.fetchedContainer === 'Inbox';
        }

setContainer(container: string) {
    this.container = container;
    this.loadMessages();
}

onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageNumber;
    this.loadMessages();
}

deleteMessage(event: Event,id: string) {
  this.messageService.deleteMessage(id).subscribe({
    next: () => {
      this.paginatedMessages.update(prev => {
        if (!prev) return null;

        const newItems = prev.items.filter(m => m.id !== id);

        const newTotalCount = prev.metaData.totalCount - 1;

        const newTotalPages = Math.max(
          1,
          Math.ceil(newTotalCount / prev.metaData.pageSize)
        );

        const newCurrentPage = Math.min(
          prev.metaData.currentPage,
          newTotalPages
        );

        return {
          items: newItems,
          metaData: {
            ...prev.metaData,
            totalCount: newTotalCount,
            totalPages: newTotalPages,
            currentPage: newCurrentPage
          }
        };
      });
    }
  });
}
}