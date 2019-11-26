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
        this.Meshes = [];
        this.Materials = [];
        this.pos = data.getpos();
        this.BoundingSphere = undefined;
        this.Read(data)
    }
    Read(st){
        var sign = st.getUint32();
        if (sign != 0x00010000)
            throw "not an Object! file may be corrupted";
        st.getUint32();
        this.BoundingSphere = st.getBoundingSphere();
        var meshCount = st.getUint32();
        var meshOffset = st.getUint32() + this.pos;
        var materialCount = st.getUint32();
        var materialsOffset = st.getUint32() + this.pos;

        var i;
        var pos = st.getpos();
        for (i = 0; i < meshCount; i++){
            st.setpos(meshOffset + i * Mesh.getSize());
            this.Meshes.push(new Mesh(st, this.pos));
        }
        st.setpos(pos);

        for (i = 0; i < materialCount; i++){
            st.setpos(materialsOffset + i * Material.getSize());
            this.Materials.push(new Material(st));
        }
    }
}

module.exports = Object;