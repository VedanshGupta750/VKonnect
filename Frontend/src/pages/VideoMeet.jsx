import React, { useRef, useState } from 'react'


const serverUrl ="http://localhost:8000";

let connections ={};

const peerToPeerConnections = {
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"} // public stun server
    ]
}
function VideoMeet() {

  // for which socket it is for
  let socketRef = useRef();
  //when user connect the chat it is for that(further we'll use this for chatting purpose)
  let socketIDRef = useRef();
  //we will se our video with the help of this
  let localVideo = useRef();

  //for permission access of video
  let [videoAvailable , setVideoAvailable] = useState(true);
  // for permission access of MIC
  let [audioAvailable , setAudioAvailable] = useState(true);

  //for turning on/Off video button
  let[video , setVideo]= useState();
  //for turning on/Off audio Button
  let [audio , setAudio] = useState();

  //for screenSharing
  let [screenAvailable , setScreenAvailable] = useState();
  // for popup
  let[showModel ,setShowModel] = useState();

  // for checking is screenShare available
  let [screenShare ,setScreenShare] = useState();

  let [messages , setMessages] = useState([]);

  let [message , setMessage] = useState("");

  let [newMessage , setNewMessage] = useState(0);

  let [askForUserName , setAskForUserName] = useState(true);

  let [username , setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos ,setVideos] =useState([]);
    return (
    <div>
    
    
    </div>
  )
}

export default VideoMeet