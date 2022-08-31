import { Scene } from "three"
import { Octree } from "three/examples/jsm/math/Octree.js"
import Environment from "./Environment"
import Floor from "./Floor"
import Terrain from "./Terrain"
import Cube from "./Cube"
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
  terrain: Terrain
  cube: Cube
  fox: Fox
  rat: Rat
  debug: Debug
  worldOctree: Octree

  constructor(scene: Scene, resources: Resources, time: Time, debug: Debug) {
    this.scene = scene
    this.resources = resources
    this.time = time
    this.debug = debug

    this.worldOctree = new Octree()

    this.resources.addCallback("ready", () => {
      this.floor = new Floor(this.scene, this.resources)
      this.terrain = new Terrain(this.scene)
      this.cube = new Cube(this.scene)
      this.fox = new Fox(this.scene, this.resources, this.time, this.debug)
      //this.rat = new Rat(this.scene, this.resources, this.time, this.debug)
      this.environment = new Environment(this.scene, this.resources, this.debug)
      this.worldOctree.fromGraphNode(this.scene)
    })
  }

  update() {
    if (this.fox) this.fox.update()
    if (this.rat) this.rat.update()
  }
}
