'use strict';

const modules_scene_index = require('../scene/index.js');

class EyeBagsRemoval {
    enable() {
        modules_scene_index.enable("EYE_BAGS", this);
        return this;
    }
    disable() {
        modules_scene_index.disable("EYE_BAGS", this);
        return this;
    }
}

exports.EyeBagsRemoval = EyeBagsRemoval;
