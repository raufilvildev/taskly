// home.component.ts
import {
  AfterViewInit,
  Component,
  ViewChild,
  NgZone
} from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { AdvantagesShowcaseComponent } from './components/advantages-showcase/advantages-showcase.component';
import { CallToActionComponent } from './components/call-to-action/call-to-action.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturesComponent, AdvantagesShowcaseComponent, CallToActionComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements AfterViewInit {
  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      gsap.registerPlugin(ScrollTrigger);
    });
  }
}