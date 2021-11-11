'use strict';

const attribute = require('../scene/attribute.js');
const geometry = require('../scene/geometry.js');
const material = require('../scene/material.js');
const mesh = require('../scene/mesh.js');
require('../scene/render-target.js');
const scene = require('../scene/scene.js');
const texture = require('../scene/texture.js');
const eyelashes = require('./eyelashes.bsm2.js');
const eyelashes$1 = require('./eyelashes.vert.js');
const eyelashes$2 = require('./eyelashes.frag.js');
const eyelashes$3 = require('./eyelashes.png.js');

class Eyelashes {
   __init() {this._face = new mesh.Mesh(
    new geometry.FaceGeometry(),
    [],
  );}
   __init2() {this._lashes = new mesh.Mesh(
    new geometry.Geometry(eyelashes['default']),
    new material.ShaderMaterial({
      vertexShader: eyelashes$1['default'],
      fragmentShader: eyelashes$2['default'],
      uniforms: {
        tex_diffuse: new texture.Image(eyelashes$3['default']),

        var_lashes_color: new attribute.Vector4(0, 0, 0, 0),
      },
      builtIns: [
        "bnb_BONES",
        "bnb_MORPH",
      ],
      state: {
        backFaces: true,
        zWrite: true,
      },
    }),
  );}

  constructor() {Eyelashes.prototype.__init.call(this);Eyelashes.prototype.__init2.call(this);
    const onChange = () => {
      const [, , , a] = this._lashes.material.uniforms.var_lashes_color.value();

      this._lashes.visible(a > 0);
    };

    this._lashes.material.uniforms.var_lashes_color.subscribe(onChange);

    this._face.add(this._lashes);

    scene.add(this._face, this._lashes);
  }

  color(color) {
    if (typeof color !== "undefined") {
      if (!this._lashes.material.uniforms.tex_diffuse.filename) {
        this._lashes.material.uniforms.tex_diffuse.load(eyelashes$3['default']);
      }
      this._lashes.material.uniforms.var_lashes_color.value(color);
    }
    return this._lashes.material.uniforms.var_lashes_color.value().join(" ") 
  }

  texture(filename) {
    this._lashes.material.uniforms.tex_diffuse.load(filename);
  }

  clear() {
    this.color("0 0 0 0");
  }
}

exports.Eyelashes = Eyelashes;
