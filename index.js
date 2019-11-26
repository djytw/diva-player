'use strict';

var DIVA = {};
DIVA.FarcArchive = require('./diva/Archives/farc');
DIVA.Mesh = require('./diva/Objects/Mesh');
DIVA.Material = require('./diva/Materials/Material');
DIVA.ObjectSet = require('./diva/Objects/ObjectSet');
DIVA.Object = require('./diva/Objects/Object');
DIVA.SubMesh = require('./diva/Objects/SubMesh');
DIVA.Skin = require('./diva/Objects/Skin');
/*

const fs = require('fs')

//var file = fs.readFileSync('X:\\pdaft\\rom\\objset\\cmnitm1038.farc');
//var files = FarcArchive.Read(toArrayBuffer(file));

var file = fs.readFileSync('test/cmnitm1038_obj.bin');
DIVA.ObjectSet.Read(toArrayBuffer(file));


function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
*/

module.exports = DIVA;