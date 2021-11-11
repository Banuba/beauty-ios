'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const filter = require('./filter.vert.js');
const filter$1 = require('./filter.frag.js');
const null_lut = require('./null_lut.png.js');

class Filter {
    __init() {this._filter = new mesh.Mesh(
    new geometry.PlaneGeometry(),
    new material.ShaderMaterial({
      vertexShader: filter['default'],
      fragmentShader: filter$1['default'],
      uniforms: {
        tex_camera: new scene.Scene(),
        tex_filter: new texture.LUT(null_lut['default']),

        var_filter_strength: new attribute.Vector4(1),
      },
    }),
  );}

  constructor() {Filter.prototype.__init.call(this);
    this._filter.material.uniforms.var_filter_strength.subscribe(([strength]) => {
      const isVisible = strength > 0;
      this._filter.visible(isVisible);
    });

    scene.add(this._filter);
  }

  /** Sets the filter LUT */
  set(filename) {
    this._filter.material.uniforms.tex_filter.load(filename);
  }

  /** Sets the filter strength from 0 to 1 */
  strength(strength) {
    if (typeof strength !== "undefined")
      this._filter.material.uniforms.var_filter_strength.value(strength);
    return this._filter.material.uniforms.var_filter_strength.value()[0]
  }

  /** Resets any settings applied */
  clear() {
    this.set(null_lut['default']);
    this.strength(1);
  }
}

exports.Filter = Filter;
