'use strict';

const geometry = require('./geometry.js');
const utils = require('./utils.js');

function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

class Mesh


 {
   __init() {this._parent = null;}
   __init2() {this._visible = true;}
    __init3() {this._emitter = utils.createNanoEvents();}

  
  

  constructor(geometry, material) {Mesh.prototype.__init.call(this);Mesh.prototype.__init2.call(this);Mesh.prototype.__init3.call(this);
    this.geometry = geometry;
    this.material = material;
  }

  add(child) {
    child._parent = this;
  }

  visible(value) {
    if (typeof value !== "undefined") {
      this._visible = value;
      this._emitter.emit("visible", this._visible);
    }

    return this._visible
  }

  onVisibilityChange(listener) {
    this._emitter.on("visible", listener);
  }
}

const isFaceMesh = (mesh) =>
  _optionalChain([mesh, 'optionalAccess', _ => _.geometry]) instanceof geometry.FaceGeometry;

const getFace = (mesh) => {
  if (!mesh) return null
  if (isFaceMesh(mesh)) return mesh
  return getFace(mesh["_parent"])
};

exports.Mesh = Mesh;
exports.getFace = getFace;
exports.isFaceMesh = isFaceMesh;
