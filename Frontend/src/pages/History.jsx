import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { useAuth } from "../context/AuthContext.jsx";
import { IconButton } from "@mui/material";
import '../styles/History.css'


export default function History() {
  const { getHistoryOfUser } = useAuth();

  const [meetings, setMeetings] = useState([]);

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        console.log(e);
      }
    };

    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="historyContainer">
      <div className="historyHeader">
        <IconButton onClick={() => routeTo("/home")} className="homeButton">
          <HomeIcon />
        </IconButton>
      </div>

      {Array.isArray(meetings) && meetings.length > 0 ? (
        <div className="historyGrid">
          {meetings.map((e, i) => (
            <Card key={i} className="historyCard">
              <CardContent>
                <Typography className="meetingCode">
                  Code: {e.meetingCode}
                </Typography>

                <Typography className="meetingDate">
                  Date: {formatDate(e.date)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="noData">No meetings found</div>
      )}
    </div>
  );
}
