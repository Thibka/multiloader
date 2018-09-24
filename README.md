Description
==================

The MultiLoader class controls textures, images and JSON files loading.


Usage
==================
First create an object listing all the assets you need to load.

```javascript
const Files = {
    // Textures
    dog: {
        type: 'texture',
        path: 'path/to/file.jpg', // use require if webpack
        repeat: true // optional. Default is false. Set to true to use THREE.RepeatWrapping
    },

    // Images
    bird: {
        type: 'image',
        path: 'path/to/file.jpg' // use require if webpack
    },

    // JSON
    cat: {
        type: 'json',
        path: 'path/to/file.json' // use require if webpack
    }
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
    *   `Files.dog.texture`
*   Images
    *   `Files.bird.image`
*   JSON files
    *   `Files.cat.geometry`
    *   `Files.cat.materials`


