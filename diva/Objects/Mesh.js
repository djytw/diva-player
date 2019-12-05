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
        this.SubMeshes = [];
        this.pos = pos;
        this.Read(data);
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x00000000)
            throw "not a Mesh! file may be corrupted";
        this.BoundingSphere = st.getBoundingSphere();
        this.subMeshCount = st.getUint32();
        this.subMeshOffset = st.getUint32();
        this.attributes = st.getUint32();
        this.stride = st.getUint32();
        this.vertexCount = st.getUint32();
        this.elemItems = st.getUint32s(28);
        this.Name = st.getString(64);

        var i;
        for (i = 0; i < this.subMeshCount; i++){
            st.setpos(this.subMeshOffset + this.pos + i * SubMesh.getSize());
            this.SubMeshes.push(new SubMesh(st, this.pos));
        }
        var pos = st.getpos();
        for (i = 0; i < 28; i++){
            if ((this.attributes & (1 << i)) == 0)
                continue;
            st.setpos(this.elemItems[i] + this.pos);
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