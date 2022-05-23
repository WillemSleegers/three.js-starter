import { Scene, PerspectiveCamera } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Sizes from "./Utils/Sizes"

export default class Camera {
  canvas: HTMLElement
  scene: Scene
  sizes: Sizes
  instance: PerspectiveCamera
  controls: OrbitControls

  constructor(canvas: HTMLElement, scene: Scene, sizes: Sizes) {
    this.canvas = canvas
    this.scene = scene
    this.sizes = sizes

    this.setInstance()
    this.setControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}
