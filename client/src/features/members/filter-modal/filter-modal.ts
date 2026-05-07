import { Component, ElementRef, model, output, ViewChild, viewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css',
})
export class FilterModal {

  @ViewChild("filterModal") modal! : ElementRef<HTMLDialogElement>
  closeModal = output()
  submitedData = output<MemberParams>()
  memberParams = model(new MemberParams())

  constructor() {
   
  }

  open(){
    this.modal.nativeElement.showModal()
     const filters = localStorage.getItem('filters');
    if(filters){
      this.memberParams.set(JSON.parse(filters));
    }
  }

  close(){
    this.modal.nativeElement.close()
    this.closeModal.emit()
  }

  submit(){
    this.submitedData.emit(this.memberParams())
    this.close()
  }

  onMinAgeChange() {
  if (this.memberParams().minAge < 18) this.memberParams().minAge = 18;
}

onMaxAgeChange() {
  if (this.memberParams().maxAge < this.memberParams().minAge) {
     this.memberParams().maxAge = this.memberParams().minAge;
  }
}


}
