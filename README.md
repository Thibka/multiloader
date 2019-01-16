# Description

The MultiLoader class controls textures, images and JSON files loading.


# Usage
First create an object listing all the assets you need to load.

```javascript
const Files = {
    // Textures
    ground: {
        type: 'texture',
        path: 'path/to/file.jpg', // use require if webpack
        repeat: true // optional. Default is false. Set to true to use THREE.RepeatWrapping
    },

    // CubeTexture
    skybox: { type: 'cubeTexture', paths: [
        'path/to/file_1.jpg',
        'path/to/file_2.jpg',
        'path/to/file_3.jpg',
        'path/to/file_4.jpg',
        'path/to/file_5.jpg',
        'path/to/file_6.jpg',
    ] }, // use require if webpack

    // Images
    bird: { type: 'image', path: 'path/to/file.jpg' }, // use require if webpack

    // GLTF - ! gltf files must be in a single /gltf folder
    cat: { type: 'gltf', path: 'path/to/gltf/scene.gltf'},

    // OBJ
    dog: { type: 'obj', path: 'path/to/file.obj'}
};
```

Then use the Files object as a parameter when initializing the MultiLoader.

```javascript
MultiLoader.load({
    files: Files,
    async: true, // optional. Default is true.
    onLoading: function(percent) {
        // 'percent' returns a value between 0 and 1 
    },
    onFinish: function() {
        // all assets loaded
    }
});
```

Files properties will be accessible like so:

*   Textures
    *   `Files.ground.texture`
*   CubeTextures
    *   `Files.skybox.cubeTexture`
*   Images
    *   `Files.bird.image`
*   GLTF
    *   `Files.cat.scene`
*   OBJ
    *   `Files.dog.object`


## OBJ

depend on https://www.npmjs.com/package/three-obj-loader


## GLTF
- Do not use require() when declaring the path in Files.js
```javascript
const Files = {
    landscape: { type: 'gltf', path: '../../gltf/scene.gltf' },
};
```
- The webpack.config.js file needs to be modified this way: 
    - exclude gltf from image loading
```javascript
    {
        test: /\.(png|jpe?g|gif|mp3|woff|woff2|eot|ttf|otf|obj)$/,
        exclude: /gltf/,
        use: [
            'file-loader'
        ]
    }
```
    - then move the untouched /gltf folder in the build
    - and reference it this way:
```javascript
new CopyWebpackPlugin([
    {from: 'src/models/gltf', to: 'gltf'},
])
```