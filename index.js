// depend on https://www.npmjs.com/package/three-obj-loader

import * as THREE from 'three';
import Files from './Files.js';
import GLTFLoader from './GLTFLoader.js';
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

const MultiLoader = {
    textureLoader: new THREE.TextureLoader(),
    objLoader: new THREE.OBJLoader(),
    gltfLoader: new GLTFLoader(),
    cubeTextureLoader: new THREE.CubeTextureLoader(),
    _fileIndex: 0,
    _filesLength: 0,
    _fileNames: [],
    onLoadingCallback: false,
    onFinishCallback: false
}

MultiLoader.load = params => {
    let files = params.files,
        onLoadingCallback = params.onLoading,
        onFinishCallback = params.onFinish;
    MultiLoader.async = (params.async == undefined) ? true : params.async;

    // Gestion des erreurs
    if (typeof files != "object") {
        console.error('[FileLoader] files n\'est pas un objet.');
        return;
    }
    if (onLoadingCallback != undefined && typeof onLoadingCallback != 'function') {
        console.error('[FileLoader] "onLoading" parameter must be a function.');
        return;
    }
    if (!onFinishCallback) {
        console.error('[FileLoader] Aucun callback "onFinish" fourni.');
        return;
    }
    if (typeof onFinishCallback != 'function') {
        console.error('[FileLoader] "onFinish" parameter must be a function.');
        return;
    }

    // Retreiving files
    for (var i in files) {
        MultiLoader._fileNames.push(i);
    }
    MultiLoader._filesLength = MultiLoader._fileNames.length;
    if (typeof onLoadingCallback != undefined) MultiLoader.onLoadingCallback = onLoadingCallback;
    MultiLoader.onFinishCallback = onFinishCallback;

    if (MultiLoader.async) {
        MultiLoader._fileNames.forEach(fileName => {
            MultiLoader._loadFile(fileName);
        });
    } else {
        MultiLoader._loadFile(MultiLoader._fileNames[0]);
    }
};

MultiLoader._loadFile = fileName => {
    if (Files[fileName].type == undefined) console.error("[FileLoader] No \"type\" property provided.");
    if (Files[fileName].type == "texture") {
        MultiLoader.textureLoader.load(
            Files[fileName].path,
            function (texture) {
                if (Files[fileName].repeat) texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                Files[fileName].texture = texture;
                MultiLoader._afterLoadFile();
            }
        );
    }
    if (Files[fileName].type == "cubeTexture" || Files[fileName].type == "cubetexture") {
        MultiLoader.cubeTextureLoader.load(
            [
                Files[fileName].paths[0],
                Files[fileName].paths[1],
                Files[fileName].paths[2],
                Files[fileName].paths[3],
                Files[fileName].paths[4],
                Files[fileName].paths[5],
            ],
            function (texture) {
                Files[fileName].cubeTexture = texture;
                MultiLoader._afterLoadFile();
            }
        );
    }
    if (Files[fileName].type == "image") {
        let image = new Image();
        image.addEventListener("load", function () {
            Files[fileName].image = this;
            MultiLoader._afterLoadFile();
        });
        image.src = Files[fileName].path;
    }
    if (Files[fileName].type == "obj") {
        MultiLoader.objLoader.load(
            Files[fileName].path,
            function (object) {
                Files[fileName].object = object;
                MultiLoader._afterLoadFile();
            }
        );
    }
    if (Files[fileName].type == "gltf") {
        MultiLoader.gltfLoader.load(
            Files[fileName].path,
            function (gltf) {
                Files[fileName].scene = gltf.scene;
                MultiLoader._afterLoadFile();
            }, undefined, function(error) {
                console.error(error);
            }
        );
    }
}

MultiLoader._afterLoadFile = () => {
    var percentageDone = MultiLoader._fileIndex / (MultiLoader._filesLength - 1); // between 0 and 1       
    if (MultiLoader.onLoadingCallback) MultiLoader.onLoadingCallback(percentageDone);
    else console.log("[FileLoader] " + percentageDone * 100 + "%");

    if (MultiLoader._fileIndex < MultiLoader._filesLength - 1) {
        MultiLoader._fileIndex++;
        if (!MultiLoader.async) MultiLoader._loadFile(MultiLoader._fileNames[MultiLoader._fileIndex]);
    } else {
        if (MultiLoader.onFinishCallback != false) MultiLoader.onFinishCallback();
    }
}

export default MultiLoader;