'use strict';

/*
 *      ObjectSet xxx_obj.bin
 *      
 *      **Little-Endian**     
 * 
 *      |<-- from 0x0
 *      |    Sign     | objCount | boneCount | objOffset | skinOffset | nameOffset | idOffset | texIdOffset | texCount |
 *      | 005062500/1 |   u32    |    u32    |    u32    |     u32    |     u32    |    u32   |     u32     |   u32    |
 *   
 *      |<-- from objOffset/skinOffset/nameOffset
 *      | addr obj1/skin1/name1 | addr obj2/skin2/name2 | ... | addr objN/skinN/nameN (N=objCount) |
 *      |          u32          |          u32          | ... |                u32                 |
 * 
 *      |<-- from addr nameN
 *      |          nameN         |
 *      | String (end with '\0') |
 * 
 *      |<-- from idOffset/texIdOffset
 *      | id1/texId1 | id2/texId2 | ... | idN/texIdM (N=objCount,M=texCount) |
 *      |    u32     |    u32     | ... |                 u32                |
 * 
 */
var Stream = require('../Utils/stream');
var Object = require('./Object');
var Skin = require('./Skin');

class ObjectSet{
    static Read(data){
        if (data instanceof ArrayBuffer == false)
            throw "illegal param";
        
        var dv = new DataView(data);
        var st = new Stream(dv);
        st.setendian(Stream.LITTLE_ENDIAN);

        var sign = st.getUint32();
        if (sign != 0x05062500 && sign != 0x05062501)
            throw "type not supported yet: "+sign;
        
        var objCount = st.getUint32();
        var boneCount = st.getUint32();
        var objOffset = st.getUint32();
        var skinOffset = st.getUint32();
        var nameOffset = st.getUint32();
        var idOffset = st.getUint32();
        var texIdOffset = st.getUint32();
        var texCount = st.getUint32();

        var objects = [];
        var i;
        for (i = 0; i < objCount; i++){
            var objpos = st.getUint32(objOffset + i * 4);
            var skinpos = st.getUint32(skinOffset + i * 4);
            var name = st.getStringAt(st.getUint32(nameOffset + i * 4));
            var id = st.getUint32(idOffset + i * 4);
            var pos = st.getpos();
            st.setpos(objpos);
            var obj = new Object(id, st, name);
            if (skinpos != 0){
                st.setpos(skinpos);
                obj.Skin = new Skin(st)
            }
            objects.push(obj);
            st.setpos(pos);
        }
        var tids = [];
        for (i = 0; i < texCount; i++){
            tids.push(st.getUint32(texIdOffset + i * 4));
        }
        return [objects,tids];
    }
}
module.exports = ObjectSet;