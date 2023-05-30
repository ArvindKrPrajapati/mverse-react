import React, { useEffect, useState, useRef } from "react";
import "./player.css";
import { mverseGet } from "../utils/mverse-api.service";

export default function Player({ data, tv, episode, season }) {
  const [selectedSrc, setSelectedSrc] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState([]);
  const video = useRef();
  const timeDisplay = useRef();
  const slider = useRef();
  const loader_container = useRef();
  const loader = useRef();
  const playBtn = useRef();
  const pauseBtn = useRef();
  const overlay = useRef();

  const _init = async () => {
    try {
      if (tv) {
        setError("Not Available");
      } else {
        setLoading(true);
        setError();
        const res = await mverseGet("/mverse/details/" + data.id);
        setLoading(false);
        if (res.success) {
          setLinks(res.data);
          if (res.data.length) {
            setSelectedSrc(res.data[0]?.video[0]?.href);
          } else {
            setError("Not Available");
          }
        } else {
          setError(res.error);
        }
      }
    } catch (error) {
      setLoading(false);
      setError("something went wrong");
    }
  };

  useEffect(() => {
    _init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (slider.current) {
      slider.current.value = 0;
    }
    if (video.current) {
      video.current.addEventListener("loadedmetadata", function () {
        var currentTime = formatTime(video.current.currentTime);
        setTime(currentTime);
        setSlider(video.current.currentTime);
      });

      video.current.addEventListener("timeupdate", function () {
        var currentTime = formatTime(video.current.currentTime);
        setTime(currentTime);
        setSlider(video.current.currentTime);
      });

      video.current.addEventListener("canplay", function () {
        togglePlayPauseBtn();
        waitAndHide(5000);
        loader_container.current.style.background = "transparent";
        loader.current.style.display = "none";
      });

      video.current.addEventListener("waiting", function () {
        loader.current.style.display = "block";
      });

      playBtn.current.addEventListener("click", (event) => {
        event.stopPropagation();
        video.current.play();
        togglePlayPauseBtn();
      });

      pauseBtn.current.addEventListener("click", (event) => {
        event.stopPropagation();
        video.current.pause();
        togglePlayPauseBtn();
      });

      slider.current.addEventListener("change", function (event) {
        event.stopPropagation();
        var duration = video.current.duration;
        var currentTime = (slider.current.value / 100) * duration;
        video.current.currentTime = currentTime;
        setTime(formatTime(currentTime));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSrc]);

  const setTime = (currentTime) => {
    const duration = formatTime(video.current.duration);
    if (duration) {
      timeDisplay.current.textContent = currentTime + " / " + duration;
    }
  };
  const setSlider = (currentTime) => {
    const duration = video.current.duration;
    if (duration) {
      slider.current.value = (currentTime / duration) * 100;
    }
  };

  const togglePlayPauseBtn = () => {
    if (video.current.paused) {
      pauseBtn.current.style.display = "none";
      playBtn.current.style.display = "flex";
    } else {
      pauseBtn.current.style.display = "flex";
      playBtn.current.style.display = "none";
    }
  };

  const formatTime = (time) => {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = Math.floor(time % 60);
    var formattedTime = "";

    if (hours > 0) {
      formattedTime += (hours < 10 ? "0" + hours : hours) + ":";
    }

    formattedTime +=
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    return formattedTime;
  };

  const hideOverlay = () => {
    overlay.current.style.visibility = "hidden";
  };

  const hideLoader = () => {
    overlay.current.style.visibility = "visible";
    // waitAndHide(4000);
  };

  const handleFullScreen = (event) => {
    event.stopPropagation();
    const controls = document.querySelector(".controls");
    const footer = document.querySelector(".footer");
    const video_container = document.querySelector(".video-container");

    if (!document.fullscreenElement) {
      controls.style.marginTop = "15px";
      footer.style.padding = "0px 8px 15px 8px";
      if (video_container.requestFullscreen) {
        video_container.requestFullscreen();
      } else if (video_container.mozRequestFullScreen) {
        // Firefox
        video_container.mozRequestFullScreen();
      } else if (video_container.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        video_container.webkitRequestFullscreen();
      } else if (video_container.msRequestFullscreen) {
        // IE/Edge
        video_container.msRequestFullscreen();
      }
      // if (screen.orientation && screen.orientation.lock) {
      //   screen.orientation.lock("landscape");
      // }
    } else {
      controls.style.marginTop = "0px";
      footer.style.padding = "0px";
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      // if (screen.orientation && screen.orientation.unlock) {
      //   screen.orientation.unlock();
      // }
    }
  };

  const handleAspectRatio = (event) => {
    event.stopPropagation();
    const ar = video.current.style.objectFit;
    if (!ar) {
      video.current.style.objectFit = "fill";
    } else if (ar === "fill") {
      video.current.style.objectFit = "cover";
    } else {
      video.current.style.objectFit = "";
    }
  };

  const handleForward = (event) => {
    event.stopPropagation();
    const toskip = video.current.currentTime + 10;
    video.current.currentTime = toskip;
    setTime(formatTime(toskip));
    setSlider(toskip);
  };
  const handleBackward = (event) => {
    event.stopPropagation();
    const toskip = video.current.currentTime - 10;
    video.current.currentTime = toskip;
    setTime(formatTime(toskip));
    setSlider(toskip);
  };

  const waitAndHide = (t) => {
    const timeout = setTimeout(function () {
      overlay.current.style.visibility = "hidden";
      clearTimeout(timeout);
    }, t);
  };

  const showSettings = (event) => {
    event.stopPropagation();
    document.getElementById("defaultOpen").click();
    const options = document.querySelector("#options");
    options.style.transform = "translateY(0)";
  };

  const hideSettings = () => {
    const options = document.querySelector("#options");
    options.style.transform = "translateY(100%)";
  };

  const changeLink = (item, event) => {
    const s = item.video[0].href;
    loader_container.current.style.background = "black";

    const ct = video.current.currentTime;
    setSelectedSrc(s);
    setTime(ct);
    setSlider(ct);
    video.current.load();
    video.current.currentTime = ct;
    video.play();
  };
  const changeSpeed = (rate, event) => {
    document.querySelector("#speed-btn-group div").style.color = "#eee";
    const link_btn = document.getElementsByClassName("speed-link");
    for (let i = 0; i < link_btn.length; i++) {
      link_btn[i].style.color = "gainsboro";
    }
    event.target.style.color = "red";
    video.current.playbackRate = rate;
  };

  const openTab = (evt, tabName) => {
    evt.stopPropagation();
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  };

  if (loading) {
    return (
      <div
        id="player"
        className="d-flex justify-content-center align-items-center"
      >
        <div
          className="spinner-border text-light custom-spinner"
          role="status"
        ></div>
      </div>
    );
  }

  return (
    <div id="player">
      {error ? (
        <div className="d-flex justify-content-center align-items-center text-white h-100">
          {error}
        </div>
      ) : (
        <div className="video-container">
          <div
            ref={loader_container}
            onClick={hideLoader}
            className="loader-container"
          >
            <div
              ref={loader}
              className="spinner-border text-light custom-spinner"
              role="status"
            ></div>
          </div>
          <main className="overlay" ref={overlay} onClick={hideOverlay}>
            <div className="video-header">
              <small className="d-block text-white">
                {data.title || data.name}
              </small>
            </div>
            <div className="controls">
              <div
                className="backBtn"
                onClick={(event) => {
                  handleBackward(event);
                }}
              >
                <svg fill="white" width="28px" viewBox="0 0 24 24">
                  <path d="M12.5,3C17.15,3 21.08,6.03 22.47,10.22L20.1,11C19.05,7.81 16.04,5.5 12.5,5.5C10.54,5.5 8.77,6.22 7.38,7.38L10,10H3V3L5.6,5.6C7.45,4 9.85,3 12.5,3M10,12V22H8V14H6V12H10M18,14V20C18,21.11 17.11,22 16,22H14A2,2 0 0,1 12,20V14A2,2 0 0,1 14,12H16C17.11,12 18,12.9 18,14M14,14V20H16V14H14Z" />
                </svg>
              </div>
              <div>
                <div className="video-pauseBtn" ref={pauseBtn}>
                  <svg fill="white" width="50px" viewBox="0 0 24 24">
                    <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                  </svg>
                </div>
                <div className="video-playBtn" ref={playBtn}>
                  <svg fill="white" width="30px" viewBox="0 0 55 65">
                    <g
                      id="Group_38215"
                      data-name="Group 38215"
                      transform="translate(30 35)"
                    >
                      <g
                        id="play-button-arrowhead_1_"
                        data-name="play-button-arrowhead (1)"
                        transform="translate(-30 -35)"
                      >
                        <path
                          id="Path_18"
                          data-name="Path 18"
                          d="M18.095,1.349C12.579-1.815,8.107.777,8.107,7.134v46.91c0,6.363,4.472,8.952,9.988,5.791l41-23.514c5.518-3.165,5.518-8.293,0-11.457Z"
                          transform="translate(-8.107 0)"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
              <div
                className="forwardBtn"
                onClick={(event) => {
                  handleForward(event);
                }}
              >
                <svg fill="white" width="28px" viewBox="0 0 24 24">
                  <path d="M10,12V22H8V14H6V12H10M18,14V20C18,21.11 17.11,22 16,22H14A2,2 0 0,1 12,20V14A2,2 0 0,1 14,12H16C17.11,12 18,12.9 18,14M14,14V20H16V14H14M11.5,3C14.15,3 16.55,4 18.4,5.6L21,3V10H14L16.62,7.38C15.23,6.22 13.46,5.5 11.5,5.5C7.96,5.5 4.95,7.81 3.9,11L1.53,10.22C2.92,6.03 6.85,3 11.5,3Z" />
                </svg>
              </div>
            </div>
            <div className="footer">
              <div className="timerAndMenu">
                <div>
                  <small
                    id="time-display"
                    ref={timeDisplay}
                    className="text-white"
                  >
                    00:00
                  </small>
                </div>
                <div className="menus">
                  <svg
                    id="aspect-ratio"
                    onClick={(event) => {
                      handleAspectRatio(event);
                    }}
                    fill="white"
                    width="20px"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19,12H17V15H14V17H19V12M7,9H10V7H5V12H7V9M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3M21,19H3V5H21V19Z" />
                  </svg>
                  <svg
                    id="setting"
                    onClick={(event) => {
                      showSettings(event);
                    }}
                    fill="white"
                    width="20px"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                  </svg>
                  <svg
                    id="fullscreen"
                    onClick={(event) => {
                      handleFullScreen(event);
                    }}
                    fill="white"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>arrow-expand</title>
                    <path d="M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z" />
                  </svg>
                </div>
              </div>
              <input
                className="range"
                ref={slider}
                type="range"
                min={0}
                max={100}
              />
            </div>
          </main>

          <section id="options" onClick={hideSettings}>
            <main className="options-content">
              <div className="tab">
                <button
                  className="tablinks"
                  id="defaultOpen"
                  onClick={(event) => {
                    openTab(event, "quality");
                  }}
                >
                  Options
                </button>
                <button
                  className="tablinks"
                  onClick={(event) => {
                    openTab(event, "speed");
                  }}
                >
                  Speed
                </button>
              </div>

              <div id="quality" className="tabcontent">
                <div className="quality p-4">
                  <b className="text-white d-block">video options</b>
                  <div className="p-2">
                    {links.map((item, index) => (
                      <div
                        key={index}
                        className="link-btn d-block video-link"
                        style={
                          item.video[0].href === selectedSrc
                            ? { background: "red" }
                            : {}
                        }
                        onClick={(event) => {
                          changeLink(item, event);
                        }}
                      >
                        {item.video[0].resolution +
                          " " +
                          item.video[0].language +
                          " " +
                          item.video[0].source}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div id="speed" className="tabcontent">
                <div className="speed p-4">
                  <b className="text-white d-block">video speed</b>
                  <div className="p-2" id="speed-btn-group">
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(0.25, event);
                      }}
                    >
                      0.25x
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(0.5, event);
                      }}
                    >
                      0.5x
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(0.75, event);
                      }}
                    >
                      0.75x
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      id="defaultSpeed"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(1, event);
                      }}
                    >
                      Normal
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(1.25, event);
                      }}
                    >
                      1.25x
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(1.5, event);
                      }}
                    >
                      1.5x
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(1.75, event);
                      }}
                    >
                      1.75x
                    </div>
                    <div
                      className="link-btn d-block speed-link"
                      style={{ background: "inherit" }}
                      onClick={(event) => {
                        changeSpeed(2, event);
                      }}
                    >
                      2x
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </section>
          {selectedSrc ? (
            <video ref={video} controls autoPlay preload="metadata">
              <source src={selectedSrc} />
            </video>
          ) : null}
        </div>
      )}
    </div>
  );
}
