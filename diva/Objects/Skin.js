'use strict';

var Stream = require('../Utils/stream');

class Skin{
    constructor(data){
        if (data instanceof Stream == false)
            throw "illegal param";
        this.Bones = [];
        this.ExData = undefined;
        this.pos = data.getpos();
        this.Read(data)
    }
    Read(st){
        var boneIdsOffset = st.getUint32();
        var boneMatricesOffset = st.getUint32();
        var boneNamesOffset = st.getUint32();
        var meshExDataOffset = st.getUint32();
        var boneCount = st.getUint32();
        var boneParentIdsOffset = st.getUint32();

        var i;
        st.setpos(boneIdsOffset);
        for (i = 0; i< boneCount; i++){
            this.Bones.push(new BoneInfo(st.getUint32()))
        }
        st.setpos(boneMatricesOffset);
        for (i = 0; i< boneCount; i++){
            this.Bones[i].InverseBindPoseMatrix = st.getMatrix4();
        }
        st.setpos(boneNamesOffset);
        for (i = 0; i< boneCount; i++){
            this.Bones[i].Name = st.getString();
        }
        st.setpos(boneParentIdsOffset);
        for (i = 0; i< boneCount; i++){
            this.Bones[i].ParentId = st.getUint32();
        }
        
        st.setpos(meshExDataOffset);
        //this.ExData = 
    }
}
class BoneInfo{
    
}
module.exports = Skin;