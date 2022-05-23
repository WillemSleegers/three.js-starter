import { Scene, Mesh } from "three"
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World/World"
import Debug from "./Utils/Debug"
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Resources from "./Utils/Resources"
import { sources } from "./sources"

export default class App {
  camera: Camera
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
    this.camera = new Camera(this.canvas, this.scene, this.sizes)
    this.renderer = new Renderer(
      this.camera,
      this.canvas,
      this.scene,
      this.sizes
    )
    this.resources = new Resources(sources)
    this.world = new World(this.scene, this.resources, this.time, this.debug)

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
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.removeCallback("resize")
    this.time.removeCallback("tick")

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose()

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key]

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if (this.debug.active) this.debug.ui.destroy()
  }
}
