const {mat4, vec3} = glMatrix;

let canvas;
let gl;
let app;


function init() {
    // Initialize <canvas> with a WebGL2 context
    canvas = document.getElementById('view');
    canvas.width = 800;
    canvas.height = 600;
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert('Unable to initialize WebGL 2. Your browser may not support it.');
    }

    // Initialize app data members
    app = {
        program: null,                        // GPU program (vertex shader + fragment shader)
        uniforms: null,                       // references to uniform variables in GPU program
        vertex_position_attrib: 0,            // vertex attribute 0: 3D position
        vertex_color_attrib: 1,               // vertex attribute 1: RGB color
        projection_matrix: mat4.create(),     // projection matrix (on CPU)
        view_matrix: mat4.create(),           // view matrix (on CPU)
        model_matrix: mat4.create(),          // model matrix (on CPU)
        triangle: null                        // model 'vertex array object' (contains all attributes
                                              // of the model - vertices, color, faces, ...)
    };

    // Download and compile shaders into GPU programs
    let color_vs = getTextFile('shaders/color.vert');
    let color_fs = getTextFile('shaders/color.frag');
    Promise.all([color_vs, color_fs])
    .then((shaders) => {
        createShaderProgram(shaders[0], shaders[1]);
        initializeGlApp();
    }).catch((error) => {
        console.log('Error:', error);
    });
}

function createShaderProgram(vert_source, frag_source) {
    // Compile shader program
    app.program = glslCreateShaderProgram(gl, vert_source, frag_source);

    // Bind vertex input data locations
    gl.bindAttribLocation(app.program, app.vertex_position_attrib, 'vertex_position');
    gl.bindAttribLocation(app.program, app.vertex_color_attrib, 'vertex_color');

    // Link shader program
    glslLinkShaderProgram(gl, app.program);

    // Get list of uniforms available in shaders
    app.uniforms = glslGetShaderProgramUniforms(gl, app.program);
}

function initializeGlApp() {
    console.log(app);
}

// Function to read (i.e. download) text file
function getTextFile(address) {
    return new Promise((resolve, reject) => {
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                resolve(req.responseText);
            }
            else if (req.readyState === 4) {
                reject({url: req.responseURL, status: req.status});
            }
        };
        req.open('GET', address, true);
        req.send();
    });
}
