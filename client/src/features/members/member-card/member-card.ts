import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink,AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {

  // accept the input from parent member list 
  member = input.required<Member>();

  private likeService = inject(LikesService)

  protected isLiked = computed(()=> this.likeService.likeIds().includes(this.member().id))

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
