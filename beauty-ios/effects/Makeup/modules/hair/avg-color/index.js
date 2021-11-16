'use strict';

require('../../scene/utils.js');
require('../../scene/geometry.js');
const material = require('../../scene/material.js');
const pass = require('../../scene/pass.js');
require('../../scene/render-target.js');
require('../../scene/scene.js');
require('../../scene/texture.js');
const hair_color_mask = require('./hair_color_mask.vert.js');
const hair_color_mask$1 = require('./hair_color_mask.frag.js');
const index = require('./blur/index.js');

const AvgColor = (texture, mask) => {
    let sample = new pass.Pass(new material.ShaderMaterial({
        vertexShader: hair_color_mask['default'],
        fragmentShader: hair_color_mask$1['default'],
        uniforms: {
            tex_camera: texture,
            tex_mask: mask,
        },
        state: {
            blending: "OFF",
        },
    }));
    sample = index.Blur(sample, 2);
    return sample;
};

exports.AvgColor = AvgColor;
