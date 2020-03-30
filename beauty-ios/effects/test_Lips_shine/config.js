
function Effect()
{
    var self = this;

    this.init = function() {
        Api.meshfxMsg("spawn", 1, 0, "!glfx_FACE");
        Api.meshfxMsg("spawn", 0, 0, "quad.bsm2");
        // R G B A -- lips replacement color
        Api.meshfxMsg("shaderVec4", 0, 1, "0.086 0.086 0.086 1.0");
        // [0] sCoef -- color saturation
        // [1] vCoef -- shine brightness (intensity)
        // [2] sCoef1 -- shine saturation (color bleeding)
        // [3] bCoef -- darkness (more is less)
        Api.meshfxMsg("shaderVec4", 0, 2, "1 0.017 0.496 0.155");
        Api.showRecordButton();
        // self.faceActions = [];
    };

    this.faceActions = [function(){ Api.meshfxMsg("shaderVec4", 0, 0, "1.") ;}];
    this.noFaceActions = [function(){ Api.meshfxMsg("shaderVec4", 0, 0, "0."); }];

    this.videoRecordStartActions = [];
    this.videoRecordFinishActions = [];
    this.videoRecordDiscardActions = [];
}

function setColor(color)
{
    var c = JSON.parse(color);
    Api.meshfxMsg("shaderVec4", 0, 1, c[0] + " " + c[1] + " " + c[2] + " " + c[3]);
}
configure(new Effect());
