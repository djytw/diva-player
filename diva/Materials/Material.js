'use strict';

var Stream = require('../Utils/stream');

class Material{
    static getSize(){
        return 0x4B0;
    }
    constructor(data){
        if (data instanceof Stream == false)
            throw "illegal param";

        this.Read(data);
    }
    Read(st){
        var sign = st.getUint32();
        this.Field00 = st.getUint32();
        this.Shader = st.getString(8);
        this.Diffuse = this.ReadMaterialTexture(st);
        this.Ambient = this.ReadMaterialTexture(st);
        this.Normal = this.ReadMaterialTexture(st);
        this.Specular = this.ReadMaterialTexture(st);
        this.ToonCurve = this.ReadMaterialTexture(st);
        this.Reflection = this.ReadMaterialTexture(st);
        this.Tangent = this.ReadMaterialTexture(st);
        this.Texture08 = this.ReadMaterialTexture(st);
        this.Field01 = st.getUint32();
        this.Field02 = st.getUint32();
        this.DiffuseColor = st.getColor();
        this.AmbientColor = st.getColor();
        this.SpecularColor = st.getColor();
        this.EmissionColor = st.getColor();
        this.Shininess = st.getFloat32();
        this.Field20 = st.getFloat32();
        this.Field21 = st.getFloat32();
        this.Field22 = st.getFloat32();
        this.Field23 = st.getFloat32();
        this.Field24 = st.getFloat32();
        this.Name = st.getString(64);
        this.Field25 = st.getFloat32();
        this.Field26 = st.getFloat32();
        this.Field27 = st.getFloat32();
        this.Field28 = st.getFloat32();
        this.Field29 = st.getFloat32();
        this.Field30 = st.getFloat32();
        this.Field31 = st.getFloat32();
        this.Field32 = st.getFloat32();
        this.Field33 = st.getFloat32();
        this.Field34 = st.getFloat32();
        this.Field35 = st.getFloat32();
        this.Field36 = st.getFloat32();
        this.Field37 = st.getFloat32();
        this.Field38 = st.getFloat32();
        this.Field39 = st.getFloat32();
        this.Field40 = st.getFloat32();
    }
    ReadMaterialTexture(st){
        var mt = {};
        mt.Field00 = st.getInt32();
        mt.Field01 = st.getInt32();
        mt.TextureId = st.getInt32();
        mt.Field02 = st.getInt32();
        mt.Field03 = st.getFloat32();
        mt.Field04 = st.getFloat32();
        mt.Field05 = st.getFloat32();
        mt.Field06 = st.getFloat32();
        mt.Field07 = st.getFloat32();
        mt.Field08 = st.getFloat32();
        mt.Field09 = st.getFloat32();
        mt.Field10 = st.getFloat32();
        mt.Field11 = st.getFloat32();
        mt.Field12 = st.getFloat32();
        mt.Field13 = st.getFloat32();
        mt.Field14 = st.getFloat32();
        mt.Field15 = st.getFloat32();
        mt.Field16 = st.getFloat32();
        mt.Field17 = st.getFloat32();
        mt.Field18 = st.getFloat32();
        mt.Field19 = st.getFloat32();
        mt.Field20 = st.getFloat32();
        mt.Field21 = st.getFloat32();
        mt.Field22 = st.getFloat32();
        mt.Field23 = st.getFloat32();
        mt.Field24 = st.getFloat32();
        mt.Field25 = st.getFloat32();
        mt.Field26 = st.getFloat32();
        mt.Field27 = st.getFloat32();
        mt.Field28 = st.getFloat32();
        return mt;
    }
}
module.exports = Material;