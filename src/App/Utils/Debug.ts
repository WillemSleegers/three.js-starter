import { GUI } from "lil-gui"
import Stats from "three/examples/jsm/libs/stats.module.js"

export default class Debug {
  active: boolean
  ui: GUI
  stats: Stats

  constructor() {
    this.active = window.location.hash === "#debug"

    if (this.active) {
      this.ui = new GUI()

      this.stats = Stats()
      this.stats.domElement.style.position = "absolute"
      this.stats.domElement.style.top = "0px"

      document.body.appendChild(this.stats.domElement)
    }
  }
}
