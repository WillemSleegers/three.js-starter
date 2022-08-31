import { Scene, Euler, Vector3 } from "three"
import { Octree } from "three/examples/jsm/math/Octree.js"
import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js"
import { Capsule } from "three/examples/jsm/math/Capsule.js"
import Camera from "./Camera"
import Time from "./Utils/Time"

export default class FPSControls {
  camera: Camera
  canvas: HTMLElement
  time: Time
  scene: Scene
  worldOctree: Octree

  isLocked: boolean
  minPolarAngle: number
  maxPolarAngle: number

  vec: Vector3

  movingForward: boolean
  movingBackward: boolean
  movingLeft: boolean
  movingRight: boolean
  movingUp: boolean
  movingDown: boolean

  canFly: boolean
  canJump: boolean

  keyStates: { [key: string]: boolean }

  playerVelocity: Vector3
  playerDirection: Vector3
  playerOnFloor: boolean
  playerCollider: Capsule

  velocity: Vector3
  direction: Vector3
  euler: Euler

  speeds: {
    momentum: number
    camera: number
    runSpeed: number
    runMultiplier: number
    flySpeed: number
    gravity: number
    jump: number
  }

  constructor(
    camera: Camera,
    canvas: HTMLElement,
    time: Time,
    worldOctree: Octree
  ) {
    this.camera = camera
    this.canvas = canvas
    this.time = time
    this.worldOctree = worldOctree

    // Constrain the pitch of the camera
    this.minPolarAngle = 0
    this.maxPolarAngle = Math.PI

    this.euler = new Euler(0, 0, 0, "YXZ")
    this.vec = new Vector3()

    this.keyStates = {}

    this.playerCollider = new Capsule(
      new Vector3(2, 0.35, 2),
      new Vector3(2, 1, 2),
      0.35
    )

    this.playerVelocity = new Vector3()
    this.playerDirection = new Vector3()
    this.playerOnFloor = false

    this.velocity = new Vector3()
    this.direction = new Vector3()

    this.isLocked = false

    this.canFly = false
    this.canJump = true

    this.speeds = {
      camera: 0.002,
      momentum: 3,
      runSpeed: 1.42,
      runMultiplier: 5,
      flySpeed: 0.1,
      gravity: 1,
      jump: 3,
    }

    this.connect()
  }

  private onMouseMove(event: MouseEvent) {
    if (this.isLocked === false) return

    const movementX = event.movementX || 0
    const movementY = event.movementY || 0

    this.euler.setFromQuaternion(this.camera.instance.quaternion)

    this.euler.y -= movementX * this.speeds.camera
    this.euler.x -= movementY * this.speeds.camera

    this.euler.x = Math.max(
      Math.PI / 2 - this.maxPolarAngle,
      Math.min(Math.PI / 2 - this.minPolarAngle, this.euler.x)
    )

    this.camera.instance.quaternion.setFromEuler(this.euler)
  }

  private onPointerlockChange() {
    if (this.canvas.ownerDocument.pointerLockElement === this.canvas) {
      this.canvas.requestPointerLock()
      this.isLocked = true
    } else {
      this.canvas.ownerDocument.exitPointerLock()
      this.isLocked = false
    }
  }

  private onPointerlockError() {
    console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")
  }

  connect() {
    this.canvas.ownerDocument.addEventListener("click", () => {
      this.canvas.requestPointerLock()
    })

    this.canvas.ownerDocument.addEventListener("mousemove", (event) => {
      this.onMouseMove(event)
    })

    document.addEventListener("keydown", (event) => {
      this.keyStates[event.code] = true
    })

    document.addEventListener("keyup", (event) => {
      this.keyStates[event.code] = false
    })

    //document.addEventListener("keydown", (event) => this.onKeyDown(event))
    //document.addEventListener("keyup", (event) => this.onKeyUp(event))

    this.canvas.ownerDocument.addEventListener("pointerlockchange", () =>
      this.onPointerlockChange()
    )
    this.canvas.ownerDocument.addEventListener("pointerlockerror", () =>
      this.onPointerlockError()
    )
  }

