'use strict';

require('bnb_js/global');
const modules_scene_index = require('../../scene/index.js');

const MaskVertexShader = "modules/lips-liner/liner_mask/liner0.vert";

const MaskVertexShader1 = "modules/lips-liner/liner_mask/liner1.vert";

const MaskVertexShader2 = "modules/lips-liner/liner_mask/liner2.vert";

const Liner0FragmentShader = "modules/lips-liner/liner_mask/liner0.frag";

const Liner1FragmentShader = "modules/lips-liner/liner_mask/liner1.frag";

const Liner2FragmentShader = "modules/lips-liner/liner_mask/liner2.frag";

function LinerMask() {
    const liner0 = new modules_scene_index.Pass(new modules_scene_index.ShaderMaterial({
        vertexShader: MaskVertexShader,
        fragmentShader: Liner0FragmentShader,
        uniforms: {
            lips_mask: new modules_scene_index.SegmentationMask("LIPS"),
        },
        state: {
            blending: "OFF",
        },
    }), {
        filtering: "LINEAR",
        width: 384,
        height: 384,
    });
    const liner1 = new modules_scene_index.Pass(new modules_scene_index.ShaderMaterial({
        vertexShader: MaskVertexShader1,
        fragmentShader: Liner1FragmentShader,
        uniforms: {
            liner0: liner0,
        },
        state: {
            blending: "OFF",
        },
    }), {
        filtering: "LINEAR",
        width: 384,
        height: 384,
    });
    return new modules_scene_index.Pass(new modules_scene_index.ShaderMaterial({
        vertexShader: MaskVertexShader2,
        fragmentShader: Liner2FragmentShader,
        uniforms: {
            liner1: liner1,
        },
        state: {
            blending: "OFF",
        },
    }), {
        filtering: "LINEAR",
        width: 384,
        height: 384,
    });
}

exports.LinerMask = LinerMask;
