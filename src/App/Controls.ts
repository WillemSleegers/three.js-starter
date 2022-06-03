import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Camera from "./Camera"
import Sizes from "./Utils/Sizes"

export default class Controls {
  instance: OrbitControls
  camera: Camera
  canvas: HTMLElement

  constructor(camera: Camera, canvas: HTMLElement) {
    this.camera = camera
    this.canvas = canvas

    this.setControls()
  }

  setControls() {
    this.instance = new OrbitControls(this.camera.instance, this.canvas)
    this.instance.enableDamping = true
  }

  update() {
    this.instance.update()
  }
}
