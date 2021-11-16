'use strict';

require('bnb_js/console');
const utils = require('./utils.js');
const attribute = require('./attribute.js');

const assets = bnb.scene.getAssetManager();
class ShaderMaterial {
    constructor({ vertexShader, fragmentShader, builtIns = [], uniforms = {}, state = {}, }) {
        var _a, _b, _c, _d, _e, _f;
        Object.defineProperty(this, "$$", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "uniforms", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const isBuiltin = vertexShader.startsWith("$builtin$materials/");
        if (!isBuiltin) {
            if (!vertexShader.endsWith(".vert"))
                throw new Error(`Vertex shader file must ends with ".vert". Received: "${vertexShader}"`);
            if (!fragmentShader.endsWith(".frag"))
                throw new Error(`Fragment shader file must ends with ".frag". Received: "${fragmentShader}"`);
        }
        const vs = vertexShader.replace(/\.vert$/, "");
        const fs = fragmentShader.replace(/\.frag$/, "");
        if (vs !== fs)
            throw new Error(`Vertex shader name should match fragment shader name. Received: "${vertexShader}", "${fragmentShader}"`);
        const name = isBuiltin ? vs : utils.id(`${vs}.`);
        const material = (_a = assets.findMaterial(name)) !== null && _a !== void 0 ? _a : assets.createMaterial(name, vs);
        material.setState(new bnb.State(bnb.BlendingMode[(_b = state.blending) !== null && _b !== void 0 ? _b : "ALPHA"], (_c = state.zWrite) !== null && _c !== void 0 ? _c : false, (_d = state.zTest) !== null && _d !== void 0 ? _d : false, (_e = state.colorWrite) !== null && _e !== void 0 ? _e : true, (_f = state.backFaces) !== null && _f !== void 0 ? _f : false));
        for (let name in uniforms) {
            const uniform = uniforms[name];
            if (uniform instanceof attribute.Attribute) {
                if (!(uniform instanceof attribute.Vector4))
                    throw new Error(`Unsupported attribute type: "${typeof uniform}"`);
                const vec4 = uniform;
                if (ShaderMaterial.parameters.has(name)) {
                    console.warn(`The parameter name "${name}" is already in use.`, `This might produce undesired behavior, consider using another name.`);
                    const parameter = ShaderMaterial.parameters.get(name);
                    vec4.subscribe((value) => parameter.setVector4(new bnb.Vec4(...value)));
                    continue;
                }
                let parameter = material.findParameter(name);
                if (parameter) {
                    const { x, y, z, w } = parameter.getVector4();
                    vec4.value(x, y, z, w);
                }
                else {
                    parameter = bnb.Parameter.create(name);
                    material.addParameter(parameter);
                }
                vec4.subscribe((value) => parameter.setVector4(new bnb.Vec4(...value)));
                ShaderMaterial.parameters.set(name, parameter);
            }
            else {
                material.addImage(name, uniform.$$);
            }
        }
        for (const builtIn of builtIns)
            material.addImage(builtIn, null);
        this.$$ = material;
        this.uniforms = uniforms;
    }
}
Object.defineProperty(ShaderMaterial, "parameters", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
class BlitMaterial extends ShaderMaterial {
    constructor(texture, state) {
        const shader = utils.id("$builtin$materials/copy_pixels.99"); // FIXME: `9999` - fixes name collision only for a while
        super({
            vertexShader: shader,
            fragmentShader: shader,
            uniforms: { tex_src: texture },
            state,
        });
    }
}

exports.BlitMaterial = BlitMaterial;
exports.ShaderMaterial = ShaderMaterial;
