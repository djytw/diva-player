'use strict';

var Stream = require('../Utils/stream');
var Material = require('../Materials/Material');
var Mesh = require('../Objects/Mesh');

class Object{
    constructor(id, data, name){
        if (data instanceof Stream == false)
            throw "illegal param";
        this.id = id;
        this.name = name;
        this.pos = data.getpos();
        this.Read(data)
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x00010000)
            throw "not an Object! file may be corrupted";
        st.getUint32();
        this.BoundingSphere = st.getBoundingSphere();
        this.meshCount = st.getUint32();
        this.meshOffset = st.getUint32();
        this.materialCount = st.getUint32();
        this.materialsOffset = st.getUint32();

        var i;
        var pos = st.getpos();
        this.Meshes = [];
        for (i = 0; i < this.meshCount; i++){
            st.setpos(this.meshOffset + this.pos + i * Mesh.getSize());
            this.Meshes.push(new Mesh(st, this.pos));
        }
        st.setpos(pos);
        this.Materials = [];
        for (i = 0; i < this.materialCount; i++){
            st.setpos(this.materialsOffset + this.pos + i * Material.getSize());
            this.Materials.push(new Material(st));
        }
    }
}

module.exports = Object;