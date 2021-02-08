const fs = require("fs")
const sass = require("sass")

const {floor} = Math

module.exports = class {

  initialize(params) {
    console.log("initialize")
    if (this.read("/headers") === undefined) {
      this.write("/headers")
    }
    this.populate("", this)
    this.scan("/data", this.headers, this.data)
  }

  populate(path, current) {
    const items = this.read(path)
    for (const item of items) {
      const [key, ext] = item.split(".")
      if (ext === undefined) {
        current[key] = this.populate(path + "/" + key, {})
        continue
      }
      const buffer = this.read(path + "/" + item)
      current[key] = buffer // this.transform(buffer, ext)
    }
    return current
  }


  scan(path, headers, data) {
   const time = this.getTime(path)
    const branches = headers.branches = headers.branches || {}

    Object.assign(headers, {
      created: time,
      updated: time
    })
    const items = this.read(path)
    for (const item of items) {
      const [key, ext] = item.split(".")
      branches[key] = branches[key] || {}
      if (ext === undefined) {
        this.scan(path + "/" + key, branches[key], data[key])
        continue
      }
      if (key === "cls") {
        debugger
      }
      const time = this.getTime(path + "/" + item)
      const buffer = data[key]
      const value = this.transform(buffer, ext)
      Object.assign(branches[key], {
        created: time,
        updated: time,
        ext,
        buffer,
      })
      data[key] = value
    }

//     currentHeaders.ext = ext
    //   const buffer = currentHeaders.buffer = data[key]
    //  const value = data[key] = this.transform(buffer, ext)


  }



}

/*
const item = ({disc, self, input}) => {
  const {path} = input
  const {home}
  const full = home + path
  const stats = fs.statSync(full)
  const time = floor(stats.mtimeMs)
  const index = path.lastIndexOf("/")
  const dir = path.substr(0, index)
  const item = path.substr(index + 1)
  const [key, ext] = item.split(".")
  const header = {created: time, updated: time, key}
  if (ext === undefined) {
    console.log("SET", header, 0)
    return
  }
  const binary = extensions[ext]
  if (binary === undefined) {
    throw `Unknown extension ${ext}`
  }
  const buffer = header.buffer = fs.readFileSync(full)
  header.ext = ext
  let value

  console.log("SET", header, value)
}

const scan = ({self, input}) => {
  const {path} = input
  const items = fs.readdirSync
}

const self = {
  header: {},
  data: {
    key: "disc",
    type: "NodeDisc",
    module: "node",
    home,
  },
}
item({disc: self, self, input: {path: ""}})
*/