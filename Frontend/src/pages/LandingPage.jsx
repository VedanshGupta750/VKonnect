import React from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
export default function LandingPage() {

    const routeTo = useNavigate();
  return (
            <div className='landingPageContainer'>
        <nav>
            <div className='navHeader'>
                <h2>VKonnect</h2>
            </div>
            <div className='navList'>
                <p onClick={()=>{
                    routeTo('/a2d4e');
                }}>Join as Guest</p>
                <p onClick={()=>{
                    routeTo('/auth');
                }}>Register</p>
                <div role='button' onClick={()=>{
                    routeTo('/auth');
                }}>Login</div>
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
