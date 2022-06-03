import { Euler, Vector3 } from "three"
import Camera from "./Camera"
import Time from "./Utils/Time"

export default class FPSControls {
  camera: Camera
  canvas: HTMLElement
  time: Time

  isLocked: boolean
  minPolarAngle: number
  maxPolarAngle: number

  changeEvent: { type: string }
  lockEvent: { type: string }
  unlockEvent: { type: string }

  vec: Vector3

  movingForward: boolean
  movingBackward: boolean
  movingLeft: boolean
  movingRight: boolean
  movingUp: boolean
  movingDown: boolean

  canFly: boolean
  canJump: boolean

  velocity: Vector3
  direction: Vector3
  euler: Euler

  speeds: {
    momentum: number
    runSpeed: number
    gravity: number
    jump: number
  }

  constructor(camera: Camera, canvas: HTMLElement, time: Time) {
    this.camera = camera
    this.canvas = canvas
    this.time = time

    // Constrain the pitch of the camera
    this.minPolarAngle = 0
    this.maxPolarAngle = Math.PI

    this.euler = new Euler(0, 0, 0, "YXZ")
    this.vec = new Vector3()
    this.velocity = new Vector3()
    this.direction = new Vector3()

    this.movingForward = false
    this.movingBackward = false
    this.movingLeft = false
    this.movingRight = false
    this.movingUp = false
    this.movingDown = false

    this.isLocked = false

    this.canFly = false
    this.canJump = true

    this.speeds = {
      momentum: 0.016,
      runSpeed: 0.0025,
      gravity: 0.001,
      jump: 0.25,
    }

    this.connect()
  }

  private onMouseMove(event: MouseEvent) {
    if (this.isLocked === false) return

    var movementX = event.movementX || 0
    var movementY = event.movementY || 0

    this.euler.setFromQuaternion(this.camera.instance.quaternion)

    this.euler.y -= movementX * 0.002
    this.euler.x -= movementY * 0.002

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

  private onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.movingForward = true
        break

      case "ArrowLeft":
      case "KeyA":
        this.movingLeft = true
        break

      case "ArrowDown":
      case "KeyS":
        this.movingBackward = true
        break

      case "ArrowRight":
      case "KeyD":
        this.movingRight = true
        break

      case "Space":
        if (this.canFly === true) {
          this.movingUp = true
        } else if (this.canJump === true) {
          this.velocity.y += this.speeds.jump
          this.canJump = false
        }
        break

      case "ControlLeft":
        this.movingDown = true
        break

      case "KeyF":
        if (this.canFly === true) {
          this.canFly = false
        } else {
          this.canFly = true
        }
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        this.movingForward = false
        break

      case "ArrowLeft":
      case "KeyA":
        this.movingLeft = false
        break

      case "ArrowDown":
      case "KeyS":
        this.movingBackward = false
        break

      case "ArrowRight":
      case "KeyD":
        this.movingRight = false
        break

      case "Space":
        this.movingUp = false
        break

      case "ControlLeft":
        this.movingDown = false
        break
    }
  }

  private onPointerlockError() {
    console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")
  }

  connect() {
    this.canvas.ownerDocument.addEventListener("click", () => {
      this.canvas.requestPointerLock()
    })
    this.canvas.ownerDocument.addEventListener("mousemove", (event) =>
      this.onMouseMove(event)
    )
    document.addEventListener("keydown", (event) => this.onKeyDown(event))
    document.addEventListener("keyup", (event) => this.onKeyUp(event))
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
    document.removeEventListener("keydown", (event) => this.onKeyDown(event))
    document.removeEventListener("keyup", (event) => this.onKeyUp(event))
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

  // retaining this method for backward compatibility
  getObject() {
    return this.camera
  }

  moveForward(distance: number) {
    // move forward parallel to the xz-plane
    // assumes camera.up is y-up
    this.vec.setFromMatrixColumn(this.camera.instance.matrix, 0)

    this.vec.crossVectors(this.camera.instance.up, this.vec)

    this.camera.instance.position.addScaledVector(this.vec, distance)
  }

  moveRight(distance: number) {
    this.vec.setFromMatrixColumn(this.camera.instance.matrix, 0)

    this.camera.instance.position.addScaledVector(this.vec, distance)
  }

  moveUp(distance: number) {
    this.euler.setFromQuaternion(this.camera.instance.quaternion)

    this.camera.instance.position.addScaledVector(
      this.camera.instance.up,
      distance
    )
  }

  update() {
    if (this.isLocked === true) {
      const delta = this.time.delta
      const direction = this.direction
      const velocity = this.velocity
      const speeds = this.speeds

      // determine direction by converting the boolean value to a number and subtracting them
      direction.z = Number(this.movingForward) - Number(this.movingBackward) // 1 = forward; -1 = backward; 0 = neither
      direction.y = Number(this.movingUp) - Number(this.movingDown) // 1 = up; -1 = down; 0 = neither
      direction.x = Number(this.movingRight) - Number(this.movingLeft) // 1 = right; -1 = left; 0 = neither

      direction.normalize() // this ensures consistent movements in all directions

      // add direction to velocity as long as the button is pressed, which equals the speed
      if (this.movingForward || this.movingBackward)
        velocity.z -= direction.z * speeds.runSpeed * delta
      if (this.movingLeft || this.movingRight)
        velocity.x -= direction.x * speeds.runSpeed * delta

      // reduce velocity over time (momentum)
      velocity.z -= velocity.z * speeds.momentum * delta
      velocity.x -= velocity.x * speeds.momentum * delta

      // move
      this.moveRight(-velocity.x)
      this.moveForward(-velocity.z)

      if (this.canFly === true) {
        // get the camera's position/angle
        this.euler.setFromQuaternion(this.camera.instance.quaternion)

        // add direction to velocity as long as the button is pressed
        if (this.movingForward || this.movingBackward)
          // add the camera's up-down angle to the velocity
          velocity.y -= direction.z * speeds.runSpeed * delta * this.euler.x
        if (this.movingUp || this.movingDown)
          velocity.y -= direction.y * speeds.runSpeed * delta

        // momentum
        velocity.y -= velocity.y * speeds.momentum * delta

        this.moveUp(-velocity.y)
      } else {
        // fall back after a jump
        velocity.y -= speeds.gravity * 1 * delta

        this.moveUp(velocity.y)

        // if the camera ever falls below 1, set the values to their default values
        if (this.camera.instance.position.y < 1) {
          velocity.y = 0
          this.camera.instance.position.y = 1

          this.canJump = true
        }
      }
    }
  }
}

export { FPSControls }
