'use strict';

const attribute = require('../../../scene/attribute.js');
require('../../../scene/geometry.js');
const material = require('../../../scene/material.js');
require('../../../scene/utils.js');
const pass = require('../../../scene/pass.js');
require('../../../scene/render-target.js');
require('../../../scene/scene.js');
require('../../../scene/texture.js');
const copy = require('./copy.vert.js');
const copy$1 = require('./copy.frag.js');

const Accumulate = (texture, combineWithPreviousRatio = 0.5) =>
  new pass.Pass(
    new material.ShaderMaterial({
      vertexShader: copy['default'],
      fragmentShader: copy$1['default'],
      uniforms: {
        tex_camera: texture,

        var_combine_with_previous_ratio: new attribute.Vector4(combineWithPreviousRatio),
      },
    }),
    {
      info: {
        load: "LOAD",
        store: "SAVE",
      },
    },
  );

exports.Accumulate = Accumulate;
