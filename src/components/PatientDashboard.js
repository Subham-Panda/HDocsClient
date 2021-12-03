import React, { useEffect, useRef, useState } from "react";
import {useSelector} from 'react-redux';
import Navbar from "./Navbar";
import Main from "./Main";
import Web3 from "web3";
import axios from "axios";
import './App.css'
import './index.css';
import Decentragram from "../abis/Decentragram.json";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const PatientDashboard = () => {
  const [account, setAccount] = useState(() => {
    return "";
  });
  const [decentragram, setDecentragram] = useState(() => {
    return null;
  });
  // const [images, setImages] = useState(() => {
  //   return [];
  // });
  const [imageCount, setImageCount] = useState(() => {
    return 0;
  });
  const buffer = useRef();
  const images = useRef([]);

  let { user } = useSelector((state) => ({ ...state }));


  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  const getData = async () => {
    const resp = await axios.post("http://localhost:8000/api/report/all", {
      email: user.email,
    });
    setReports([...resp.data.reports]);
    setLoading(false);
  }
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
    getData();
  }, []);
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected");
    }
  };
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const netWorkId = await web3.eth.getId();
    const netData = await Decentragram.networks[netWorkId];
    // console.log(accounts[0])
    if (netData) {
      const decentragram = web3.eth.Contract(Decentragram.abi, netData.address);
      setDecentragram(decentragram);
      const imageCount = await decentragram.methods.imageCount().call();
      setImageCount(imageCount);
      // console.log(imageCount.toNumber());
      for (var i = 1; i <= imageCount; i++) {
        const image = await decentragram.methods.images(i).call()
        images.current = [...images.current, image]
      }
      // console.log(images.current)
      images.current.sort((a, b) => b.tipAmount - a.tipAmount)
      setLoading(false);
    } else {
      window.alert("ERROR PROCESSING REPORT! CHECK CONNECTION and TRY AGAIN");
    }
  };
  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      buffer.current = Buffer(reader.result);
      console.log(buffer.current);
    };
  };
  const uploadImage = async (description) => {
    console.log("sending to ipfs");
    ipfs.add(buffer.current, (error, result) => {
      console.log("ipfs file", result);
      if (error) {
        console.log(error);
      }
      setLoading(true)
      decentragram.methods.uploadImage(result[0].hash, description).send({ from: account }).on('transactionHash', async (hash) => {
        await axios.post("http://localhost:8000/api/report/add", {
          email: user.email,
          report: result[0].hash,
          description: description,
        });
        setLoading(false)
      })
    });

  };
  const tipImageOwner = async (id, tipAmount) => {
    setLoading(true)
    decentragram.methods.tipImageOwner(id).send({ from: account, value: tipAmount }).on('transactionHash', (hash) => {
      setLoading(false)
    })
  }

  return (
    <div className="main-screen">
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {loading ? (
              <div id="loader" className="text-center">
                <p className="Text Center">Loading..</p>
              </div>
            ) : (
              <Main
                images={images.current}
                captureFile={captureFile}
                account={account}
                uploadImage={uploadImage}
                tipImageOwner={tipImageOwner}
                reports={reports}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
