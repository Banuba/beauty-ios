'use strict';

const geometry = require('./geometry.js');
const utils = require('./utils.js');

class Mesh {
    constructor(geometry, material) {
        Object.defineProperty(this, "_parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_visible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utils.createNanoEvents()
        });
        Object.defineProperty(this, "geometry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "material", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        return this._visible;
    }
    onVisibilityChange(listener) {
        this._emitter.on("visible", listener);
    }
}
const isFaceMesh = (mesh) => (mesh === null || mesh === void 0 ? void 0 : mesh.geometry) instanceof geometry.FaceGeometry;
const getFace = (mesh) => {
    if (!mesh)
        return null;
    if (isFaceMesh(mesh))
        return mesh;
    return getFace(mesh["_parent"]);
};

exports.Mesh = Mesh;
exports.getFace = getFace;
exports.isFaceMesh = isFaceMesh;
