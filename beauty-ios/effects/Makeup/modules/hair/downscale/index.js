'use strict';

require('../../scene/utils.js');
require('../../scene/geometry.js');
const material = require('../../scene/material.js');
const pass = require('../../scene/pass.js');
require('../../scene/render-target.js');
require('../../scene/scene.js');
require('../../scene/texture.js');
const downscale = require('./downscale.vert.js');
const downscale$1 = require('./downscale.frag.js');

const Downscale = (
  texture,
  width,
  height = width,
) =>
  new pass.Pass(
    new material.ShaderMaterial({
      vertexShader: downscale['default'],
      fragmentShader: downscale$1['default'],
      uniforms: {
        tex_camera: texture,
      },
      state: {
        blending: "OFF",
      },
    }),
    {
      width,
      height,
      filtering: "LINEAR",
    },
  );

exports.Downscale = Downscale;
