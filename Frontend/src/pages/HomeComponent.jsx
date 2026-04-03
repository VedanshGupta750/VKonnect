import React, { useContext, useState } from "react";
import withAuth from "../utils/Auth";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import styles from "../styles/homeComponent.module.css";
import { useAuth } from "../context/AuthContext.jsx";

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const {addToUserHistory} = useAuth();

  const handleJoinVideoCall = async() => {
    if (!meetingCode.trim()) return;
    const response = await addToUserHistory(meetingCode)
    if (response?.success) {
      console.log("Added to history");
    } else {
      console.log("Not added:", response?.message);
    }
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      {/* NavBar */}
      <div className={styles.navBar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>VKonnect</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IconButton onClick={()=>{
            navigate("/history")
          }}>
            <RestoreIcon />
            <span style={{ color: "white", fontSize: "14px" }}>History</span>
          </IconButton>

          <Button
            variant=""
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Meet Container */}
      <div className={styles.meetContainer}>
        <div className={styles.leftPanel}>
          <h2>Start your meeting in seconds.</h2>

          <div className={styles.inputRow}>
            <TextField
              variant="outlined"
              placeholder="Enter Meeting Code"
              fullWidth
              onChange={(e) => setMeetingCode(e.target.value)}
            />

            <Button variant="contained" onClick={handleJoinVideoCall}>
              Join
            </Button>

            <Button
              variant="outlined"
              onClick={async () => {
                const code = Math.random().toString(36).substring(2, 8);
                navigate(`/${code}`);
              await addToUserHistory(code);
              }}
            >
              New Meeting
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default withAuth(HomeComponent);
