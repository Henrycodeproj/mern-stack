import axios from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import "./RightSideCol.css";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ChatIcon from "@mui/icons-material/Chat";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { accountContext } from "../../../Contexts/appContext";
import { IndividualChats } from "../../ChatViews/IndividualChat";
import { useNavigate } from "react-router-dom";
import { EventCalendar } from "./EventCalendar";
import { motion } from "framer-motion";

export const RightSideCol = () => {
  const newMessageCheck = useRef();
  const navigateTo = useNavigate();

  const { user, activeUsers, recentMessages, setRecentMessages, socket } =
    useContext(accountContext);

  const [popularPosts, setPopularPosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const url = "http://localhost:3001/posts/popular";
    axios
      .get(url, {
        headers: {
          authorization: localStorage.getItem("Token"),
        },
      })
      .then((res) => {
        setPopularPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const Url = `http://localhost:3001/message/recent/all/${user.id}`;
    axios
      .get(Url, {
        headers: {
          authorization: localStorage.getItem("Token"),
        },
      })
      .then((res) => setRecentMessages(res.data.reverse()))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    socket.on(`${user.id}`, (data) => {
      newMessageCheck.current = data;
      checkNewMessageInRecents();
    });
    return () => {
      socket.removeListener(`${user.id}`);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkNewMessageInRecents = async () => {
    setRecentMessages((prevMessages) =>
      prevMessages.some((chat) => chat._id === newMessageCheck.current._id)
        ? [...prevMessages]
        : [...prevMessages, newMessageCheck.current]
    );
  };

  const open = Boolean(anchorEl);

  //const variants = {
  //  see :{
  //    width:"1000px"
  //  },
  //  close: {
  //    opacity:1
  //  }
  //}
  const variants = {
    alert: { 
      width:["5px","1000px"],
      transition:{duration: 2 }
     },
      
    noAlert: {},
  }
  const [clak, setClak] = useState(false)

  return (
    <div className="right_column_wrapper">
      <EventCalendar />
      <div className="popular_container">
        <h2
          style={{
            marginBottom: "10px",
            textDecoration: "underline",
            fontSize: "1.6rem",
            fontWeight: "900",
          }}
        >
          Biggest Events Today
        </h2>
        {popularPosts.map((post) => (
          <div>
            <Divider />
            <div className="popular_post_container">
              <div style={{ display: "flex" }}>
                <Avatar
                  sx={{ marginRight: "10px", cursor: "pointer" }}
                  src={`https://ucarecdn.com/${post.original_poster[0].profilePicture}/`}
                  onClick={() =>
                    navigateTo(`/profile/${post.original_poster[0]._id}`)
                  }
                />
                <div style={{ overflowWrap: "anywhere" }}>
                  <h3
                    style={{
                      textTransform: "capitalize",
                      color: "black",
                      margin: 0,
                      fontWeight: "600",
                    }}
                  >
                    {post.original_poster[0].username}
                  </h3>
                  {post.Description.length >= 50 ? (
                    <div>
                      {post.Description.substring(0, 50)}
                      <span style={{ cursor: "pointer" }} onClick={handleClick}>
                        ...
                      </span>
                    </div>
                  ) : (
                    <p>{post.Description.substring(0, 50)}</p>
                  )}
                </div>
              </div>
              <Avatar
                onClick={handleClick}
                sx={{
                  background: "rgba(80, 80, 80, 0.4)",
                  borderStyle: "solid",
                  width: "35px",
                  height: "35px",
                }}
              >
                +{post.attendingLength}
              </Avatar>
            </div>
          </div>
        ))}
      </div>
      <div className="recent_message_container">
        <div className="recent_message_title">
          <h2
            style={{
              textDecoration: "underline",
              fontSize: "1.6rem",
              fontWeight: "900",
            }}
          >
            Recent Messages
          </h2>
          <motion.div 
            animate={clak > 0 ? "alert": "noAlert"}
            variants={variants}
            style = {{borderStyle:"solid"}}
          >
          <PersonSearchIcon onClick = {()=> setClak(p => !p)}/>
          </motion.div>
        </div>
        <div className="recent_message_avatars">
          {recentMessages &&
            recentMessages.map((queryInfo, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "100%",
                  marginBottom: "10px",
                }}
              >
                <div
                  className="profile_image_name_container"
                  onClick={
                    queryInfo.recieverInfo[0].username === user.username
                      ? () =>
                          navigateTo(`/profile/${queryInfo.senderInfo[0]._id}`)
                      : () =>
                          navigateTo(
                            `/profile/${queryInfo.recieverInfo[0]._id}`
                          )
                  }
                >
                  <div className="recent_chatMessages_container">
                    <Avatar
                      sx={{ marginRight: "10px", cursor: "pointer" }}
                      src={
                        queryInfo.recieverInfo[0]._id === user.id
                          ? queryInfo.senderInfo[0].profilePicture
                            ? `https://ucarecdn.com/${queryInfo.senderInfo[0].profilePicture}/`
                            : null
                          : queryInfo.recieverInfo[0].profilePicture
                          ? `https://ucarecdn.com/${queryInfo.recieverInfo[0].profilePicture}/`
                          : null
                      }
                    />
                    {queryInfo.recieverInfo[0]._id === user.id
                      ? queryInfo.senderInfo[0]._id in activeUsers && (
                          <div className="recent_message_online"></div>
                        )
                      : queryInfo.recieverInfo[0]._id in activeUsers && (
                          <div className="recent_message_online"></div>
                        )}
                  </div>
                  <h3 className="recent_message_names">
                    {queryInfo.recieverInfo[0].username === user.username
                      ? queryInfo.senderInfo[0].username
                      : queryInfo.recieverInfo[0].username}
                  </h3>
                </div>
                <IndividualChats
                  recievingUserInfo={
                    queryInfo.recieverInfo[0].username === user.username
                      ? queryInfo.senderInfo[0]
                      : queryInfo.recieverInfo[0]
                  }
                  convoId={queryInfo._id}
                  isNewMessage={newMessageCheck.current}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
