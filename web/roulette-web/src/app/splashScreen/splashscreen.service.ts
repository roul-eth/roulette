import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

@Injectable()
export class SplashScreenService {
   subject = new Subject();
   subscribe(onNext:any): Subscription {
      return this.subject.subscribe(onNext);
   }
   stop() {
      this.subject.next(false);
   }
   start() {
      this.subject.next(true);
   }
}