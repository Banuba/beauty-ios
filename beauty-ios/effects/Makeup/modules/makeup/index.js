'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const makeup = require('./makeup.vert.js');
const makeup$1 = require('./makeup.frag.js');
const MakeupNull = require('./MakeupNull.png.js');
const contour = require('./contour.png.js');
const blushes = require('./blushes.png.js');
const highlighter = require('./highlighter.png.js');
const eyeshadow = require('./eyeshadow.png.js');
const eyeliner = require('./eyeliner.png.js');
const eyelashes = require('./eyelashes.png.js');

class Makeup {
    __init() {this._makeup = new mesh.Mesh(
    new geometry.FaceGeometry(),
    new material.ShaderMaterial({
      vertexShader: makeup['default'],
      fragmentShader: makeup$1['default'],
      uniforms: {
        tex_contour: new texture.Image(MakeupNull['default']),
        tex_blushes: new texture.Image(MakeupNull['default']),
        tex_highlighter: new texture.Image(MakeupNull['default']),
        tex_eyeshadow: new texture.Image(MakeupNull['default']),
        tex_eyeliner: new texture.Image(MakeupNull['default']),
        tex_lashes: new texture.Image(MakeupNull['default']),
        tex_makeup: new texture.Image(MakeupNull['default']),

        var_contour_color: new attribute.Vector4(0, 0, 0, 1),
        var_blushes_color: new attribute.Vector4(0, 0, 0, 1),
        var_highlighter_color: new attribute.Vector4(0, 0, 0, 1),
        var_eyeshadow_color: new attribute.Vector4(0, 0, 0, 1),
        var_eyeliner_color: new attribute.Vector4(0, 0, 0, 1),
        var_lashes_color: new attribute.Vector4(0, 0, 0, 1),
      },
    }),
  );}

  constructor() {Makeup.prototype.__init.call(this);
    this._makeup.visible(false);

    scene.add(this._makeup);
  }

  set(filename) {
    this._makeup.visible(true);
    this._makeup.material.uniforms.tex_makeup.load(filename);
  }

  

  contour(value) {
    this._makeup.visible(true);

    if (isUrl(value)) {
      this._makeup.material.uniforms.tex_contour.load(value);
      return
    }

    if (this._makeup.material.uniforms.tex_contour.filename === MakeupNull['default']) {
      this._makeup.material.uniforms.tex_contour.load(contour['default']);
    }

    this._makeup.material.uniforms.var_contour_color.value(value);
  }

  

  blushes(value) {
    this._makeup.visible(true);

    if (isUrl(value)) {
      this._makeup.material.uniforms.tex_blushes.load(value);
      return
    }

    if (this._makeup.material.uniforms.tex_blushes.filename === MakeupNull['default']) {
      this._makeup.material.uniforms.tex_blushes.load(blushes['default']);
    }

    this._makeup.material.uniforms.var_blushes_color.value(value);
  }

  

  highlighter(value) {
    this._makeup.visible(true);

    if (isUrl(value)) {
      this._makeup.material.uniforms.tex_highlighter.load(value);
      return
    }

    if (this._makeup.material.uniforms.tex_highlighter.filename === MakeupNull['default']) {
      this._makeup.material.uniforms.tex_highlighter.load(highlighter['default']);
    }

    this._makeup.material.uniforms.var_highlighter_color.value(value);
  }

  

  eyeshadow(value) {
    this._makeup.visible(true);

    if (isUrl(value)) {
      this._makeup.material.uniforms.tex_eyeshadow.load(value);
      return
    }

    if (this._makeup.material.uniforms.tex_eyeshadow.filename === MakeupNull['default']) {
      this._makeup.material.uniforms.tex_eyeshadow.load(eyeshadow['default']);
    }

    this._makeup.material.uniforms.var_eyeshadow_color.value(value);
  }

  

  eyeliner(value) {
    this._makeup.visible(true);

    if (isUrl(value)) {
      this._makeup.material.uniforms.tex_eyeliner.load(value);
      return
    }

    if (this._makeup.material.uniforms.tex_eyeliner.filename === MakeupNull['default']) {
      this._makeup.material.uniforms.tex_eyeliner.load(eyeliner['default']);
    }

    this._makeup.material.uniforms.var_eyeliner_color.value(value);
  }

  

  lashes(value) {
    this._makeup.visible(true);

    if (isUrl(value)) {
      this._makeup.material.uniforms.tex_lashes.load(value);
      return
    }

    if (this._makeup.material.uniforms.tex_lashes.filename === MakeupNull['default']) {
      this._makeup.material.uniforms.tex_lashes.load(eyelashes['default']);
    }

    this._makeup.material.uniforms.var_lashes_color.value(value);
  }

  /** Removes the eyes color, resets any settings applied */
  clear() {
    this.set(MakeupNull['default']);
    this.contour("0 0 0 0");
    this.contour(MakeupNull['default']);
    this.blushes("0 0 0 0");
    this.blushes(MakeupNull['default']);
    this.highlighter("0 0 0 0");
    this.highlighter(MakeupNull['default']);
    this.eyeshadow("0 0 0 0");
    this.eyeshadow(MakeupNull['default']);
    this.eyeliner("0 0 0 0");
    this.eyeliner(MakeupNull['default']);
    this.lashes("0 0 0 0");
    this.lashes(MakeupNull['default']);

    this._makeup.visible(false);
  }
}

function isUrl(str) {
  return /^\S+\.\w+$/.test(str)
}

exports.Makeup = Makeup;
