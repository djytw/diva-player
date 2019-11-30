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
if (typeof window != 'undefined' && window.pako != undefined) pako = window.pako;
else pako = require('pako');
var Stream = require('../Utils/stream')
var aesjs = require('aes-js');

class FarcArchive{
    static Read(data){
        if (data instanceof ArrayBuffer == false)
            throw "illegal param";
        
        var dv = new DataView(data);
        var st = new Stream(dv);

        var sign = st.getString(4);
        var headsize = st.getUint32() + 0x08;

        if (sign == "FArC"){
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
        }else if (sign == "FARC"){
            var fileInf = [];
            
            var flags = st.getUint32();
            var isCompressed = ( flags & 2 ) != 0;
            var isEncrypted = ( flags & 4 ) != 0;
            var padding = st.getUint32();
            var alignment = st.getUint32();
            var format = st.getUint32();
            var entryCount = st.getUint32();

            while (st.getpos() < headsize){
                var info = {};
                info.fname = st.getString();
                info.offset = st.getUint32();
                info.csize = st.getUint32();
                info.osize = st.getUint32(); 
                fileInf.push(info);
            }

            for(info of fileInf){
                var dt = new Uint8Array(data, info.offset, ( info.csize + 15 ) & ~15);
                if (isEncrypted){
                    var key = [0x70, 0x72, 0x6F, 0x6A, 0x65, 0x63, 0x74, 0x5F, 0x64, 0x69, 0x76, 0x61, 0x2E, 0x62, 0x69, 0x6E];
                    var aesEcb = new aesjs.ModeOfOperation.ecb(key);
                    dt = aesEcb.decrypt(dt);
                }
                if (isCompressed){
                    dt = pako.ungzip(dt);
                }
                info.content = dt;
            }
        }else{
            throw "type not supported yet: "+sign;
        }
        return fileInf;
    }
}
module.exports = FarcArchive;