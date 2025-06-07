import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import 'intro.js/themes/introjs-modern.css';

const IntroTour = () => {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenIntroHome');
    if (!hasSeenTour) {
      const intro = introJs();
      intro.setOptions({
        steps: [
          { intro: '👋 Welcome to GymMate! Let’s take a quick tour.' },
          {
            element: document.querySelector('.hero_section'),
            intro: 'This is our main hero section with a call to action.',
            position: 'right'
          },
          {
            element: document.querySelector('.why_choose_us'),
            intro: 'Learn why to choose us here.',
            position: 'right'
          },
          {
            element: document.querySelector('.services_section'),
            intro: 'Check out our awesome services.',
            position: 'right'
          },
          {
            element: document.querySelector('.pricing_plan'),
            intro: 'Explore pricing options.',
            position: 'right'
          },
        ],
        showProgress: true,
        showBullets: true,
        scrollToElement: false,
        scrollPadding:100,
        scrollTo:'off', 
        positionPrecedence:'',
        disableInteraction: false,
      });

      setTimeout(() => {
        intro.start();
        localStorage.setItem('hasSeenIntroHome', 'true');
      }, 300); 
       intro.oncomplete(() => {
        localStorage.setItem('tourCompleted', 'true');
      });

      intro.onexit(() => {
        localStorage.setItem('tourCompleted', 'true');
      });
    }
  }, []);

  return null;
};

export default IntroTour;
