import { TextureLoader, CubeTextureLoader } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import Events from "./Events"

export default class Resources extends Events {
  sources: { name: string; type: string; path: string | string[] }[]
  items: { [name: string]: any }
  toLoad: number
  loaded: number
  loaders: {
    gltfLoader: GLTFLoader
    textureLoader: TextureLoader
    cubeTextureLoader: CubeTextureLoader
  }

  constructor(
    sources: { name: string; type: string; path: string | string[] }[]
  ) {
    super()

    this.sources = sources

    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new TextureLoader(),
      cubeTextureLoader: new CubeTextureLoader(),
    }
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path as string, (file) => {
          this.sourceLoaded(source, file)
        })
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path as string, (file) => {
          this.sourceLoaded(source, file)
        })
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path as string[], (file) => {
          this.sourceLoaded(source, file)
        })
      }
    }
  }

  sourceLoaded(
    source: { name: string; type: string; path: string | string[] },
    file: any
  ) {
    this.items[source.name] = file

    this.loaded++

    if (this.loaded === this.toLoad) {
      this.trigger()
    }
  }
}
