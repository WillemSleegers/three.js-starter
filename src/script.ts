import App from "./App/App"

import "./style.css"

// Get the canvas
const canvas = document.getElementById("scene")

if (canvas == null) {
  throw "Canvas not found."
}

// Create the app
const app = new App(canvas)
