
/** ------ effect state ------- **/

var effectData = {
    reservedMeshID: {
        retouch: 0,
        colorCorrectionMesh: 1,
        lipsColoringMesh: 2
    },

    meshesFileNames: {
        retouch : "!glfx_FACE",
        colorCorrection: "tri.bsm2",
        lipsColoring: "lips.bsm2"
    },

    makeupsData: {
        isEnabled: false,
        makeups: {
            "null": "MakeupNull.png",
            "shadows": "shadows.png"
        }
    },

    recognizerData: {
        initializedRecognizers: {
            lips: false
        },
        
        activeRecognizers: [ ]
    },

    interpolation: {
        morph_cheeks_str: {
            "0.0": 0.0,
            "0.4": 0.3,
            "0.8": 0.8,
            "1.0": 1.0
        },
        morph_eyes_str: {
            "0.0": 0.0,
            "0.4": 0.1,
            "0.8": 0.5,
            "1.0": 1.0
        },
        morph_nose_str: {
            "0.0": 0.0,
            "0.4": 0.2,
            "0.8": 0.6,
            "1.0": 1.0
        },
        skin_soft_str: {
            "0.0": 0.0,
            "0.4": 0.7,
            "0.8": 0.9,
            "1.0": 1.0
        },
        softlight_alpha: {
            "0.0": 0.0,
            "0.4": 0.7,
            "0.8": 1.0,
            "1.0": 1.0
        },
        eyes_coloring_str: {
            "0.0": 0.0,
            "0.4": 0.8,
            "0.8": 1.0,
            "1.0": 1.0
        }
    },

    rotation: 1.0,

    luts_path: "beauty/",

    softlight_textures: ["soft.ktx"],

    eyes_lut: "lut3d_eyes_verylow.png",

    teeth_highlight_lut : "lut3d_teeth_highlighter5.png",

    lashes_textures: [
        "lashes1.ktx",
        "lashes2.ktx",
        "lashes3.ktx",
        "lashes4.ktx",
        "lashes5.ktx",
        "lashes6.ktx",
        "lashes7.ktx",
        "lashes8.ktx",
        "lashes9.ktx",
        "lashes10.ktx",
        "lashes11.ktx",
        "lashes12.ktx"
    ],

    eyebrows_textures: [
        "brows_512.ktx",
        "brows_Hi_512.ktx"
    ],
    
    final_luts: [
        "lut3d_barbie.png",
        "lut3d_bwc.png",
        "lut3d_columbia.png",
        "lut3d_egg.png",
        "lut3d_limontea.png",
        "lut3d_milano.png",
        "lut3d_nash.png",
        "lut3d_pinkvine.png",
        "lut3d_pirate.png",
        "lut3d_spark.png",
        "lut3d_spring.png",
        "lut3d_sunny.png",
        "lut3d_vinyl.png",
        "lut3d_violla.png",
        "lut3d_yury.png"
    ]
};

var beautifyingProps = {
    morph_cheeks_str: 0.0,
    morph_eyes_str: 0.0,
    morph_nose_str: 0.0,

    skin_soft_str: 0.0,
    softlight_alpha: 0.0,
    softlight_tex: 0,

    eye_flare_alpha: 0.0,
    eyes_coloring_str: 0.0,

    teeth_whitening_str: 0.0,
    
    lashes_tex: 0,
    lashes_alpha: 0.0,

    eyebrows_tex: 0,
    eyebrows_alpha: 0.0,

    final_color_correction_str: 0.0,
    final_color_correction_tex: 0,
};

/** ------ effect ------- **/

