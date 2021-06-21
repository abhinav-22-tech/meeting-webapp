import { Avatar, Badge, Button, makeStyles, Popover } from "@material-ui/core";
import {
  CameraAltOutlined,
  FeedbackOutlined,
  HelpOutline,
  PersonOutlined,
  Settings,
  Apps,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import "./home.css";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [appState, setAppState] = useState("empty");
  const [anchorEl, setAnchorEl] = useState(null);
  const [date, setDate] = useState(new Date());
  // console.log(date);

  const classes = useStyles();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  console.log(currentUser);

  const nameFirstChar = currentUser?.displayName !== null ? currentUser?.displayName.charAt(0).toUpperCase() : 'D';

  function stringToColor() {
    var str = currentUser?.displayName + "";
    var s = 50;
    var l = 50;
    var hash = 0;
    for (var i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);

    var h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setAppState("home");
      } else {
        setCurrentUser(null);
        setAppState("login");
      }
    });

    const timer = setInterval(() => setDate(new Date()), 1000);
    return timer;
  }, []);

  return (
    <div className="header">
      <div className="header__logoContainer">
        <img
          src="https://www.gstatic.com/meet/google_meet_horizontal_wordmark_2020q4_1x_icon_124_40_2373e79660dabbf194273d27aa7ee1f5.png"
          alt="google"
          className="header__logo"
        />
        <p>Meet</p>
      </div>

      <div className="header__icons">
        <div className="header__TimeDate">
          <span>
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            •{" "}
            {date.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <HelpOutline />
        <FeedbackOutlined />
        <Settings />
        <div className="header__iconDivider" />

        <Apps />

        <Avatar
          className="header__avatar"
          onClick={handleClick}
          style={{
            backgroundColor: stringToColor(),
          }}
        >
          {nameFirstChar}
        </Avatar>
        <Popover
          open={open}
          id={id}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
          }}
        >
          <div className="home__popoverContainer">
            <div className="home__popover__top">
              <Badge
                overlap="circle"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <div className="home__badge">
                    <CameraAltOutlined className="home__Camera" />
                  </div>
                }
              >
                <Avatar
                  className={classes.large}
                  style={{
                    backgroundColor: stringToColor(),
                  }}
                >
                  {nameFirstChar}
                </Avatar>
              </Badge>

              <div className="home__text">
                <div className="home__displayName">
                  {currentUser?.displayName}
                </div>

                <div className="home__mail">{currentUser?.email}</div>
              </div>

              <div className="home__btn">Manage your X-oo Account</div>
            </div>

            <div className="home__popover__btm">
              <div className="home__addBtn">
                <PersonOutlined className="home__addIcon" />
                <p>Add another account</p>
              </div>

              <Button
                onClick={() => auth.signOut()}
                variant="outlined"
                className="home__signOut"
              >
                Sign Out
              </Button>

              <div className="home__popover__footer">
                <p>Privacy policy</p>
                <span>•</span>
                <p>Terms of service</p>
              </div>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}

export default Home;
