import {
  Scene,
  Mesh,
  AnimationMixer,
  AnimationAction,
  AnimationClip,
} from "three"
import Resources from "../Utils/Resources"
import Time from "../Utils/Time"
import Debug from "../Utils/Debug"
import { GUI } from "lil-gui"

export default class Fox {
  scene: Scene
  resources: Resources
  resource: {
    scene: Scene
    animations: AnimationClip[]
  }
  model: Scene
  animation: {
    mixer: AnimationMixer
    actions: {
      [name: string]: AnimationAction
      current: AnimationAction
    }
    play: Function
  }
  time: Time
  debug: Debug
  debugFolder: GUI

  constructor(scene: Scene, resources: Resources, time: Time, debug: Debug) {
    this.scene = scene
    this.resources = resources
    this.time = time

    this.resource = this.resources.items.foxModel

    this.setModel()
    this.setAnimation()

    // Debug
    this.debug = debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox")
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle")
        },
        playWalking: () => {
          this.animation.play("walking")
        },
        playRunning: () => {
          this.animation.play("running")
        },
      }
      this.debugFolder.add(debugObject, "playIdle")
      this.debugFolder.add(debugObject, "playWalking")
      this.debugFolder.add(debugObject, "playRunning")
    }
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.scene.add(this.model)

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    const mixer = new AnimationMixer(this.model)

    const idleAction = mixer.clipAction(this.resource.animations[0])
    const walkingAction = mixer.clipAction(this.resource.animations[1])
    const runningAction = mixer.clipAction(this.resource.animations[2])

    const actions = {
      idle: idleAction,
      walking: walkingAction,
      running: runningAction,
      current: idleAction,
    }

    const playFunction = (name: string) => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1, true)

      this.animation.actions.current = newAction
    }

    this.animation = {
      mixer: mixer,
      actions: actions,
      play: playFunction,
    }

    this.animation.actions.current.play()
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
