'use strict';

const utils = require('./utils.js');

const assets = bnb.scene.getAssetManager();

class Geometry {
  

  constructor(filename, name) {
    name ??= utils.id("_scene_mesh");
    let mesh = assets.findMesh(name);

    if (!mesh) {
      mesh = assets.createMesh(name);
      assets.uploadMeshData(mesh, filename);
    }

    this.$$ = mesh;
  }
}

class PlaneGeometry extends Geometry {
  constructor() {
    super("$builtin$meshes/fs_tri", utils.id("_scene_plane"));
  }
}

class FaceGeometry extends Geometry {
  
   __init() {this.morphings = [];}

  constructor(index = 0) {
    super(`$builtin$meshes/face.stream:${index}`, `_scene_face${index}`);FaceGeometry.prototype.__init.call(this);
    this.index = index;
  }

  

  addMorphing(filename) {
    const morphing =
      filename === "$builtin$meshes/beauty" ? new BeautyMorphing() : new FaceMorphing(filename);

    this.morphings.push(morphing);

    return morphing
  }
}



class BeautyMorphing {
   __init2() {this._emitter = utils.createNanoEvents();}
   __init3() {this._weights = {
    eyes: 0,
    nose: 0,
    face: 0,
  };}

  

  constructor() {BeautyMorphing.prototype.__init2.call(this);BeautyMorphing.prototype.__init3.call(this);
    const name = utils.id("_scene_beauty_morphing");
    let mesh = assets.findMesh(name);

    if (!mesh) {
      mesh = assets.createMesh(name);
      assets.uploadMeshData(mesh, "$builtin$meshes/beauty");
    }

    this.$$ = mesh;
  }

  weight(type, value) {
    if (typeof value !== "undefined") {
      this._weights[type] = value;
      this._emitter.emit("weight", this._weights);
    }

    return this._weights[type]
  }

  subscribe(listener) {
    const unsubscribe = this._emitter.on("weight", listener);

    listener(this._weights);

    return unsubscribe
  }
}

class FaceMorphing {
   __init4() {this._emitter = utils.createNanoEvents();}
   __init5() {this._weight = 0;}

  

  constructor(filename) {FaceMorphing.prototype.__init4.call(this);FaceMorphing.prototype.__init5.call(this);
    const name = utils.id("_scene_face_morphing");
    let mesh = assets.findMesh(name);

    if (!mesh) {
      mesh = assets.createMesh(name);
      assets.uploadMeshData(mesh, filename);
    }

    this.$$ = mesh;
  }

  weight(value) {
    if (typeof value !== "undefined") {
      this._weight = value;
      this._emitter.emit("weight", this._weight);
    }

    return this._weight
  }

  subscribe(listener) {
    const unsubscribe = this._emitter.on("weight", listener);

    listener(this._weight);

    return unsubscribe
  }
}

const isGeometry = (obj) =>
  obj instanceof PlaneGeometry || obj instanceof FaceGeometry;

exports.BeautyMorphing = BeautyMorphing;
exports.FaceGeometry = FaceGeometry;
exports.FaceMorphing = FaceMorphing;
exports.Geometry = Geometry;
exports.PlaneGeometry = PlaneGeometry;
exports.isGeometry = isGeometry;
