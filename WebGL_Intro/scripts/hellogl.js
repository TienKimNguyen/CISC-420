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

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.8, 0.8, 0.8, 1.0); // colors range from 0 - 1
    gl.enable(gl.DEPTH_TEST);

    //app.triangle = createTriangleVertexArrayObject();
    app.triangle = createSquareVertexArrayObject();

    // Transform to canonical view volume
    // Need to specify L, R, B, T, N, F
    mat4.ortho(app.projection_matrix, 0.0, canvas.width, 0.0, canvas.height, 0.1, 10.0);
    mat4.identity(app.view_matrix); // set the view matrix to identity matrix b/c we want to look straight to the model
    mat4.identity(app.model_matrix); // define model matrix as identity matrix
    mat4.translate(app.model_matrix, app.model_matrix, vec3.fromValues(0.0, 0.0, -5.0)); // ()

    gl.useProgram(app.program);
    // Location where we want to upload, whether we want to transpose, and the data we want to upload
    gl.uniformMatrix4fv(app.uniforms.projection_matrix, false, app.projection_matrix ); // use matrix 4x4 (Matrix4) with 4 components (f) and 4 values (v)
    gl.uniformMatrix4fv(app.uniforms.view_matrix, false, app.view_matrix ); 
    gl.uniformMatrix4fv(app.uniforms.model_matrix, false, app.model_matrix ); 
    gl.useProgram(null);
    
    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

    gl.useProgram(app.program);
    
    //gl.bindVertexArray(app.triangle);
    //gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(app.triangle);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    
    // If use triangle strip, change indices array to [0, 1, 2, 3]
    // gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0);
    
    gl.bindVertexArray(null);

    gl.useProgram(null);
}

function createTriangleVertexArrayObject () {
    let vertex_array = gl.createVertexArray();
    gl.bindVertexArray(vertex_array);

    // Vertex Position Buffer
    // USE THESE 3 VERTICES
    let vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_position_buffer);
    let vertices = [
        200.0, 127.0, 0.0,
        600.0, 127.0, 0.0,
        400.0, 473.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(app.vertex_position_attrib);
    gl.vertexAttribPointer(app.vertex_position_attrib, 3, gl.FLOAT, false, 0, 0);


    // COLORS
    let vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);
    let colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(app.vertex_color_attrib);
    gl.vertexAttribPointer(app.vertex_color_attrib, 3, gl.FLOAT, false, 0, 0);


    // INDEX
    let vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
    let indices = [0, 1, 2];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // UNBIND
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return vertex_array;
}

function createSquareVertexArrayObject(){
    let vertex_array = gl.createVertexArray();
    gl.bindVertexArray(vertex_array);

    // Vertex Position Buffer
    // USE THESE 3 VERTICES
    let vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_position_buffer);
    let vertices = [
        200.0, 100.0, 0.0,
        400.0, 100.0, 0.0,
        200.0, 300.0, 0.0,
        400.0, 300.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(app.vertex_position_attrib);
    gl.vertexAttribPointer(app.vertex_position_attrib, 3, gl.FLOAT, false, 0, 0);


    // COLORS
    let vertex_color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);
    let colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        1.0, 1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(app.vertex_color_attrib);
    gl.vertexAttribPointer(app.vertex_color_attrib, 3, gl.FLOAT, false, 0, 0); // 3 = grouping by 3 items in 1 group


    // INDEX
    let vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
    let indices = [
        0, 1, 2,
        1, 3, 2
    ]; // place in counter-clockwise order
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // UNBIND
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return vertex_array;
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
