import { Injectable, signal } from '@angular/core';
import { max } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusyService {

  busyCounter = signal(0)

  Busy(){
    this.busyCounter.update(v =>v + 1)
  }

  Idle(){
    this.busyCounter.update(v=>Math.max(0 , v -1 ))
  }

}
