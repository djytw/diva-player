'use strict';

/*
 *      FARC Archive
 *      
 *      FArC type:
 *      |  ----------------  |  -----------------------------------------   header   --------------------------------------------  |  --------------------  content  --------------- |    
 *      | Sign | header size | not used |   fileN.name  | fileN.offset | fileN.compressedsize | fileN.uncomprsize | ..(next file)..|  ----------------  gzipped content  ----------- |
 *      | FArC |     u32     |  4 bytes |(end with '\0')|     u32      |         u32          |         u32       |                |(start from fileN.offset)  (start with 0x1F 0x8B)|
 *   
 * 
 */

var pako;
if (window.pako != undefined) pako = window.pako;
else pako = require('pako');
var Stream = require('../Utils/stream')

class FarcArchive{
    static Read(data){
        if (data instanceof ArrayBuffer == false)
            throw "illegal param";
        
        var dv = new DataView(data);
        var st = new Stream(dv);

        var sign = st.getString(4);
        if (sign == "FArC"){
            var headsize = st.getUint32();
            st.getUint32();
            var fileInf = [];
            while (st.getpos() < headsize){
                var info = {};
                info.fname = st.getString();
                info.offset = st.getUint32();
                info.csize = st.getUint32();
                info.osize = st.getUint32(); 
                fileInf.push(info);
            }
            for (info of fileInf){
                var gz = new Uint8Array(data, info.offset, info.csize);
                var odata = pako.ungzip(gz);
                if (odata.length != info.osize)
                    throw "Decompress error."
                info.content = odata;
            }
        }else{
            throw "type not supported yet: "+sign;
        }
        return fileInf;
    }
}
module.exports = FarcArchive;