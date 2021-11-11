'use strict';

require('../../scene/utils.js');
require('../../scene/geometry.js');
const material = require('../../scene/material.js');
const pass = require('../../scene/pass.js');
require('../../scene/render-target.js');
require('../../scene/scene.js');
const texture = require('../../scene/texture.js');
const index = require('../downscale/index.js');
const hair_mask = require('./hair_mask.vert.js');
const hair_mask$1 = require('./hair_mask.frag.js');
const bounds = require('./bounds.vert.js');
const bounds$1 = require('./bounds.frag.js');
const gradient = require('./gradient.vert.js');
const gradient$1 = require('./gradient.frag.js');

function Gradient() {
  let downscaled = new pass.Pass(
    new material.ShaderMaterial({
      vertexShader: hair_mask['default'],
      fragmentShader: hair_mask$1['default'],
      uniforms: {
        tex_mask: new texture.SegmentationMask("HAIR"),
      },
      state: {
        blending: "OFF",
      },
    }),
    {
      filtering: "LINEAR",
    },
  );

  let width = 256;
  const height = width;

  do {
    downscaled = index.Downscale(downscaled, width, height);
  } while ((width /= 2) >= 1)

  const minmax = new pass.Pass(
    new material.ShaderMaterial({
      vertexShader: bounds['default'],
      fragmentShader: bounds$1['default'],
      uniforms: {
        tex_mask: downscaled,
      },
      state: {
        blending: "OFF",
      },
    }),
    {
      filtering: "LINEAR",
      width: 1,
      height: 1,
    },
  );

  return new pass.Pass(
    new material.ShaderMaterial({
      vertexShader: gradient['default'],
      fragmentShader: gradient$1['default'],
      uniforms: {
        tex_mask: minmax,
      },
      state: {
        blending: "OFF",
      },
    }),
  )
}

exports.Gradient = Gradient;
