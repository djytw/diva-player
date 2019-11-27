'use strict';

/*
 *      Texture
 *      
 *    
 */
var Stream = require('../Utils/stream');
var SubTexture = require('./SubTexture');

class Texture{
    constructor(data){
        if (data instanceof Stream == false)
            throw "illegal param";
        this.SubTexture = undefined;
        this.Id = undefined;
        this.Name = undefined;
        this.Width = undefined;
        this.Height = undefined;
        this.Format = undefined;
        this.IsYCbCr = undefined;
        this.Depth = undefined;
        this.MipMapCount = undefined;
        this.UsesDepth = undefined;
        this.UsesMipMaps = undefined;
        this.pos = data.getpos();
        this.Read(data);
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x04505854 && sign != 0x05505854)
            throw "Invalid signature (expected TXP with type 4 or 5)";

        var subTextureCount = st.getUint32();
        var info = st.getUint32();

        this.MipMapCount = info & 0xFF;
        this.Depth = ( info >> 8 ) & 0xFF;

        if (this.Depth == 1 )
            this.MipMapCount = subTextureCount;

        this.SubTextures = [];
        var subtexpos = [];
        var i, j;
        for (i = 0; i < this.Depth; i++){
            subtexpos[i] = [];
            this.SubTextures[i] = [];
            for (j = 0; j < this.MipMapCount; j++)
                subtexpos[i][j] = st.getUint32();
        }
        
        for (i = 0; i < this.Depth; i++)
            for (j = 0; j < this.MipMapCount; j++){
                st.setpos(this.pos + subtexpos[i][j]);
                this.SubTextures[i][j] = new SubTexture(st);
            }
        
    }
}

module.exports = Texture;