  disconnect() {
    this.canvas.ownerDocument.removeEventListener("click", () => {
      this.canvas.requestPointerLock()
    })
    this.canvas.ownerDocument.removeEventListener("mousemove", (event) =>
      this.onMouseMove(event)
    )

    document.removeEventListener("keydown", (event) => {
      this.keyStates[event.code] = true
    })

    document.removeEventListener("keyup", (event) => {
      this.keyStates[event.code] = false
    })

    //document.removeEventListener("keydown"), (event) => this.onKeyDown(event))
    //document.removeEventListener("keyup", (event) => this.onKeyUp(event))
    this.canvas.ownerDocument.removeEventListener("pointerlockchange", () =>
      this.onPointerlockChange()
    )
    this.canvas.ownerDocument.removeEventListener("pointerlockerror", () =>
      this.onPointerlockError()
    )
  }

  dispose() {
    this.disconnect()
  }

  getForwardVector() {
    this.camera.instance.getWorldDirection(this.playerDirection)
    this.playerDirection.y = 0
    this.playerDirection.normalize()

    return this.playerDirection
  }

  getSideVector() {
    this.camera.instance.getWorldDirection(this.playerDirection)
    this.playerDirection.y = 0
    this.playerDirection.normalize()
    this.playerDirection.cross(this.camera.instance.up)

    return this.playerDirection
  }

  controls(deltaTime: number) {
    const speed = this.playerOnFloor
      ? this.speeds.runSpeed
      : this.speeds.flySpeed
    let speedDelta = deltaTime * speed

    if (this.keyStates["KeyW"]) {
      if (this.keyStates["ShiftLeft"]) {
        speedDelta *= this.speeds.runMultiplier
      }
      this.playerVelocity.add(
        this.getForwardVector().multiplyScalar(speedDelta)
      )
    }

    if (this.keyStates["KeyS"]) {
      if (this.keyStates["ShiftLeft"]) {
        speedDelta *= this.speeds.runMultiplier
      }

      this.playerVelocity.add(
        this.getForwardVector().multiplyScalar(-speedDelta)
      )
    }

    if (this.keyStates["KeyA"]) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta))
    }

    if (this.keyStates["KeyD"]) {
      this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta))
    }

    if (this.playerOnFloor) {
      if (this.keyStates["Space"]) {
        this.playerVelocity.y = this.speeds.jump
      }
    }
  }

  playerCollisions() {
    const result = this.worldOctree.capsuleIntersect(this.playerCollider)

    if (result) {
      this.playerOnFloor = result.normal.y <= 1

      if (!this.playerOnFloor) {
        this.playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(this.playerVelocity)
        )
      }

      this.playerCollider.translate(result.normal.multiplyScalar(result.depth))
    } else {
      // if there is no collision with any of the objects, the player is flying
      this.playerOnFloor = false
    }
  }

  updatePlayer(deltaTime: number) {
    let damping = Math.exp(-this.speeds.momentum * deltaTime) - 1

    if (!this.playerOnFloor) {
      // gravity
      this.playerVelocity.y -= this.speeds.gravity * deltaTime

      // small air resistance
      damping *= 0.1
    }

    this.playerVelocity.addScaledVector(this.playerVelocity, damping)

    const deltaPosition = this.playerVelocity.clone().multiplyScalar(deltaTime)
    this.playerCollider.translate(deltaPosition)

    this.playerCollisions()

    this.camera.instance.position.copy(this.playerCollider.end)
  }

  update() {
    const deltaTime = this.time.delta / 1000

    const steps = 5

    for (let i = 0; i < steps; i++) {
      this.controls(deltaTime * (5 / steps))
      this.updatePlayer(deltaTime * (5 / steps))
    }
  }
}

export { FPSControls }
