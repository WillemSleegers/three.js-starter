import { Scene } from "three"
import Environment from "./Environment"
import Floor from "./Floor"
import Fox from "./Fox"
import Rat from "./Rat"
import Resources from "../Utils/Resources"
import Time from "../Utils/Time"
import Debug from "../Utils/Debug"

export default class World {
  scene: Scene
  environment: Environment
  time: Time
  resources: Resources
  floor: Floor
  fox: Fox
  rat: Rat
  debug: Debug

  constructor(scene: Scene, resources: Resources, time: Time, debug: Debug) {
    this.scene = scene
    this.resources = resources
    this.time = time
    this.debug = debug

    this.resources.addCallback("ready", () => {
      this.floor = new Floor(this.scene, this.resources)
      this.fox = new Fox(this.scene, this.resources, this.time, this.debug)
      this.rat = new Rat(this.scene, this.resources, this.time, this.debug)
      this.environment = new Environment(this.scene, this.resources, this.debug)
    })
  }

  update() {
    if (this.fox) this.fox.update()
    if (this.rat) this.rat.update()
  }
}
