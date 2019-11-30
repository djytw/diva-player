'use strict';

var DIVA = {};
DIVA.FarcArchive = require('./diva/Archives/farc');
DIVA.Mesh = require('./diva/Objects/Mesh');
DIVA.Material = require('./diva/Materials/Material');
DIVA.ObjectSet = require('./diva/Objects/ObjectSet');
DIVA.Object = require('./diva/Objects/Object');
DIVA.SubMesh = require('./diva/Objects/SubMesh');
DIVA.Skin = require('./diva/Objects/Skin');
DIVA.TextureSet = require('./diva/Textures/TextureSet');
DIVA.Texture = require('./diva/Textures/Texture');
DIVA.SubTexture = require('./diva/Textures/SubTexture');
DIVA.Utils = require('./diva/Utils/util');

//const fs = require('fs')

//var file = fs.readFileSync('X:\\pdaft\\rom\\objset\\cmnitm1038.farc');
//var files = FarcArchive.Read(toArrayBuffer(file));

//var file = fs.readFileSync('test/cmnitm1038_tex.bin');
//DIVA.TextureSet.Read(DIVA.Utils.toArrayBuffer(file));


module.exports = DIVA;