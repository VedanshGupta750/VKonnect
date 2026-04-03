import { useEffect, useRef, useState } from "react";
import styles from "../styles/videoComponent.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import IconButton from "@mui/material/IconButton";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ScreenShareStopIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";

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
  let [video, setVideo] = useState(false);

  //for turning on/Off audio Button
  let [audio, setAudio] = useState(false); // ✅ FIXED

  //for screenSharing
  let [screenAvailable, setScreenAvailable] = useState();

  // for popup
  let [showModal, setShowModal] = useState(false);

  // for checking is screenShare available
  let [screen, setScreen] = useState(false);

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessage, setNewMessage] = useState(0);

  let [askForUserName, setAskForUserName] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  // all users video
  let [videos, setVideos] = useState([]);

  const getPermissions = async () => {
    try {
      const videoPermissions = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setVideoAvailable(!!videoPermissions);

      const audioPermissions = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setAudioAvailable(!!audioPermissions);

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
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIDRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({
                sdp: connections[id].localDescription,
              }),
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setAudio(false);
          setVideo(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id]
              .createOffer()
              .then((description) =>
                connections[id].setLocalDescription(description),
              )
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  id,
                  JSON.stringify({
                    sdp: connections[id].localDescription,
                  }),
                );
              })
              .catch((e) => console.log(e));
          }
        }),
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({
          video: video,
          audio: audio,
        })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message);

    if (fromId !== socketIDRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId].createAnswer().then((description) => {
                connections[fromId]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      fromId,
                      JSON.stringify({
                        sdp: connections[fromId].localDescription,
                      }),
                    );
                  });
              });
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let addMessage = (data , sender , socketIdSender) => {
    setMessages((prevMessage)=>[
      ...prevMessage,
      {sender: sender , data:data} 
    ]);
    if(socketIdSender != socketIDRef.current){
      setNewMessage((prevMessage)=> prevMessage+1);
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(serverUrl, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIDRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerToPeerConnections,
          );

          // ✅ FIXED
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({
                  ice: event.candidate,
                }),
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId,
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video,
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();

            // ✅ FIXED
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIDRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIDRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2]
              .createOffer()
              .then((description) =>
                connections[id2].setLocalDescription(description),
              )
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  id2,
                  JSON.stringify({
                    sdp: connections[id2].localDescription,
                  }),
                );
              })
              .catch((e) => console.log(e));
          }
        }
      });
    });
  };

  let silence = () => {
    let context = new AudioContext();
    let oscillator = context.createOscillator();
    let dst = oscillator.connect(context.createMediaStreamDestination());
    oscillator.start();
    context.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let connect = () => {
    setAskForUserName(false);
    getMedia();
  };

  let handleVideo = () => {
    setVideo(!video);
  };

  let handleAudio = () => {
    setAudio(!audio);
  };

  let getDisplayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      console.log(err);
    }
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id == socketIDRef.current) continue;

      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription }),
            );
          })
          .catch((err) => console.log(err));
      });
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        }),
    );
  };

  let handleScreen = () => {
    if (!screen) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true, audio: true })
        .then(getDisplayMediaSuccess)
        .catch((err) => console.log(err));
    } else {
      setScreen(false);
      getUserMedia();
    }

    setScreen(!screen);
  };

  let sendMessage = () =>{
    socketRef.current.emit("chat-message" , message , username);
    setMessage("");
  }

  let routeTo = useNavigate();
  let handleCall = ()=>{
    try{
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }catch(e){
      console.log(e);
    }
    routeTo('/home');
  }

  return (
    <div>
      {askForUserName === true ? (
  <div className={styles.lobbyContainer}>
  <div className={styles.lobbyCard}>
    <h2>Enter into Lobby</h2>

    <TextField
      placeholder="Enter your name"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <Button variant="contained" onClick={connect}>
      Connect
    </Button>

    <video ref={localVideoRef} muted autoPlay></video>
  </div>
</div>
      ) : (
        <div  className={styles.meetVideoContainer}>
          { showModal ? <div className={styles.chatRoom}>
            <div className={styles.chatContainer}>
              <h1>Chat</h1>
              <div className={styles.chattingDisplay}>
                { messages.length > 0 ?  messages.map((item , index)=>{
                  return(
                    <div style={{marginBottom: "20px"}} key={index}>
                      <p style={{fontWeight:"bold"}}>{item.sender}</p>
                      <p>{item.data}</p>
                    </div>
                  )
                }): <p>No messages yet</p>}
              </div>
              <div className={styles.chattingArea}>
                <TextField value={message} onChange={(e) =>setMessage(e.target.value)} id="outlined-basic" label="Enter your Chat" variant="outlined" />
                <Button variant="contained" onClick={sendMessage} style={{margin: "1rem"}}>Send</Button>
              </div>
              
            </div>
          </div> : <> </>}
          <div className={styles.buttonContainer}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video == true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton style={{ color: "red" }}>
              <CallEndIcon onClick={handleCall  }/>
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio == true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>

            {screenAvailable == true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen == true ? <ScreenShareIcon /> : <ScreenShareStopIcon />}
              </IconButton>
            ) : (
              <></>
            )}
            <Badge badgeContent={newMessage} max={999} color="secondary">
              <IconButton onClick={()=> setShowModal(!showModal)} style={{ color: "white" }}>
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>
          <video
            className={styles.meetUserVideo}
            ref={localVideoRef}
            autoPlay
            muted
          ></video>
          <div className={styles.conferenceView}>
            {videos.map((video) => (
              <video
                key={video.socketId}
                data-socket={video.socketId}
                ref={(ref) => {
                  if (ref && video.stream) {
                    ref.srcObject = video.stream;
                  }
                }}
                autoPlay
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoMeet;
