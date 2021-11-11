'use strict';

const attribute = require('../../../scene/attribute.js');
require('../../../scene/geometry.js');
const material = require('../../../scene/material.js');
require('../../../scene/utils.js');
const pass = require('../../../scene/pass.js');
require('../../../scene/render-target.js');
require('../../../scene/scene.js');
require('../../../scene/texture.js');
const blur_down = require('./blur_down.vert.js');
const blur_down$1 = require('./blur_down.frag.js');
const blur_up = require('./blur_up.vert.js');
const blur_up$1 = require('./blur_up.frag.js');

function Blur(texture, radius) {
    const blueRadius = new attribute.Vector4(radius);

    const steps = 4;

    for (let i = 0; i < steps; ++i) {
      const scale = 1 / Math.pow(2, i);

      texture = new pass.Pass(
        new material.ShaderMaterial({
          vertexShader: blur_down['default'],
          fragmentShader: blur_down$1['default'],
          uniforms: {
            tex_camera: texture,
            var_hair_blur_radius: blueRadius,
          },
          state: {
            blending: "OFF",
          },
        }),
        { scale, filtering: "LINEAR" }
      );
    }

    for (let i = steps - 1; i >= 0; --i) {
      const scale = 1 / Math.pow(2, i);

      texture = new pass.Pass(
        new material.ShaderMaterial({
          vertexShader: blur_up['default'],
          fragmentShader: blur_up$1['default'],
          uniforms: {
            tex_camera: texture,
            var_hair_blur_radius: blueRadius,
          },
          state: {
            blending: "OFF",
          },
        }),
        { scale, filtering: "LINEAR" }
      );
    }

    return texture
}

exports.Blur = Blur;
