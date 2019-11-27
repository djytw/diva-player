'use strict';

/*
 *      Texture
 *      
 *    
 */
var Stream = require('../Utils/stream');

class SubTexture{
    constructor(data){
        if (data instanceof Stream == false)
            throw "illegal param";
        this.Id = undefined;
        this.Width = undefined;
        this.Height = undefined;
        this.Format = undefined;
        this.Data = undefined;
        this.pos = data.getpos();
        this.Read(data);
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x02505854)
            throw "Invalid signature (expected TXP with type 2)";

        this.Width = st.getUint32();
        this.Height = st.getUint32();
        this.Format = st.getUint32();
        this.Id = st.getUint32();

        var dataSize = st.getUint32();
        this.Data = st.getUint8s( dataSize );
        
    }
}

module.exports = SubTexture;