import {
  Scene,
  Texture,
  BoxGeometry,
  sRGBEncoding,
  RepeatWrapping,
  Mesh,
  MeshStandardMaterial,
} from "three"
import Resources from "../Utils/Resources"

export default class Floor {
  scene: Scene
  geometry: BoxGeometry
  material: MeshStandardMaterial
  mesh: Mesh

  constructor(scene: Scene) {
    this.scene = scene

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1)
  }

  setMaterial() {
    this.material = new MeshStandardMaterial()
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.set(5, 0.5, 1)
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}
