import React from 'react'
import Carousel from './carousel';
import Welcome_popular from './Welcome_popular';
import Help_need from './help_need';
import Testinomials from './testinomials';
import Mainfooter from '../footer/mainfooter';


function landing() {
  return (
    <div>
          
      
      <div class="page-wrapper">
      <Carousel />
          <Welcome_popular />
          <Help_need />
          <Testinomials />
          <Mainfooter />

          </div>

    </div>
  )
}

export default landing
