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
                   const route =Math.random().toString(36).substring(2, 8);
                    routeTo(`/${route}`);

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
            <div id="get-started" role='button' onClick={()=> routeTo('/auth')}>
                Get started
            </div>
        </div>
        <div className='mobile-image'>
            <img src='/mobile.png'/>

        </div>
    </div>
    </div>



  )
}
