'use strict';
var PNG = require("pngjs").PNG;
class CompressedTexture{
    static tile2linear(pos, size){
        //turn 4x4 compressed tile position to linear position.

        //var blockpos = Math.floor(pos / 16);
        //var blockinline = size / 4;
        //var blockrow = Math.floor(blockpos / blockinline);
        //var blockcol = blockpos % blockinline;
        //
        //var inblock = pos % 16;
        //var destrow = blockrow * 4 +  Math.floor(inblock / 4);
        //var destcol = blockcol * 4 + inblock % 4;

        //return destrow * size + destcol;

        return (~~(~~(pos / 16) / (size / 4)) * 4 + (~~((pos % 16) / 4))) * size + ((~~(pos / 16) % (size / 4)) * 4 + (pos % 16) % 4);
    }
    static DXT5decode(data, width, height){
        if (!(data instanceof Uint8Array)){
            return ;
        }
        var ret = new Uint8Array(width*height*4);
        var i, j;
        var r = new Array(8);
        var rr = new Array(4);
        var rg = new Array(4);
        var rb = new Array(4);
        for (i = 0; i < width*height ; i+=16){
            r[0] = data[i]; //alpha_0
            r[1] = data[i+1]; //alpha_1
            if (r[0] > r[1]){
                // 6 interpolated color values
                r[2] = (6 * r[0] + 1 * r[1]) / 7;
                r[3] = (5 * r[0] + 2 * r[1]) / 7;
                r[4] = (4 * r[0] + 3 * r[1]) / 7;
                r[5] = (3 * r[0] + 4 * r[1]) / 7;
                r[6] = (2 * r[0] + 5 * r[1]) / 7;
                r[7] = (1 * r[0] + 6 * r[1]) / 7;
            }else{
                // 4 interpolated color values
                r[2] = (4 * r[0] + 1 * r[1]) / 5;
                r[3] = (3 * r[0] + 2 * r[1]) / 5;
                r[4] = (2 * r[0] + 3 * r[1]) / 5;
                r[5] = (1 * r[0] + 4 * r[1]) / 5;
                r[6] = 0;
                r[7] = 255;
            }
            var td = (data[i+2] << 0) + (data[i+3] << 8) + (data[i+4] << 16);
            for (j = 0; j < 8; j ++){
                ret[this.tile2linear(i+j,width)*4 + 3] = r[td & 7];
                //if(i+j==0)debugger;
                td>>=3;
            }
            td = (data[i+5] << 0) + (data[i+6] << 8) + (data[i+7] << 16);
            for (j = 8; j < 16; j ++){
                ret[this.tile2linear(i+j,width)*4 + 3] = r[td & 7];
                td>>=3;
            }
            r[0] = (data[i+8] << 0) + (data[i+9] << 8);
            r[1] = (data[i+10] << 0) + (data[i+11] << 8);
            
            rr[0] = (r[0]>>11)<<3;
            rr[1] = (r[1]>>11)<<3;
            rg[0] = ((r[0]>>5)&0x3f)<<2;
            rg[1] = ((r[1]>>5)&0x3f)<<2;
            rb[0] = (r[0]&0x1f)<<3;
            rb[1] = (r[1]&0x1f)<<3;

            rr[2] = (2*rr[0] +   rr[1])/3;
            rr[3] = (  rr[0] + 2*rr[1])/3;
            rg[2] = (2*rg[0] +   rg[1])/3;
            rg[3] = (  rg[0] + 2*rg[1])/3;
            rb[2] = (2*rb[0] +   rb[1])/3;
            rb[3] = (  rb[0] + 2*rb[1])/3;
            
            var k;
            for (k = 0; k < 4; k++){
                td = data[i+12+k];
                for (j = 0; j < 4; j ++){
                    ret[this.tile2linear(i+j+k*4,width)*4+0] = rr[td&3];
                    ret[this.tile2linear(i+j+k*4,width)*4+1] = rg[td&3];
                    ret[this.tile2linear(i+j+k*4,width)*4+2] = rb[td&3];
                    td >>= 2;
                }
            }
        }
        return ret;
    }
    static BC5decode(data, width, height){
        if (!(data instanceof Uint8Array)){
            return ;
        }
        var ret = new Uint8Array(width*height*3);
        var i, j;
        var r = new Array(8);
        for (i = 0; i < width*height ; i+=16){
            r[0] = data[i];
            r[1] = data[i+1];
            if (r[0] > r[1]){
                // 6 interpolated color values
                r[2] = (6 * r[0] + 1 * r[1]) / 7;
                r[3] = (5 * r[0] + 2 * r[1]) / 7;
                r[4] = (4 * r[0] + 3 * r[1]) / 7;
                r[5] = (3 * r[0] + 4 * r[1]) / 7;
                r[6] = (2 * r[0] + 5 * r[1]) / 7;
                r[7] = (1 * r[0] + 6 * r[1]) / 7;
            }else{
                // 4 interpolated color values
                r[2] = (4 * r[0] + 1 * r[1]) / 5;
                r[3] = (3 * r[0] + 2 * r[1]) / 5;
                r[4] = (2 * r[0] + 3 * r[1]) / 5;
                r[5] = (1 * r[0] + 4 * r[1]) / 5;
                r[6] = 0;
                r[7] = 255;
            }
            var td = (data[i+2] << 0) + (data[i+3] << 8) + (data[i+4] << 16);
            for (j = 0; j < 8; j ++){
                ret[this.tile2linear(i+j,width)*3] = r[td & 7];
                //if(i+j==0)debugger;
                td>>=3;
            }
            td = (data[i+5] << 0) + (data[i+6] << 8) + (data[i+7] << 16);
            for (j = 8; j < 16; j ++){
                ret[this.tile2linear(i+j,width)*3] = r[td & 7];
                td>>=3;
            }
            r[0] = data[i+8];
            r[1] = data[i+9];
            if (r[0] > r[1]){
                // 6 interpolated color values
                r[2] = (6 * r[0] + 1 * r[1]) / 7;
                r[3] = (5 * r[0] + 2 * r[1]) / 7;
                r[4] = (4 * r[0] + 3 * r[1]) / 7;
                r[5] = (3 * r[0] + 4 * r[1]) / 7;
                r[6] = (2 * r[0] + 5 * r[1]) / 7;
                r[7] = (1 * r[0] + 6 * r[1]) / 7;
            }else{
                // 4 interpolated color values
                r[2] = (4 * r[0] + 1 * r[1]) / 5;
                r[3] = (3 * r[0] + 2 * r[1]) / 5;
                r[4] = (2 * r[0] + 3 * r[1]) / 5;
                r[5] = (1 * r[0] + 4 * r[1]) / 5;
                r[6] = 0;
                r[7] = 255;
            }
            td = (data[i+10] << 0) + (data[i+11] << 8) + (data[i+12] << 16);
            for (j = 0; j < 8; j ++){
                ret[this.tile2linear(i+j,width)*3+1] = r[td & 7];
                ret[this.tile2linear(i+j,width)*3+2] = 255;
                td>>=3;
            }
            td = (data[i+13] << 0) + (data[i+14] << 8) + (data[i+15] << 16);
            for (j = 8; j < 16; j ++){
                ret[this.tile2linear(i+j,width)*3+1] = r[td & 7];
                ret[this.tile2linear(i+j,width)*3+2] = 255;
                td>>=3;
            }
        }
        return ret;
    }
    static RGBAtoPNG(data,width,height){
        var newfile = new PNG({width:width,height:height});
        var i;
        for(i=0;i<width*height;i++){
            newfile.data[i*4] = data[i*4];
            newfile.data[i*4+1] = data[i*4+1];
            newfile.data[i*4+2] = data[i*4+2];
            newfile.data[i*4+3] =data[i*4+3];
        }
        var buffer = PNG.sync.write(newfile, { colorType: 6 });
        var a = document.createElement('a');
        var file = new Blob([ buffer ], { type: 'image/png' });
        
        a.href = URL.createObjectURL(file);
        a.download = 'bla';
        a.click();
    }
}
module.exports = CompressedTexture;