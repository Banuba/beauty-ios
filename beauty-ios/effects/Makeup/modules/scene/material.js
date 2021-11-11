'use strict';

require('bnb_js/console');
const utils = require('./utils.js');
const attribute = require('./attribute.js');

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

const assets = bnb.scene.getAssetManager();














class ShaderMaterial

{
   static __initStatic() {this.parameters = new Map();}

  
  

  constructor({
    vertexShader,
    fragmentShader,
    builtIns = [],
    uniforms = {} ,
    state = {},
  }





) {
    const isBuiltin = vertexShader.startsWith("$builtin$materials/");

    if (!isBuiltin) {
      if (!vertexShader.endsWith(".vert"))
        throw new Error(`Vertex shader file must ends with ".vert". Received: "${vertexShader}"`)
      if (!fragmentShader.endsWith(".frag"))
        throw new Error(
          `Fragment shader file must ends with ".frag". Received: "${fragmentShader}"`,
        )
    }

    const vs = vertexShader.replace(/\.vert$/, "");
    const fs = fragmentShader.replace(/\.frag$/, "");

    if (vs !== fs)
      throw new Error(
        `Vertex shader name should match fragment shader name. Received: "${vertexShader}", "${fragmentShader}"`,
      )

    const name = isBuiltin ? vs : utils.id(`${vs}.`);
    const material = _nullishCoalesce(assets.findMaterial(name), () => ( assets.createMaterial(name, vs)));

    material.setState(
      new bnb.State(
        bnb.BlendingMode[_nullishCoalesce(state.blending, () => ( "ALPHA"))],
        _nullishCoalesce(state.zWrite, () => ( false)),
        _nullishCoalesce(state.zTest, () => ( false)),
        _nullishCoalesce(state.colorWrite, () => ( true)),
        _nullishCoalesce(state.backFaces, () => ( false)),
      ),
    );

    for (let name in uniforms) {
      const uniform = uniforms[name];

      if (uniform instanceof attribute.Attribute) {
        if (!(uniform instanceof attribute.Vector4))
          throw new Error(`Unsupported attribute type: "${typeof uniform}"`)

        const vec4 = uniform;

        if (ShaderMaterial.parameters.has(name)) {
          console.warn(
            `The parameter name "${name}" is already in use.`,
            `This might produce undesired behavior, consider using another name.`,
          );

          const parameter = ShaderMaterial.parameters.get(name);
          vec4.subscribe((value) => parameter.setVector4(new bnb.Vec4(...value)));

          continue
        }

        let parameter = material.findParameter(name);

        if (parameter) {
          const { x, y, z, w } = parameter.getVector4();
          vec4.value(x, y, z, w);
        } else {
          parameter = bnb.Parameter.create(name);
          material.addParameter(parameter);
        }

        vec4.subscribe((value) => parameter.setVector4(new bnb.Vec4(...value)));

        ShaderMaterial.parameters.set(name, parameter);
      } else {
        material.addImage(name, uniform.$$);
      }
    }

    for (const builtIn of builtIns)
      material.addImage(builtIn, null);

    this.$$ = material;
    this.uniforms = uniforms;
  }
} ShaderMaterial.__initStatic();

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
