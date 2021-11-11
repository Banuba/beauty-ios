'use strict';

const texture = require('./texture.js');
const mesh = require('./mesh.js');
const geometry = require('./geometry.js');
const material = require('./material.js');
const renderTarget = require('./render-target.js');

const assets = bnb.scene.getAssetManager();

let target;

// compatibility with converted legacy effects
{
  const list = bnb.scene.getRenderList();
  const size = list.getTasksCount();

  const camera = assets.findImage("camera");
  const isCameraProceduralTexture = camera && camera.asProceduralTexture(); // FIXME: cannot use `camera.getType()` since it crashes viewer ¯\_(ツ)_/¯

  // last render target is screen's one
  if (size > (isCameraProceduralTexture ? 0 : 1)) {
    target = list.getTaskTarget(size - 1);
  }
  if (target && target.getName().startsWith("_scene_")) {
    target = null;
  }
}

let screen = new renderTarget.RenderTarget({ target });

if (!target) {
  const CameraBackground = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.BlitMaterial(new texture.Camera(), { blending: "OFF" }),
  );

  screen.add(CameraBackground);
}

const add = (...meshes) => {
  for (const mesh of meshes) {
    screen.add(mesh);
  }
};

class Scene  {
    __init() {this._target = new renderTarget.RenderTarget();}

  get $$() {
    return this._target.texture.$$
  }

  constructor() {Scene.prototype.__init.call(this);
    this._target = screen;

    const scene = new mesh.Mesh(
      new geometry.PlaneGeometry(),
      new material.BlitMaterial(this._target.texture, { blending: "OFF" }),
    );

    screen = new renderTarget.RenderTarget();
    screen.add(scene);
  }
}

exports.Scene = Scene;
exports.add = add;
