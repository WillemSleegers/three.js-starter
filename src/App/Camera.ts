import { Scene, PerspectiveCamera } from "three"
import Sizes from "./Utils/Sizes"

export default class Camera {
  instance: PerspectiveCamera
  scene: Scene
  sizes: Sizes

  constructor(scene: Scene, sizes: Sizes) {
    this.scene = scene
    this.sizes = sizes

    this.setInstance()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.instance.position.set(8, 8, 15)
    this.instance.lookAt(0, 0, 0)
    this.scene.add(this.instance)
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
}
