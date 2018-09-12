const Files = {
    // Textures
    dog: {
        type: 'texture',
        path: 'path/to/file.jpg', // use require if webpack
        repeat: true // optional. Default is true
    },

    // Images
    bird: {
        type: 'image',
        path: 'path/to/file.jpg', // use require if webpack
    },

    // JSON
    cat: {
        type: 'json',
        path: 'path/to/file.json' // use require if webpack
    }
};

export default Files;