'use strict';

const utils = require('./utils.js');

const assets = bnb.scene.getAssetManager();
class Geometry {
    constructor(filename, name) {
        Object.defineProperty(this, "$$", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        name !== null && name !== void 0 ? name : (name = utils.id("_scene_mesh"));
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
    constructor(index = 0) {
        super(`$builtin$meshes/face.stream:${index}`, `_scene_face${index}`);
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "morphings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.index = index;
    }
    addMorphing(filename) {
        const morphing = filename === "$builtin$meshes/beauty" ? new BeautyMorphing() : new FaceMorphing(filename);
        this.morphings.push(morphing);
        return morphing;
    }
}
class BeautyMorphing {
    constructor() {
        Object.defineProperty(this, "_emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utils.createNanoEvents()
        });
        Object.defineProperty(this, "_weights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                eyes: 0,
                nose: 0,
                face: 0,
            }
        });
        Object.defineProperty(this, "$$", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        return this._weights[type];
    }
    subscribe(listener) {
        const unsubscribe = this._emitter.on("weight", listener);
        listener(this._weights);
        return unsubscribe;
    }
}
class FaceMorphing {
    constructor(filename) {
        Object.defineProperty(this, "_emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utils.createNanoEvents()
        });
        Object.defineProperty(this, "_weight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "$$", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        return this._weight;
    }
    subscribe(listener) {
        const unsubscribe = this._emitter.on("weight", listener);
        listener(this._weight);
        return unsubscribe;
    }
}
const isGeometry = (obj) => obj instanceof PlaneGeometry || obj instanceof FaceGeometry;

exports.BeautyMorphing = BeautyMorphing;
exports.FaceGeometry = FaceGeometry;
exports.FaceMorphing = FaceMorphing;
exports.Geometry = Geometry;
exports.PlaneGeometry = PlaneGeometry;
exports.isGeometry = isGeometry;
