'use strict';

class BC5{
    static tile2linear(pos, size){
        //turn 4x4 compressed tile position to linear position.

        //var blockpos = Math.floor(pos / 16);
        //var blockinline = size / 4;
        //var blockrow = Math.floor(blockpos / blockinline);
        //var blockcol = blockpos % blockinline;
        //
        //inblock = pos % 16;
        //var destrow = blockrow * 4 +  Math.floor(inblock / 4);
        //var destcol = blockcol * 4 + inblock % 4;

        //return destrow * size + destcol;

        return (~~(~~(pos / 16) / (size / 4)) * 4 + (~~((pos % 16) / 4))) * size + ((~~(pos / 16) % (size / 4)) * 4 + (pos % 16) % 4);
    }
    static decode(data, size){
        if (!data instanceof Uint8Array){
            return ;
        }
        var ret = new Uint8Array(size*size*3);
        var i, j;
        var r = new Array(8);
        for (i = 0; i < size*size ; i+=16){
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
            var td = (data[i+2] << 16) + (data[i+3] << 8) + data[i+4];
            for (j = 0; j < 8; j ++){
                ret[this.tile2linear(i+j,size)*3] = r[td & 7];
                //if(i+j==0)debugger;
                td>>=3;
            }
            td = (data[i+5] << 16) + (data[i+6] << 8) + data[i+7];
            for (j = 8; j < 16; j ++){
                ret[this.tile2linear(i+j,size)*3] = r[td & 7];
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
            td = (data[i+10] << 16) + (data[i+11] << 8) + data[i+12];
            for (j = 0; j < 8; j ++){
                ret[this.tile2linear(i+j,size)*3+1] = r[td & 7];
                ret[this.tile2linear(i+j,size)*3+2] = 255;
                td>>=3;
            }
            td = (data[i+13] << 16) + (data[i+14] << 8) + data[i+15];
            for (j = 8; j < 16; j ++){
                ret[this.tile2linear(i+j,size)*3+1] = r[td & 7];
                ret[this.tile2linear(i+j,size)*3+2] = 255;
                td>>=3;
            }
        }
        return ret;
    }
}
module.exports = BC5;