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
            onFinishCallback = params.onFinish,
            async = params.async || true;

        // Gestion des erreurs
        if (typeof files != "object") {
            console.error('[FileLoader] files n\'est pas un objet.');
            return;
        }
        if (onLoadingCallback != undefined && typeof onLoadingCallback != 'function') {
            console.error('[FileLoader] Le paramètre "onLoading" fourni n\'est pas une fonction.');
            return;
        }
        if (!onFinishCallback) {
            console.error('[FileLoader] Aucun callback "onFinish" fourni.');
            return;
        }
        if (typeof onFinishCallback != 'function') {
            console.error('[FileLoader] Le paramètre "onFinish" fourni n\'est pas une fonction.');
            return;
        }

        // Récupération des fichiers
        for (var i in files) {
            MultiLoader._fileNames.push(i);
        }
        MultiLoader._filesLength = MultiLoader._fileNames.length;
        if (typeof onLoadingCallback != undefined) MultiLoader.onLoadingCallback = onLoadingCallback;
        MultiLoader.onFinishCallback = onFinishCallback;

        if (async) {
            MultiLoader._fileNames.forEach(fileName => {
                MultiLoader._loadFile(fileName);
            });
        } else {
            MultiLoader._loadFile(MultiLoader._fileNames[0]);
        }
    },
    _loadFile: fileName => {
        if (Files[fileName].type == undefined) console.error("[FileLoader] Fichier sans propriété \"type\"");
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
        if (Files[fileName].type == "image") {
            let image = new Image();
            image.addEventListener("load", function () {
                Files[fileName].image = this;
                MultiLoader._afterLoadFile();
            });
            image.src = Files[fileName].path;
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
        var percentageDone = MultiLoader._fileIndex / (MultiLoader._filesLength - 1); // Valeur de 0 à 1        
        if (MultiLoader.onLoadingCallback) MultiLoader.onLoadingCallback(percentageDone);
        else console.log("[FileLoader] " + percentageDone * 100 + "%");

        if (MultiLoader._fileIndex < MultiLoader._filesLength - 1) {
            MultiLoader._fileIndex++;
            MultiLoader._loadFile(MultiLoader._fileNames[MultiLoader._fileIndex]);
        } else {
            if (MultiLoader.onFinishCallback != false) MultiLoader.onFinishCallback();
        }
    }
}

export default MultiLoader;