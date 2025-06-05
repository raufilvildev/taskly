import { AfterViewInit, Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, FeaturesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    
    gsap.registerPlugin(ScrollTrigger);

  
    gsap.to('.scroll-zoom', {
      scale: 1.3,        
      y: 100,         
      scrollTrigger: {
        trigger: '.scroll-zoom',
        start: 'top bottom',    
        end: 'bottom bottom',  
        scrub: true,           
        markers: false          
      }
    });
  }
}
