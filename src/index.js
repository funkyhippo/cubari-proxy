import React from "react";
import ReactDOM from "react-dom";
import "./style/index.css";
import "lightgallery.js/dist/css/lightgallery.css";
import App from "./App.js";
import { LightgalleryProvider } from "react-lightgallery";

ReactDOM.render(
  <LightgalleryProvider
    lightgallerySettings={{
      closable: false,
      speed: 200,
      cssEasing: "ease-in-out",
      loop: false,
      // settings: https://sachinchoolur.github.io/lightgallery.js/docs/api.html
    }}
    galleryClassName="chapter_gallery"
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </LightgalleryProvider>,
  document.getElementById("root")
);
