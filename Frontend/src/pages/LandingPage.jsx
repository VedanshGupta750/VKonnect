import React from 'react'
import '../App.css'
export default function LandingPage() {
  return (
            <div className='landingPageContainer'>
        <nav>
            <div className='navHeader'>
                <h2>VKonnect</h2>
            </div>
            <div className='navList'>
                <p>Join as Guest</p>
                <p>Register</p>
                <div role='button'>Login</div>
            </div>
        </nav>

        <div className="landingMainContainer">
        <div id='connect'>
            <h2><span style={{color:'#FF9839'}}>Connect</span> & Bringing hearts closer, one call at a time.</h2>
            <p>Cover Distance by VKonnect</p>
            <div id="get-started">
                <a href='/auth'>Get started</a>
            </div>
        </div>
        <div className='mobile-image'>
            <img src='/mobile.png'/>

        </div>
    </div>
    </div>



  )
}
