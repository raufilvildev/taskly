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

    // Animación h1 p y button
    gsap.set('.scroll-header__title', { scale: 1.6, transformOrigin: 'center top' });
    gsap.set('.scroll-header__content', { opacity: 0, y: 200 });
    gsap.set('.scroll-header__buttons', { opacity: 0, y: 100 });

    
    let scrollTL = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-header',
        start: 'top top',
        end: '+=300', 
        scrub: true,
        pin: true
      }
    });

    scrollTL.to('.scroll-header__title', {
      scale: 1,
      ease: 'none'
    }, 0); 
  
    scrollTL.to('.scroll-header__content', {
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, 0.5); 

    
    scrollTL.to('.scroll-header__buttons', {
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, 0.6); 
    
    // Animación arrow
      gsap.to('.scroll-arrow', {
      opacity: 0,
      scale: 0.5,
      scrollTrigger: {
      trigger: '.scroll-header',
      start: 'top top+=10',
      end: '+=10',
      scrub: true,
    }
    });

    // Animación de imagen
    gsap.set('.scroll-zoom', { scale: 0.8, transformOrigin: 'center center' });
  
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
