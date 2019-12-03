'use strict';

var THREE;
if (typeof window != 'undefined' && window.THREE != undefined) THREE = window.THREE;
else THREE = require('three');
class Stream{
    constructor(dv){
        if (dv instanceof DataView == false)
            throw "illegal param";
        this.dataView = dv;
        this.pc = 0;
        this.endian = this.BIG_ENDIAN;
    }
    setendian(endian){
        this.endian = endian;
    }
    getpos(){
        return this.pc;
    }
    setpos(pc){
        this.pc = pc;
    }
    getString(p){
        // p=undefined, read to '\0'
        // p!=0, read p length
        if (this.dataView == undefined){
            throw "not initialized";
        }
        var str = "";
        var c;
        if(p == undefined)
            while (( c = this.dataView.getUint8(this.pc ++)) != 0)
                str += String.fromCharCode(c);
        else
            for (; p > 0; p--, this.pc++)
                if ((c = this.dataView.getUint8(this.pc)) != 0)
                    str += String.fromCharCode(c);
        return str;
    }
    getStringAt(pos, p){
        if (this.dataView == undefined){
            throw "not initialized";
        }
        var str = "";
        var c;
        if(p == undefined)
            while (( c = this.dataView.getUint8(pos ++)) != 0)
                str += String.fromCharCode(c);
        else
            for (; p > 0; p--, pos++)
                if ((c = this.dataView.getUint8(pos)) != 0)
                    str += String.fromCharCode(c);
        return str;
    }
    getUint8(){
        var r = this.dataView.getUint8(this.pc, this.endian);
        this.pc ++;
        return r;
    }
    getUint8s(count){
        var ret = [];
        for (var i = 0; i < count; i++){
            ret.push(this.getUint8());
        }
        return ret;
    }
    getUint16(){
        var r = this.dataView.getUint16(this.pc, this.endian);
        this.pc += 2;
        return r;
    }
    getUint16s(count){
        var ret = [];
        for (var i = 0; i < count; i++){
            ret.push(this.getUint16());
        }
        return ret;
    }
    getInt32(pos){
        if (pos == undefined){
            var r = this.dataView.getInt32(this.pc, this.endian);
            this.pc += 4;
            return r;
        }else{
            return this.dataView.getInt32(pos, this.endian);
        }
    }
    getUint32(pos){
        if (pos == undefined){
            var r = this.dataView.getUint32(this.pc, this.endian);
            this.pc += 4;
            return r;
        }else{
            return this.dataView.getUint32(pos, this.endian);
        }
    }
    getUint32s(count){
        var ret = [];
        for (var i = 0; i < count; i++){
            ret.push(this.getUint32());
        }
        return ret;
    }
    getInt32(){
        var r = this.dataView.getInt32(this.pc, this.endian);
        this.pc += 4;
        return r;
    }
    getFloat32(){
        var r = this.dataView.getFloat32(this.pc, this.endian);
        this.pc += 4;
        return r;
    }
    getVector2(){
        return [this.getFloat32(), this.getFloat32()];
    }
    getVector3(){
        return [this.getFloat32(), this.getFloat32(), this.getFloat32()];
    }
    getVector4(){
        return [this.getFloat32(), this.getFloat32(), this.getFloat32(), this.getFloat32()];
    }
    getVector2s(count){
        var ret = [];
        for (var i = 0; i < count * 2; i++){
            ret.push(this.getFloat32());
        }
        return ret;
    }
    getVector3s(count){
        var ret = [];
        for (var i = 0; i < count * 3; i++){
            ret.push(this.getFloat32());
        }
        return ret;
    }
    getVector4s(count){
        var ret = [];
        for (var i = 0; i < count * 4; i++){
            ret.push(this.getFloat32());
        }
        return ret;
    }
    getColor(){
        return this.getVector4();
    }
    getColors(count){
        return this.getVector4s(count);
    }
    getBoundingSphere() {
        return new THREE.Sphere(this.getVector3(), this.getFloat32());
    }
    getMatrix4(){
        var ret = new THREE.Matrix4();
        ret.set(this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),
        this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),
        this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32(),
        this.getFloat32(),this.getFloat32(),this.getFloat32(),this.getFloat32());
        return ret;
    }
}
Stream.BIG_ENDIAN = 0;
Stream.LITTLE_ENDIAN = 1;
module.exports = Stream;