import {
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  CineonToneMapping,
  PCFSoftShadowMap,
} from "three"
import Camera from "./Camera"
import Sizes from "./Utils/Sizes"

export default class Renderer {
  camera: Camera
  canvas: HTMLElement
  sizes: Sizes
  scene: Scene
  instance: WebGLRenderer

  constructor(camera: Camera, canvas: HTMLElement, scene: Scene, sizes: Sizes) {
    this.canvas = canvas
    this.sizes = sizes
    this.scene = scene
    this.camera = camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = sRGBEncoding
    this.instance.toneMapping = CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = PCFSoftShadowMap
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
