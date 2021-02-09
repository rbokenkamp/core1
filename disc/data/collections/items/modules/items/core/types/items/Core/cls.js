module.exports = class extends PreCore.classes.Workflow {

  construct(params) {
    PreCore.core = this
    this.initDisc(params.disc)
    this.paths = {}
    this.index = 0
    this.source("", this)
    this.initClasses()
    delete this.paths
    Object.assign(params, this)
    super.construct(this)
  }

  initDisc(disc) {
    const {type} = disc,
        cls = PreCore.classes[type],
        target = new cls()

    Object.assign(target, disc)
    this.disc = target
  }

  build(params) {
    super.build(params)
    PreCore.stage = "core"
  }

  source(path, current) {
    const {paths, disc} = this

    const items = disc.read(path)
    for (const item of items) {
      const [key, ext] = item.split(".")
      const itemPath = path + "/" + key
      if (ext === undefined) {
        current[key] = this.source(itemPath, current[key] || {})
        continue
      }
      if (ext == "js") {
        if (key === "cls") {
          paths[path.substr(path.lastIndexOf("/") + 1)] = path
          continue
        }
        current[key] = disc.require(itemPath)
      }
    }
    return current
  }

  initClasses() {
    const {paths, disc} = this,
        {types, classes, merge, getErrors} = PreCore

    let processing = true
    while (processing) {
      processing = false
      for (const key in paths) {
        const path = paths[key],
            keyPath = path.substr(1)

        let typeObj = this.get(keyPath)
        const {extend} = typeObj
        if (extend === undefined || extend in paths === false) {
          if (extend) {
            typeObj = merge(types[extend], typeObj)
            this._set(keyPath, typeObj)
          }
          getErrors(typeObj.fixed)
          getErrors(typeObj.instance)
          classes[key] = disc.require(path + "/cls")
          types[key] = typeObj
          delete paths[key]
          continue
        }
        processing = true
      }
    }
  }

}