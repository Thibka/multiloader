const Files = {
    // Textures
    dog: {
        type: 'texture',
        path: 'path/to/file.jpg' // use require if webpack
    },
    bird: {
        type: 'texture',
        path: 'path/to/file.jpg', // use require if webpack
        repeat: true
    },

    // JSON
    cat: {
        type: 'json',
        path: 'path/to/file.json' // use require if webpack
    }
};

export default Files;