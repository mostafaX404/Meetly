import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink,AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {

  // accept the input from parent member list 
private likeService = inject(LikesService);
    private presenceService = inject(PresenceService);
    member = input.required<Member>();

    protected hasLiked = computed(() => 
        this.likeService.likeIds().includes(this.member().id));

    protected isOnline = computed(() => 
    this.presenceService.onlineUsers()
        .includes(this.member().id.toString())); // add .toString()

 toggleLike(event: Event) {
    event.stopPropagation();
    const memberId = this.member().id;

    this.likeService.toggleLike(memberId).subscribe({
      next: () => {
        this.likeService.likeIds.update(ids => 
          ids.includes(memberId) 
            ? ids.filter(id => id !== memberId) 
            : [...ids, memberId] 
        );
      }
    });
  }

}
