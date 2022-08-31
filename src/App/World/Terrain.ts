import {
  Scene,
  Texture,
  PlaneGeometry,
  sRGBEncoding,
  RepeatWrapping,
  Mesh,
  MeshPhongMaterial,
  Vector2,
  BufferAttribute,
  Color,
} from "three"
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise"

export default class Floor {
  scene: Scene
  noise: ImprovedNoise
  geometry: PlaneGeometry
  material: MeshPhongMaterial
  mesh: Mesh

  constructor(scene: Scene) {
    this.scene = scene

    this.noise = new ImprovedNoise()

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setHeights()
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(1000, 1000, 100, 100)
  }

  setMaterial() {
    this.material = new MeshPhongMaterial()
    this.material.flatShading = true
    this.material.color = new Color("green")
    this.material.wireframe = false
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }

  setHeights() {
    const multiplier = 2
    const amplitude = 100

    let pos = this.geometry.attributes.position
    let uv = this.geometry.attributes.uv
    let vec2 = new Vector2()

    for (let i = 0; i < pos.count; i++) {
      vec2
        .fromBufferAttribute(uv as BufferAttribute, i)
        .multiplyScalar(multiplier)
      pos.setZ(i, this.noise.noise(vec2.x, vec2.y, 0) * amplitude)
    }
  }
}
