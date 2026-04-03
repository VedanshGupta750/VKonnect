import React, { useState } from 'react';
import withAuth from '../utils/Auth';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import RestoreIcon from '@mui/icons-material/Restore';
import Button from '@mui/material/Button';
import styles from '../styles/homeComponent.module.css';

function HomeComponent() {
  let navigate = useNavigate();

const [meetingCode , setMeetingCode] = useState("");
let handleJoinVideoCall = async () =>{
  navigate(`/${meetingCode}`);
} 

  return (
    <>
{/* NavBar */}

    <div className={styles.navBar}>
      <div style={{display: "flex" , alignItems:"center"}}>
        <h2>VKonnect</h2>
      </div>

      <div style={{display : "flex", alignItems:"centre"}}>
      <IconButton> 
        <RestoreIcon/>
        <p>History</p>
      </IconButton>
      <Button onClick={()=>{
        localStorage.removeItem('token');
        navigate('/auth');
      }}>Logout</Button>
      </div>
    </div>

    {/* Meet Container */}
    </>
  )
}

export default withAuth(HomeComponent);