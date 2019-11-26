'use strict';

var Stream = require('../Utils/stream');

class SubMesh {
    static getSize(){
        return 0x5C;
    }
    constructor(data, pos){
        if (data instanceof Stream == false)
            throw "illegal param";
        this.BoundingSphere = undefined;
        this.Indices = undefined;
        this.BoneIndices = undefined;
        this.MaterialIndex = undefined;
        this.MaterialUVIndices = undefined;
        this.PrimitiveType = undefined;
        this.pos = pos;
        this.Read(data);
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x00000000)
            throw "not a SubMesh! file may be corrupted";
    
        this.BoundingSphere = st.getBoundingSphere();
        this.MaterialIndex = st.getUint32();
        this.MaterialUVIndices = st.getUint8s(8);
        var boneIndexCount = st.getUint32();
        var boneIndicesOffset = st.getUint32();
        var field00 = st.getUint32();
        this.PrimitiveType = st.getUint32();
        var field01 = st.getUint32();
        var indexCount = st.getUint32();
        var indicesOffset = st.getUint32();

        if (field00 == 4){
            st.setpos(boneIndicesOffset + this.pos);
            this.BoneIndices = st.getUint16s(boneIndexCount);
        }
        st.setpos(indicesOffset + this.pos);
        this.Indices = st.getUint16s(indexCount);
    }
}
module.exports = SubMesh;