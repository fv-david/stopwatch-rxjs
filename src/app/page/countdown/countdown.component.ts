import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

import { mapTo, scan, switchMap, takeUntil } from 'rxjs/operators';

import { InputToCountdownDirective } from 'src/app/directives/input-to-countdown.directive';
import { fromEvent, interval, of, merge } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, AfterViewInit {

  faPlay = faPlay;
  faPause = faPause;
  faSquare = faSquare;

  @ViewChild('start', { static: true })
  startBtn: ElementRef;

  @ViewChild('pause', { static: true })
  pauseBtn: ElementRef;

  @ViewChild('reset', { static: true })
  resetBtn: ElementRef;

  intervalObs$;

  constructor(public d: InputToCountdownDirective) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    const start$ = fromEvent(this.startBtn.nativeElement, 'click').pipe(mapTo(true));
    const pause$ = fromEvent(this.pauseBtn.nativeElement, 'click').pipe(mapTo(false));
    const reset$ = fromEvent(this.resetBtn.nativeElement, 'click').pipe(mapTo(null));

    const stateChange$ = this.d.obs$.pipe(mapTo(null));

    this.intervalObs$ = merge(start$, pause$, reset$, stateChange$).pipe(
      switchMap(isCounting => {
        if (isCounting === null) return of(null);
        return isCounting ? interval(1000) : of();
      }),
      scan((accumulatedValue, currentValue) => {
        if (accumulatedValue === 0) return accumulatedValue;
        if (currentValue === null || !accumulatedValue) return this.d.getTotalSeconds();
        return --accumulatedValue;
      })
    );
  }
}
