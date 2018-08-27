import * as THREE from 'three';

import Files from './Files.js';

const MultiLoader = {
    textureLoader: new THREE.TextureLoader(),
    jsonLoader: new THREE.JSONLoader(),
    _fileIndex: 0,
    _filesLength: 0,
    _fileNames: [],
    onLoadingCallback: false,
    onFinishCallback: false,
    load: (params) => {
        let files = params.files,
            onLoadingCallback = params.onLoading,
            onFinishCallback = params.onFinish;

        // Gestion des erreurs
        if (typeof files != "object") {
            console.error('[FileLoader] "files" parameter is not an object.');
            return;
        }
        if (onLoadingCallback != undefined && typeof onLoadingCallback != 'function') {
            console.error('[FileLoader] "onLoading" parameter is not a function.');
            return;
        }
        if (!onFinishCallback) {
            console.error('[FileLoader] "onFinish" callback must be provided.');
            return;
        }
        if (typeof onFinishCallback != 'function') {
            console.error('[FileLoader] "onFinish" callback is not a function.');
            return;
        }

        // Récupération des fichiers
        for (var i in files) {
            MultiLoader._fileNames.push(i);
        }
        MultiLoader._filesLength = MultiLoader._fileNames.length;
        if (typeof onLoadingCallback != undefined) MultiLoader.onLoadingCallback = onLoadingCallback;
        MultiLoader.onFinishCallback = onFinishCallback;

        MultiLoader._loadFile(MultiLoader._fileNames[0]);
    },
    _loadFile: fileName => {        
        if (Files[fileName].type == undefined) console.error("[FileLoader] File \"type\" attribute must be 'texture' or 'json'.");  
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
        if (Files[fileName].type == "json") {            
            MultiLoader.jsonLoader.load(
                Files[fileName].path,
                function (geometry, materials) {
                    Files[fileName].geometry = geometry;
                    Files[fileName].materials = materials;
                    MultiLoader._afterLoadFile();
                }
            );
        }
    },
    _afterLoadFile() {
        var percentageDone = MultiLoader._fileIndex/(MultiLoader._filesLength-1); // Valeur de 0 à 1        
        if (MultiLoader.onLoadingCallback) MultiLoader.onLoadingCallback(percentageDone);
        else console.log("[FileLoader] "+ percentageDone*100+"%");    

        if (MultiLoader._fileIndex < MultiLoader._filesLength-1) {   
            MultiLoader._fileIndex++;
            MultiLoader._loadFile(MultiLoader._fileNames[MultiLoader._fileIndex]);
        } else {    
            if (MultiLoader.onFinishCallback != false) MultiLoader.onFinishCallback();
        }
    }
}

export default MultiLoader;