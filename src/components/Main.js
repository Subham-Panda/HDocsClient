import React, { useState, useRef, useEffect } from "react";
import Identicon from "identicon.js";
import dotsLeft from '../pics/dotsLeft.png'
import dotsright from '../pics/dotsRight.png'
import Card from "@material-ui/core/Card";
import axios from "axios";
// import ReactAudioPlayer from 'react-audio-player';
import { FileDrop } from "react-file-drop";
// import ReactJkMusicPlayer from 'react-jinke-music-player';
// import 'react-jinke-music-player/assets/index.css';
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import mp3Icon from "../images/mp3.svg";
import "./file-drag.css";
import { useSelector } from "react-redux";
// import './player.scss';

const Main = ({ captureFile, uploadImage, images, tipImageOwner, reports }) => {
  const [desc, setDesc] = useState("");
  const [tip, setTip] = useState(0.1);
  const [file, setFile] = useState("");
  const fileInputRef = useRef(null);
  const [data, setData] = useState([]);
  const onTargetClick = () => {
    fileInputRef.current.click();
  };
  let { user } = useSelector((state) => ({ ...state }));

  return (
    <div className="container-fluid mt-5">
      <img
        src={dotsLeft}
        alt=""
        style=
        {{
          position: "fixed",
          width: 145,
          height: 145,
          left: 5,
          top: 123
        }}
      />
      <img
        src={dotsright}
        alt=""
        style={{ position: "fixed", right: 0, top: 250 }}
      />
      <div className="row main-main">
        <div className="content" style={{ marginBottom: "50px" }}>
          <div className="left">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const description = desc;
                uploadImage(description);
              }}
            >
              {
                user.email !== "im.sspanda2001@gmail.com" ?
                  (
                    <div className="browse-div">
                      <label
                        htmlFor="browse-input"
                        id="browse-input-label"
                        style={{ backgroundColor: !user && ("#e47268"), cursor: !user && ('auto') }}

                      >
                        Browse
                      </label>
                      <input
                        onChange={(event) => {
                          setFile(event.target.files.item(0));
                          captureFile(event, event.target.files);
                          setDesc(event.target.files.item(0).name);
                          // console.log(
                          //     'FILES:',
                          //     event.target.files.item(0).name
                          // );
                        }}
                        ref={fileInputRef}
                        type="file"
                        accept="pdf"
                        hidden={true}
                        id="browse-input"
                        disabled={!user && (
                          true
                        )}
                      />
                    </div>
                  ) : null
              }
              <div className="show-files-to-upload">
                {file ? (
                  <>
                    <img src={mp3Icon} className="mp3-icon" alt="" />
                    <h4 className="file-name">{file.name}</h4>
                    <div className="form-group mr-sm-2">
                      <br />
                      <label htmlFor="name-of-file" style={{ marginRight: 30 }}>
                        File Name:{" "}
                      </label>
                      <input
                        type="text"
                        onChange={(e) => {
                          setDesc(e.target.value);
                        }}
                        value={desc}
                        required
                        id="name-of-file imageDesc"
                      />
                    </div>
                    <button
                      className="btn btn-primary btn-block btn-lg"
                      type="submit"
                      style={{ margin: "20px 0" }}
                    >
                      Upload!
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
            </form>
          </div>
          <div>
            <hr
              style={{
                width: "100%",
                backgroundColor: "#4959E8",
                color: "#4959E8",
                height: "1.5px",
              }}
            />
          </div>
          <div className="right">
            {reports && reports.length > 0 ? (
              reports.map((image, key) => {
                return (
                  <Card style={{ marginBottom: 50 }} className="card-main">
                    <div className="card-header">
                      <small className="text-muted gray"></small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <div className="text-center">
                          <iframe
                            title={image.description}
                            src={`https://ipfs.infura.io/ipfs/${image.report}`}
                            controls
                            style={{ width: '400px' }}
                          ></iframe>
                        </div>
                        {/* <p className="black">{image.description}</p> */}
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <div style={{ float: "left" }}>
                          <h4>{image.description}</h4>
                        </div>
                        <div style={{ float: "right" }} className="tip-enter-div">

                          <a href={`https://ipfs.infura.io/ipfs/${image.report}`} target="_blank" rel="noopener noreferrer">VIEW</a><br />
                        </div>
                      </li>
                    </ul>
                  </Card>
                );
              })
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
