import {
  Scene,
  DirectionalLight,
  sRGBEncoding,
  Mesh,
  MeshStandardMaterial,
} from "three"
import Resources from "../Utils/Resources"
import Debug from "../Utils/Debug"
import { GUI } from "lil-gui"

export default class Environment {
  scene: Scene
  resources: Resources
  debug: Debug
  debugFolder: GUI

  constructor(scene: Scene, resources: Resources, debug: Debug) {
    this.scene = scene
    this.resources = resources
    this.debug = debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment")
    }

    this.addSunLight()

    this.addEnvironmentMap()
  }

  addSunLight() {
    const sunLight = new DirectionalLight("#ffffff", 4)
    sunLight.castShadow = true
    sunLight.shadow.camera.far = 15
    sunLight.shadow.mapSize.set(1024, 1024)
    sunLight.shadow.normalBias = 0.05
    sunLight.position.set(3, 3, -2.25)

    this.scene.add(sunLight)

    if (this.debug.active) {
      this.debugFolder
        .add(sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001)

      this.debugFolder
        .add(sunLight.position, "x")
        .name("sunLightX")
        .min(-5)
        .max(5)
        .step(0.001)

      this.debugFolder
        .add(sunLight.position, "y")
        .name("sunLightY")
        .min(-5)
        .max(5)
        .step(0.001)

      this.debugFolder
        .add(sunLight.position, "z")
        .name("sunLightZ")
        .min(-5)
        .max(5)
        .step(0.001)
    }
  }

  addEnvironmentMap() {
    const environmentMap = {
      intensity: 0.4,
      texture: this.resources.items.environmentMapTexture,
      updateMaterials: () => {
        this.scene.traverse((child) => {
          if (
            child instanceof Mesh &&
            child.material instanceof MeshStandardMaterial
          ) {
            child.material.envMap = environmentMap.texture
            child.material.envMapIntensity = environmentMap.intensity
            child.material.needsUpdate = true
          }
        })
      },
    }

    this.scene.environment = environmentMap.texture
    environmentMap.texture.encoding = sRGBEncoding
    environmentMap.updateMaterials()

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(environmentMap, "intensity")
        .name("envMapIntensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(environmentMap.updateMaterials)
    }
  }
}
