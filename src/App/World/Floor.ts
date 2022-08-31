import {
  Scene,
  Texture,
  CircleGeometry,
  sRGBEncoding,
  RepeatWrapping,
  Mesh,
  MeshStandardMaterial,
} from "three"
import Resources from "../Utils/Resources"

export default class Floor {
  scene: Scene
  resources: Resources
  geometry: CircleGeometry
  textures: {
    color: Texture
    normal: Texture
  }
  material: MeshStandardMaterial
  mesh: Mesh

  constructor(scene: Scene, resources: Resources) {
    this.scene = scene
    this.resources = resources

    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new CircleGeometry(10, 64)
  }

  setTextures() {
    this.textures = {
      color: this.resources.items.grassColorTexture,
      normal: this.resources.items.grassNormalTexture,
    }

    this.textures.color.encoding = sRGBEncoding
    this.textures.color.repeat.set(1.5, 1.5)
    this.textures.color.wrapS = RepeatWrapping
    this.textures.color.wrapT = RepeatWrapping

    this.textures.normal.repeat.set(1.5, 1.5)
    this.textures.normal.wrapS = RepeatWrapping
    this.textures.normal.wrapT = RepeatWrapping
  }

  setMaterial() {
    this.material = new MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}
