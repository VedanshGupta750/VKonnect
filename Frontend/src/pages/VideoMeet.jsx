import React, { useEffect, useRef, useState } from "react";
import "../styles/VideoMeet.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client"; 

const serverUrl = "http://localhost:5000";

let connections = {};

const peerToPeerConnections = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, // public stun server
  ],
};
function VideoMeet() {
  // for which socket it is for
  let socketRef = useRef();
  //when user connect the chat it is for that(further we'll use this for chatting purpose)
  let socketIDRef = useRef();
  //we will se our video with the help of this
  let localVideoRef = useRef();

  //for permission access of video
  let [videoAvailable, setVideoAvailable] = useState(true);
  // for permission access of MIC
  let [audioAvailable, setAudioAvailable] = useState(true);

  //for turning on/Off video button
  let [video, setVideo] = useState();
  //for turning on/Off audio Button
  let [audio, setAudio] = useState();

  //for screenSharing
  let [screenAvailable, setScreenAvailable] = useState();
  // for popup
  let [showModel, setShowModel] = useState();

  // for checking is screenShare available
  let [screenShare, setScreenShare] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessage, setNewMessage] = useState(0);

  let [askForUserName, setAskForUserName] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    try {
      const videoPermissions = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermissions) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }
      const audioPermissions = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermissions) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          audio: audioAvailable,
          video: videoAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;  // initialize stream
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  let getUserMediaSuccess = (stream)=>{

  }

  let getUserMedia = ()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
      navigator.mediaDevices.getUserMedia({
        video: video,
        audio: audio,
      }).then(getUserMediaSuccess) // This is the function if you press I mute audio it will mute your audio from everyone and it will off your video from everyone if you press video button
      .then((stream)=>{})
      .catch((e)=> console.log(e));
    }else{
      try{
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop())
      }catch (e){

      }
    }
  }
  useEffect(()=>{
    if(video !==undefined && audio!== undefined){
      getUserMedia();
    }
  },[audio , video]);

  let connectToSocketServer = ()=>{
    socketRef.current = io.connect(serverUrl , {secure : false});
  }

  let getMedia =()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  }
  useEffect(() => {
    getPermissions();
  }, []);

  let connect = ()=>{
    setAskForUserName(false); //true-->show lobby  false-->show meeting
    getMedia();
  }
  return (
    <div>
      {askForUserName === true ? (
        <div>
          <h2>Enter into Lobby</h2>

          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={connect}>connect</Button>

          <div>
            <video ref={localVideoRef} muted autoPlay></video>
          </div>
        </div>
      ) :  (
        <></>
      )}
    </div>
  );
}

export default VideoMeet;
