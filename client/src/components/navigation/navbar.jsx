import logo from "../../images/logo.png";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { accountContext } from "../Contexts/appContext";
import { AnimatePresence, motion } from "framer-motion";
import NotificationsIcon from "@mui/icons-material/Notifications";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import axios from "axios";
import "../navigation/navbar.css";
import { SearchBarModal } from "./SearchBarModal";

export const Navbar = () => {
  const navigateTo = useNavigate();
  const ref = useRef();
  const { userStatus, user, logoutHandler, socket, posts } =
    useContext(accountContext);

  const [profile, setProfile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [userInfo, setUserInfo] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [width, setWidth] = useState(window.innerWidth);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    function getCurrentWidth() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", getCurrentWidth);
    return () => window.removeEventListener("resize", getCurrentWidth);
  }, []);

  useEffect(() => {
    if (width < 550) setSearchClicked(false);
  }, [width]);

  const navlogoutHandler = () => {
    socket.emit("logout", { userID: user.id });
    logoutHandler();
    setProfile(false);
  };
  const searchwordHandler = (word) => {
    setSearch(word);
  };
  useEffect(() => {
    searchBarHandler();
  }, [search, posts]);

  const searchBarHandler = async () => {
    const data = {
      word: search,
    };
    const url = "http://localhost:3001/posts/search";
    const searchResponse = await axios.post(url, data, {
      headers: {
        authorization: localStorage.getItem("Token"),
      },
    });

    if (searchResponse.data && searchResponse.data.length >= 1) {
      setSearchResults(searchResponse.data);
      setAnchorEl(ref.current);
    } else {
      setAnchorEl(null);
    }
  };

  const searchInputCheck = () => {
    if (search) setAnchorEl(ref.current);
    else setSearchResults([]);
  };

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  const test = [1, 2];
  const open = Boolean(profile);

  const openProfile = (e) => {
    setProfile(e.currentTarget);
  };
  const closeProfile = () => {
    setProfile(null);
  };

  const notificationOpen = Boolean(notification);

  const handleClick = (event) => {
    setNotification(event.currentTarget);
  };

  const handleClose = () => {
    setNotification(null);
  };

  if (userStatus) {
    return (
      <nav>
        <div className="navbar-wrapper">
          <img
            className="unplug_logo"
            src={logo}
            alt="logo"
            onClick={() =>
              !userStatus ? navigateTo("/") : navigateTo("/display")
            }
          />

          <div className="profile_section">
            {width <= 500 && !searchClicked ? (
              <TravelExploreIcon
                onClick={() => setSearchClicked(true)}
                sx={{ color: "white", fontSize: "1.85rem" }}
              />
            ) : (
              <motion.div
                initial={{
                  opacity: 0,
                  x: width <= 500 ? 20 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.75 }}
              >
                <TextField
                  ref={ref}
                  id="input-with-icon-textfield"
                  placeholder="Search Unplug"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ color: "white" }}
                        className="navy_search"
                      >
                        <TravelExploreIcon
                          sx={{
                            fontSize: "1.85rem",
                            cursor: width ? "pointer" : "unset",
                          }}
                          onClick={
                            width <= 500 ? () => setSearchClicked(false) : null
                          }
                        />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => searchwordHandler(e.target.value)}
                  variant="standard"
                  color="secondary"
                  sx={{
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "gray",
                      borderBottomWidth: "2px",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white",
                    },
                    width: "100%",
                  }}
                  className="search_bar"
                  onClick={() => searchInputCheck()}
                />
              </motion.div>
            )}
            <SearchBarModal
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
            />

            <Badge badgeContent={4} color="error">
              <NotificationsIcon
                className="notification_bell"
                onClick={(e) => handleClick(e)}
              />
              <Popover
                open={notificationOpen}
                anchorEl={notification}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="Notifications_container">
                  <MenuItem
                    sx={{
                      minWidth: "200px",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      justifyContent: "space-evenly",
                    }}
                  >
                    <h2>Notifications</h2>
                    <span>
                      <RecordVoiceOverIcon />
                    </span>
                  </MenuItem>
                  <Divider />
                  {test.map((item) => (
                    <div>
                      <MenuItem
                        sx={{
                          minWidth: "200px",
                          justifyContent: "space-around",
                        }}
                      >
                        <Avatar
                          src={
                            userInfo
                              ? `https://ucarecdn.com/${userInfo.profilePicture}/`
                              : ""
                          }
                          sx={{ width: "45px", height: "45px" }}
                        />
                        <p>User liked your post</p>
                      </MenuItem>
                      <Divider />
                    </div>
                  ))}
                </div>
              </Popover>
            </Badge>
            <div>
              <IconButton
                onClick={openProfile}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  src={user && `https://ucarecdn.com/${user.profilePicture}/`}
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderStyle: "solid",
                    borderColor: "white",
                  }}
                  className="navbar-avatar"
                  onClick={openProfile}
                ></Avatar>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={profile}
                open={open}
                onClose={closeProfile}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{ width: "400px" }}
              >
                <MenuItem
                  sx={{ minWidth: "180px" }}
                  onClick={() => {
                    closeProfile();
                    navigateTo(`/profile/${user.id}`, { replace: true });
                  }}
                >
                  <AccountCircleIcon
                    className="profile_menu_icon"
                    sx={{ mr: 2 }}
                  />
                  <div>Profile</div>
                </MenuItem>
                <MenuItem sx={{ minWidth: "180px" }} onClick={closeProfile}>
                  <SettingsIcon className="profile_menu_icon" sx={{ mr: 2 }} />
                  <div>Settings</div>
                </MenuItem>
                <MenuItem
                  sx={{ minWidth: "180px" }}
                  onClick={() => navlogoutHandler()}
                >
                  <LogoutIcon className="profile_menu_icon" sx={{ mr: 2 }} />
                  <div>Logout</div>
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav>
      {!userStatus ? (
        <motion.div whileHover={{ scale: 1.1 }}>
          <img
            className="unplug_logo"
            style={{ maxWidth: "100%" }}
            src={logo}
            alt="logo"
            onClick={() => navigateTo("/")}
          />
        </motion.div>
      ) : (
        <div>
          <img
            className="unplug_logo"
            src={logo}
            alt="logo"
            onClick={() => navigateTo("/display")}
          />
        </div>
      )}
      <div className="profile_section">
        <div>
          <Button variant="contained" color="secondary">
            <a
              href="mailto:lihenryhl.work@gmail.com"
              style={{ color: "white", textDecoration: "none" }}
            >
              Contact
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
};
