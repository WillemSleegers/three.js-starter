import { Scene, Mesh } from "three"
import Camera from "./Camera"
import Controls from "./Controls"
import FPSControls from "./FPSControls"
import Renderer from "./Renderer"
import World from "./World/World"
import Debug from "./Utils/Debug"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Resources from "./Utils/Resources"
import { sources } from "./sources"

export default class App {
  camera: Camera
  //controls: Controls
  controls: FPSControls
  canvas: HTMLElement
  scene: Scene
  sizes: Sizes
  renderer: Renderer
  resources: Resources
  time: Time
  world: World
  debug: Debug

  constructor(canvas: HTMLElement) {
    this.canvas = canvas

    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene()
    this.camera = new Camera(this.scene, this.sizes)

    this.renderer = new Renderer(
      this.camera,
      this.canvas,
      this.scene,
      this.sizes
    )
    this.resources = new Resources(sources)
    this.world = new World(this.scene, this.resources, this.time, this.debug)

    //this.controls = new Controls(this.camera, this.canvas)
    this.controls = new FPSControls(
      this.camera,
      this.canvas,
      this.time,
      this.world.worldOctree
    )

    this.sizes.addCallback("resize", () => {
      this.resize()
    })

    this.time.addCallback("tick", () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.controls.update()
    this.world.update()
    this.renderer.update()

    if (this.debug.stats) this.debug.stats.update()
  }

  destroy() {
    this.sizes.removeCallback("resize")
    this.time.removeCallback("tick")

    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose()

        for (const key in child.material) {
          const value = child.material[key]

          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    this.renderer.instance.dispose()

    if (this.debug.active) this.debug.ui.destroy()
  }
}
