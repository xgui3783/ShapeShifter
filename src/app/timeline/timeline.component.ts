import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
  AnimatorService,
  StateService,
  MorphabilityStatus,
} from '../services';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent implements OnInit, OnDestroy {
  MORPHABILITY_NONE = MorphabilityStatus.None;
  MORPHABILITY_UNMORPHABLE = MorphabilityStatus.Unmorphable;
  MORPHABILITY_MORPHABLE = MorphabilityStatus.Morphable;
  morphabilityStatusObservable: Observable<MorphabilityStatus>;
  isAnimationSlowMotionObservable: Observable<boolean>;
  isAnimationPlayingObservable: Observable<boolean>;
  isAnimationRepeatingObservable: Observable<boolean>;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly stateService: StateService,
    private readonly animatorService: AnimatorService,
  ) { }

  ngOnInit() {
    this.isAnimationSlowMotionObservable =
      this.animatorService.getTimelineObservable()
        .map((value: { isSlowMotion: boolean }) => value.isSlowMotion);
    this.isAnimationPlayingObservable =
      this.animatorService.getTimelineObservable()
        .map((value: { isPlaying: boolean }) => value.isPlaying);
    this.isAnimationRepeatingObservable =
      this.animatorService.getTimelineObservable()
        .map((value: { isRepeating: boolean }) => value.isRepeating);
    this.morphabilityStatusObservable =
      this.stateService.getMorphabilityStatusObservable();
    this.subscriptions.push(
      this.stateService.getMorphabilityStatusObservable()
        .subscribe(status => {
          if (status !== MorphabilityStatus.Morphable) {
            this.animatorService.rewind();
          }
        }));
    // TODO: pause animations when window becomes inactive?
    // document.addEventListener('visibilitychange', function() {
    //   console.log(document.hidden);
    // });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  setIsSlowMotion(isSlowMotion: boolean) {
    this.animatorService.setIsSlowMotion(isSlowMotion);
  }

  onPlayPauseButtonClick() {
    this.animatorService.toggle();
  }

  onRewindClick() {
    this.animatorService.rewind();
  }

  onFastForwardClick() {
    this.animatorService.fastForward();
  }

  setIsRepeating(isRepeating: boolean) {
    this.animatorService.setIsRepeating(isRepeating);
  }

  isSlowMotion() {
    return this.animatorService.isSlowMotion();
  }

  isRepeating() {
    return this.animatorService.isRepeating();
  }
}
