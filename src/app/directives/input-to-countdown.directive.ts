import { Directive } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: '[appInputToCountdown]'
})
export class InputToCountdownDirective {

  constructor() { }

  private state = new BehaviorSubject({
    seconds: 0,
    minutes: 0,
    hours: 0,
    totalTime: 0
  });

  public obs$ = this.state.asObservable();

  updateState(value, command) {
    let valToNumber = parseInt(value);
    if (valToNumber < 0) valToNumber = 0;
    let update = this.state.value;
    if (command === 'seconds') update.seconds = valToNumber;
    if (command === 'minutes') update.minutes = valToNumber;
    if (command === 'hours') update.hours = valToNumber;
    update.totalTime = this.calculateSeconds(update);
    this.state.next(update);
  }

  calculateSeconds(update) {
    let totalTime = update.seconds;
    totalTime += update.minutes * 60;
    totalTime += (update.hours * 60) * 60;
    return totalTime;
  }

  getSeconds() {
    return this.state.value.seconds;
  }

  getMinutes() {
    return this.state.value.minutes;
  }

  getHours() {
    return this.state.value.hours;
  }

  getTotalSeconds() {
    return this.state.value.totalTime;
  }

}
