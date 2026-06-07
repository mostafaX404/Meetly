import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../types/member';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { StarButton } from "../../../shared/star-button/star-button";
import { DeleteButton } from "../../../shared/delete-button/delete-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService)
  protected accountService = inject(AccountService)
  private router = inject(ActivatedRoute)
  protected photos = signal<Photo[]>([]);
  protected loading = signal<boolean>(false);

  constructor() {
  }


  ngOnInit(): void {
    const id = this.router.parent?.snapshot.paramMap.get('id');
    if (id) {
      this.memberService.getMemberPhotos(id).subscribe({
        next: p => this.photos.set(p.filter(photo => !!photo.url))
      });
    }
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
  this.memberService.editMode.set(false);
  this.loading.set(false);

  this.photos.update(photos => [...photos, photo]);

  if (this.accountService.currentUser()?.imageUrl == null) {
    this.memberService.updateMemberImageUrl(photo.url);
  }
}
        
      ,
      error: error => {
        console.log('Error uploading image: ', error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe();
  }


  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(x => x.id !== photoId))
      }
    })
  }


}
