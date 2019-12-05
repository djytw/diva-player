'use strict';

var Stream = require('../Utils/stream');

class SubMesh {
    static getSize(){
        return 0x5C;
    }
    constructor(data, pos){
        if (data instanceof Stream == false)
            throw "illegal param";
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
        this.boneIndexCount = st.getUint32();
        this.boneIndicesOffset = st.getUint32();
        this.field00 = st.getUint32();
        this.PrimitiveType = st.getUint32();
        this.field01 = st.getUint32();
        this.indexCount = st.getUint32();
        this.indicesOffset = st.getUint32();

        if (this.field00 == 4){
            st.setpos(this.boneIndicesOffset + this.pos);
            this.BoneIndices = st.getUint16s(this.boneIndexCount);
        }
        st.setpos(this.indicesOffset + this.pos);
        this.Indices = st.getUint16s(this.indexCount);
    }
}
module.exports = SubMesh;