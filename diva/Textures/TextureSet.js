'use strict';

/*
 *      TextureSet xxx_tex.bin
 *      
 *      |<-- from 0x0
 *      |   Sign   | texCount | texCountWithRubbish | tex1Offset | ... | texNOffset |
 *      | 03505854 |   u32    |         u32         |    u32     | ... |     u32    |
 *   
 *    
 */
var Stream = require('../Utils/stream');
var Texture = require('./Texture');

class TextureSet{
    static Read(data){
        if (data instanceof ArrayBuffer == false)
            throw "illegal param";
    
        var dv = new DataView(data);
        var st = new Stream(dv);
        var sign = st.getUint32();
        if (sign == 0x54585003){
            st.setendian(Stream.LITTLE_ENDIAN);
        }else if (sign != 0x03505854){
            throw "type not supported yet: "+sign;
        }

        var textureCount = st.getUint32();
        var textureCountWithRubbish = st.getUint32();

        var texturepos = [];
        var i;
        for (i = 0; i < textureCount; i++)
            texturepos[i] = st.getUint32();

        var textures = [];
        for (i = 0; i < textureCount; i++){
            st.setpos(texturepos[i]);
            textures[i] = new Texture(st);
        }
        debugger;
    }
}

module.exports = TextureSet;