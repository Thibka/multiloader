const Files = {
    // Textures
    dog: {
        type: 'texture',
        path: 'path/to/file.jpg', // use require if webpack
        repeat: true // optional. Default is true
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

export default Files;