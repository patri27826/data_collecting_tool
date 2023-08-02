import React from "react";
import { useState } from "react";
import WebcamVideo from "./components/WebcamVideo";
import FileSystem from "./components/FileSystem";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { TabView, TabPanel } from "primereact/tabview";

function App() {
  const [videoList, setVideoList] = useState([]);
  return (
    <div>
      <TabView>
        <TabPanel header="Recording">
          <div className="App-header">
            <WebcamVideo
              setVideoList={setVideoList} 
             />
          </div>
        </TabPanel>
        <TabPanel header="File System">
          <div className="App-header">
            <FileSystem 
              videoList={videoList}
              setVideoList={setVideoList}
            />
          </div>
        </TabPanel>
        <TabPanel header="Processing">
        </TabPanel>
      </TabView>
    </div>
  );
}

export default App;
