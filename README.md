Description
==================

The MultiLoader class allows to control the loading of textures and JSON files.
Callbacks can be attached at the end of each file loading (useful to display the progress), and when all the assets are loaded.


Usage
==================
First create an object listing all the assets you need to load.

```javascript
const Files = {
    // Textures
    earth: {
        type: 'texture',
        path: "path/to/file.jpg" // use require if webpack
    },

    // JSON
    astronaut: {
        type: 'json',
        path: "path/to/file.json" // use require if webpack
    }
};
```

Then pass it as a parameter when initializing the MultiLoader.

```javascript
MultiLoader.load({
    files: Files, 
    onLoading: function(percent) {
        // 'percent' returns a value between 0 and 1 
    },
    onFinish: function() {
        // all assets loaded
    }
});
```

Files properties will be accessible like so:
Textures
    Files.dog.texture
JSON files
    Files.cat.geometry
    Files.cat.materials