function Effect() {
    var self = this;

    this.init = function() {
        var retouchMeshId = effectData.reservedMeshID.retouch;
        Api.meshfxMsg("spawn", retouchMeshId, 0, effectData.meshesFileNames.retouch);
        Api.showRecordButton();
        updateEffect();
        Api.meshfxMsg("tex", 0, 3, effectData.makeupsData.makeups["null"]);
        Api.meshfxMsg("shaderVec4", 0, 6, "0.0 0.0 0.0 0.0");

        testBeauty(1.0); // Delete this line to disable Beautification by default 
    };

    this.restart = function() {
        Api.meshfxReset();
        self.init();
    };

    this.faceActions = [track_angle];
    this.noFaceActions = [];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

var effect = new Effect();

/* ------- each frame function -------- */

function forEachFrame(callback) {
    var deltalist = [16, 16, 16, 16, 16];
    var lastTime = new Date().getTime();
    effect.faceActions.push(frameCallback);
    effect.noFaceActions.push(frameCallback);

    function frameCallback() {
        var now = new Date().getTime();
        var delta = now - lastTime;
        lastTime = now;
        deltalist.unshift(delta);
        deltalist.pop();
        
        delta = average(deltalist);

        if(callback) {
            callback(delta, stopFunction);
        }
    }

    function stopFunction() {   
        var idx = effect.faceActions.indexOf(frameCallback);
        effect.faceActions.splice(idx, 1);
        idx = effect.noFaceActions.indexOf(frameCallback);
        effect.noFaceActions.splice(idx, 1);
    }
}

function average(arr) {
    return arr.reduce(function(prev, next) { return prev + next; }) / arr.length;
}

/** ----- makeup changing API ------ */

 function enableMakeupChanging() {
    if (assertMakeupEnabling()) {
        effectData.makeupsData.isEnabled = true;
        Api.meshfxMsg("shaderVec4", 0, 6, "1.0 0.0 0.0 0.0");
        setMakeupMultiplyingColor("1 1 1 1");
    }
 }

 function applyMakeup(name) {
    if (assertMakeupChanging(name)) {
        Api.meshfxMsg("tex", 0, 3, effectData.makeupsData.makeups[name]);
    }
}

function assertMakeupEnabling() {
    if (effectData.makeupsData.isEnabled) {
        Api.print("cannot enable already enabled makeups changing");
        return false;
    }

    return true;
}

function assertMakeupChanging(id) {
    if (!effectData.makeupsData.makeups[id]) {
        Api.print("invalid makeup id");
        return false;
    }

    if (!effectData.makeupsData.isEnabled) {
        Api.print("cannot change makeup if makeups changing in not enabled");
        return false;
    }

    return true;
}

function setMakeupMultiplyingColor(rgba) {
    Api.meshfxMsg("shaderVec4", 0, 8, rgba);
}

function disableMakeupChanging() {
    effectData.makeupsData.isEnabled = false;
    Api.meshfxMsg("shaderVec4", 0, 6, "0.0 0.0 0.0 0.0");
}

function addMakeup(makeupData) {
    if (!effectData.makeupsData.makeups[makeupData[0]]) {
        effectData.makeupsData.makeups[makeupData[0]] = makeupData[1];
    }
}


/** --------- lips coloring ----------- **/

function addRecognizerFuture(feature) {
    effectData.recognizerData.activeRecognizers.push(feature);
    Api.setRecognizerFeatures(effectData.recognizerData.activeRecognizers);
}

function removeRecognizerFuture(feature) {
    var idx = effectData.recognizerData.activeRecognizers.indexOf(feature);

    if (idx >= 0)
        effectData.recognizerData.activeRecognizers.splice(idx, 1);

    Api.setRecognizerFeatures(effectData.recognizerData.activeRecognizers);
}

function enableLipsColoring() {
    if (assertLipsEnabling()) {
        addRecognizerFuture("lips_segmentation");
        var id = effectData.reservedMeshID.lipsColoringMesh;
        var name = effectData.meshesFileNames.lipsColoring;
        Api.meshfxMsg("spawn", id, 0, name);
        setLipsColor("1 0.5176 0.5372 1");
    }
}


function disableLipsColoring() {
    if (assertLipsDisabling()) {
        var id = effectData.reservedMeshID.lipsColoringMesh;
        Api.meshfxMsg("del", id);
        removeRecognizerFuture("lips_segmentation");
    }
}

function setLipsColor(rgba) {
    Api.meshfxMsg("shaderVec4", 0, 7, rgba);
}

function makeString() {
    return Array.prototype.join.call(arguments, arguments[arguments.length -1]);
}

function assertLipsEnabling() {
    if (effectData.recognizerData.initializedRecognizers.lips) {
        Api.print("cannot enable lips coloring while another is enabled");
        return false;
    }

    return true;
}

function assertLipsDisabling() {
    if (!effectData.recognizerData.initializedRecognizers.lips) {
        Api.print("cannot disable already disabled lips coloring");
        return false;
    }

    return true;
}

/** ----- effect update ----- **/

function addEffectDataPropertyTexture(propData) {
    var data = propData.split(" ");
    effectData[data[0]].push(data[1]);
}

function updateEffect() {  
    applySoftlightAlpha();  
    applySkinSofting();
    applyCheeksMorphing();
    applyEyesMorphing();
    applyNoseMorphing();
    applyMakeups();
    applyColorCorrection();
    applyEyesColoring();
    applyTeethWhitening();
}

function interpolate(x1, fx1, x2, fx2, x) {
    return fx1 + (fx2 - fx1) * (x - x1) / (x2 - x1);
}

function interpolatedValue(param, value) {
    settings = effectData.interpolation[param];
    if (settings !== undefined) {
        if (value < 0.4) { // 0 - 40%
            return interpolate(0, settings["0.0"], 0.4, settings["0.4"], value);
        } else if (value < 0.8) {// 40 - 80%
            return interpolate(0.4, settings["0.4"], 0.8, settings["0.8"], value);
        } else { // 80 - 100%
            return interpolate(0.8, settings["0.8"], 1.0, settings["1.0"], value);
        }
    } else {
        return value;
    }
}

function track_angle() {
    var mv = Api.modelview();
    effectData.rotation = Math.min(Math.max((mv[6] + 0.15) / (0.15 - 0.01), 0.0), 1.0);
    var skinSoftStr = beautifyingProps.skin_soft_str;
    var trackedValue = skinSoftStr + " 0.0 " + effectData.rotation;
    Api.meshfxMsg("shaderVec4", 1, 2, trackedValue);
}

function applyColorCorrection() {
    if (beautifyingProps.final_color_correction_str > 0) {

        var colorCorrectionMeshId = effectData.reservedMeshID.colorCorrectionMesh;
        Api.meshfxMsg("spawn", colorCorrectionMeshId, 0, effectData.meshesFileNames.colorCorrection);

        var lutIdx = beautifyingProps.final_color_correction_tex;
        Api.print(lutIdx);
        var lutPath = effectData.luts_path + effectData.final_luts[lutIdx];
        var lutStr = beautifyingProps.final_color_correction_str * 100;

        Api.meshfxMsg("wlut", 0, lutStr, lutPath);
    } else {
        Api.meshfxMsg("del", 1);
    }
}

function applySkinSofting() {
    var skinSofStr = beautifyingProps.skin_soft_str;
    skinSofStr = interpolatedValue("skin_soft_str", skinSofStr);
    var shaderValue = skinSofStr + " 0.0 " + effectData.rotation;
    Api.meshfxMsg("shaderVec4", 1, 2, shaderValue);
}

function applyCheeksMorphing() {
    var cheeksMorphStr = beautifyingProps.morph_cheeks_str;
    cheeksMorphStr = interpolatedValue("morph_cheeks_str", cheeksMorphStr);
    Api.meshfxMsg("beautyMorph", 0, cheeksMorphStr * 100, "face");
}

function applyEyesMorphing() {
    var eyesMorphStr = beautifyingProps.morph_eyes_str;
    eyesMorphStr = interpolatedValue("morph_eyes_str", eyesMorphStr);
    Api.meshfxMsg("beautyMorph", 0, eyesMorphStr * 200, "eyes");
}

function applyNoseMorphing() {
    var noseMorphStr = beautifyingProps.morph_nose_str;
    noseMorphStr = interpolatedValue("morph_nose_str", noseMorphStr);
    Api.meshfxMsg("beautyMorph", 0, noseMorphStr * 100, "nose");
}

function applyMakeups() {
    var softLightTexIdx = beautifyingProps.softlight_tex;
    var softLightTexture = effectData.softlight_textures[softLightTexIdx];
    var id = effectData.reservedMeshID.retouch;
    Api.meshfxMsg("tex", id, 0, softLightTexture);

    var lashesTexIdx = beautifyingProps.lashes_tex;
    var lashesTexture = effectData.lashes_textures[lashesTexIdx];
    Api.meshfxMsg("tex", id, 1, lashesTexture);

    var eyeBrowsTexIdx = beautifyingProps.eyebrows_tex;
    eyeBrowsTexture = effectData.eyebrows_textures[eyeBrowsTexIdx];
    Api.meshfxMsg("tex", id, 2, eyeBrowsTexture);
}

function applyEyesColoring() {
    var eyesColoringStr = beautifyingProps.eyes_coloring_str;
    eyesColoringStr = interpolatedValue("eyes_coloring_str", eyesColoringStr);

    var eyesColoringLutTex = effectData.eyes_lut;
    var eyesColoringLutPath = effectData.luts_path + eyesColoringLutTex;

    Api.meshfxMsg("wlut", 1, eyesColoringStr * 50, eyesColoringLutPath);
}

function applyTeethWhitening() {
    var teethWhiteningStr = beautifyingProps.teeth_whitening_str * 100;
    var teetLutTexPath = effectData.luts_path + effectData.teeth_highlight_lut;
    Api.meshfxMsg("wlut", 2, teethWhiteningStr, teetLutTexPath);
}

function applySoftlightAlpha() {
    var softlightAlpha =  beautifyingProps.softlight_alpha;
    softlightAlpha = interpolatedValue("softlight_alpha", softlightAlpha);
    var eyeFlareAlpha = beautifyingProps.eye_flare_alpha;

    var softLightEyeFlateVal = "0.0 " + softlightAlpha + " " + eyeFlareAlpha + " 0.0";
    Api.meshfxMsg("shaderVec4", 1, 0, softLightEyeFlateVal);
    
    var eyeBrowsAlpha = beautifyingProps.eyebrows_alpha;
    var lashesAlpha = beautifyingProps.lashes_alpha;

    var eyeBrowsLashesAlpha = "0.0 0.0 " + eyeBrowsAlpha + " " + lashesAlpha;
    Api.meshfxMsg("shaderVec4", 1, 1, eyeBrowsLashesAlpha); 
}

/** ----- app callbacks ------- **/

function onDataUpdate(param) {
    value = JSON.parse(param);

    if (typeof (value) == "object") {
        beautifyingProps = value;
    } else {
        beautifyingProps.morph_cheeks_str = value;
        beautifyingProps.morph_eyes_str = value;
        beautifyingProps.morph_nose_str = value;

        beautifyingProps.skin_soft_str = value;
        beautifyingProps.softlight_alpha = value;
        beautifyingProps.softlight_tex = 0;

        beautifyingProps.eye_flare_alpha = 0.0;
        beautifyingProps.eyes_coloring_str = value;

        beautifyingProps.teeth_whitening_str = value;

        beautifyingProps.lashes_tex = 0;
        beautifyingProps.lashes_alpha = 0.0;
        
        beautifyingProps.eyebrows_tex = 0;
        beautifyingProps.eyebrows_alpha = 0.0;

        beautifyingProps.final_color_correction_str = value;
        beautifyingProps.final_color_correction_tex = 0;
    }

    updateEffect();
}

/** ----- test function ------ **/

/**
 * afer this function call beautyfication sould be set in value, wich argument receive 
 */
function testBeauty(value) {
    beautifyingProps = {
        morph_cheeks_str: value,
        morph_eyes_str: value,
        morph_nose_str: value,
    
        skin_soft_str: value,
        softlight_alpha: value,
        softlight_tex: 0,
    
        eye_flare_alpha: value,
        eyes_coloring_str: value,
    
        teeth_whitening_str: value,
    
        eyebrows_tex: 0,
        eyebrows_alpha: value,
    
        lashes_tex: 0,
        lashes_alpha: value,
    
        final_color_correction_str: value,
        final_color_correction_tex: 0,
    };

    updateEffect();
}

function timeOut(delay, callback) {
	var timer = new Date().getTime();

	effect.faceActions.push(removeAfterTimeOut);
	effect.noFaceActions.push(removeAfterTimeOut);

	function removeAfterTimeOut() {
        var now = new Date().getTime();
			
        if (now >= timer + delay) {
            var idx = effect.faceActions.indexOf(removeAfterTimeOut);
            effect.faceActions.splice(idx, 1);
            idx = effect.noFaceActions.indexOf(removeAfterTimeOut);
            effect.noFaceActions.splice(idx, 1);
            callback();
        }
	}
}

function testMakeups(currMake, delay) {
    enableMakeupChanging();
    if (currMake >= Object.keys(effectData.makeupsData.makeups).length) {
        deleteMakeupChanging();
        return;
    }

    applyMakeup(Object.keys(effectData.makeupsData.makeups)[currMake]);

    timeOut(delay || 100, function() {
        testMakeups(currMake + 1, delay || 100);
    });
}

configure(effect);