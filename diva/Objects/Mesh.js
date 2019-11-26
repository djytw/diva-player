'use strict';

var Stream = require('../Utils/stream');
var SubMesh = require('./SubMesh');

class Mesh{
    static getSize(){
        return 0xD8;
    }
    constructor(data, pos){
        if (data instanceof Stream == false)
            throw "illegal param";
        this.BoundingSphere = undefined;
        this.SubMeshes = [];
        this.Vertex = undefined;
        this.Normal = undefined;
        this.Tangent = undefined;
        this.UVChannel1 = undefined;
        this.UVChannel2 = undefined;
        this.Color = [];
        this.BoneWeights = [];
        this.Name = undefined;
        this.vertexCount = undefined;
        this.pos = pos;
        this.Read(data);
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x00000000)
            throw "not a Mesh! file may be corrupted";
        this.BoundingSphere = st.getBoundingSphere();
        var subMeshCount = st.getUint32();
        var subMeshOffset = st.getUint32() + this.pos;
        var attributes = st.getUint32();
        var stride = st.getUint32();
        this.vertexCount = st.getUint32();
        var elemItems = st.getUint32s(28);
        this.Name = st.getString(64);

        var i;
        for (i = 0; i < subMeshCount; i++){
            st.setpos(subMeshOffset + i * SubMesh.getSize());
            this.SubMeshes.push(new SubMesh(st, this.pos));
        }
        var pos = st.getpos();
        for (i = 0; i < 28; i++){
            if ((attributes & (1 << i)) == 0)
                continue;
            st.setpos(elemItems[i] + this.pos);
            this[Mesh.vertexAttributes[i]] = this._readAttr(st, i);
        }
        st.setpos(pos);

        //TODO Boneinfo
    }
    _readAttr(st, i){
        if(i == 0 || i == 1){
            return st.getVector3s(this.vertexCount);
        }else if(i == 2 || i == 10 || i == 11){
            return st.getVector4s(this.vertexCount);
        }else if(i == 4 || i == 5){
            return st.getVector2s(this.vertexCount);
        }else if(i == 8){
            return st.getColors(this.vertexCount);
        }else{
            throw "Unknown Attribute";
        }
    }
}
Mesh.vertexAttributes = ["Vertex", "Normal", "Tangent", "", "UVChannel1","UVChannel2","","","Color","","BoneWeights","BoneIndex"];
module.exports = Mesh;