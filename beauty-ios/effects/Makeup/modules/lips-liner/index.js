'use strict';

require('bnb_js/global');
const modules_scene_index = require('../scene/index.js');
const modules_lipsLiner_liner_mask_index = require('./liner_mask/index.js');

const LipsLinerVertexShader = "modules/lips-liner/lips.vert";

const LipsLinerFragmentShader = "modules/lips-liner/lips.frag";

const QuadLipsLiner = "modules/lips-liner/quad_lips_liner.bsm2";

class LipsLiner {
    constructor() {
        Object.defineProperty(this, "_liner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new modules_scene_index.Mesh(new modules_scene_index.Geometry(QuadLipsLiner), new modules_scene_index.ShaderMaterial({
                vertexShader: LipsLinerVertexShader,
                fragmentShader: LipsLinerFragmentShader,
                uniforms: {
                    liner_mask: modules_lipsLiner_liner_mask_index.LinerMask(),
                    var_lips_liner_color: new modules_scene_index.Vector4(0, 0, 0, 0),
                    lips_mask: new modules_scene_index.SegmentationMask("LIPS"),
                },
                state: {
                    backFaces: true,
                },
            }))
        });
        modules_scene_index.add(this._liner);
    }
    color(color) {
        this._liner.material.uniforms.lips_mask.enable();
        this._liner.visible(true);
        if (typeof color !== "undefined") {
            this._liner.material.uniforms.var_lips_liner_color.value(color);
        }
        return this._liner.material.uniforms.var_lips_liner_color.value().join(" ");
    }
    clear() {
        this.color("0 0 0 0");
    }
}

exports.LipsLiner = LipsLiner;
