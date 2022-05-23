export default class Events {
  callbacks: { name: string; callback: Function }[]

  constructor() {
    this.callbacks = []
  }

  addCallback(name: string, callback: Function) {
    if (this.callbacks.some((callback) => callback.name == name)) {
      throw "Callback already exists."
    } else {
      this.callbacks.push({ name: name, callback: callback })
    }
  }

  removeCallback(name: string) {
    this.callbacks = this.callbacks.filter((callback) => callback.name != name)
  }

  trigger() {
    this.callbacks.forEach((callback) => callback.callback())
  }
}
