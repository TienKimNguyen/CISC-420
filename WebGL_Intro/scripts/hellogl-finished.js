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

    // Set drawing area to be the entire framebuffer
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    // Set the background color to a light gray
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    // Enable z-buffer for visible surface determination
    gl.enable(gl.DEPTH_TEST);

    // Create model of a triangle with one vertex red, one green, and one blue
    app.triangle = createTriangleVertexArrayObject();

    // Set values for model, view, and projection matrices
    // model - translate back away from camera (so it's in the view)
    mat4.identity(app.model_matrix);
    mat4.translate(app.model_matrix, app.model_matrix, vec3.fromValues(0.0, 0.0, -5.0));
    // view - leave as identity (no transformation)
    mat4.identity(app.view_matrix);
    // projection - orthographic (parallel) projection... good for 2D
    mat4.ortho(app.projection_matrix, 0.0, canvas.width, 0.0, canvas.height, 0.1, 10.0);

    // Render
    render();
}

function render() {
    // Delete previous frame (reset both framebuffer and z-buffer)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set which GPU program (shaders) to use for rendering
    gl.useProgram(app.program);

    // Upload our matrices to the GPU - specifying which variables in 
    // our shaders to assign the values to
    gl.uniformMatrix4fv(app.uniforms.projection_matrix, false, app.projection_matrix);
    gl.uniformMatrix4fv(app.uniforms.view_matrix, false, app.view_matrix);
    gl.uniformMatrix4fv(app.uniforms.model_matrix, false, app.model_matrix);

    // Select our triangle 'vertex array object' for drawing
    gl.bindVertexArray(app.triangle);
    // Draw the selected 'vertex array object' (using triangles)
    gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
    // Unselect our triangle 'vertex array object'
    gl.bindVertexArray(null);
}

function createTriangleVertexArrayObject() {
    // Create a new 'vertex array object'
    let vertex_array = gl.createVertexArray();
    // Set newly created 'vertex array object' as the active one we are modifying
    gl.bindVertexArray(vertex_array);


    // Create buffer to store vertex positions (3D points)
    let vertex_position_buffer = gl.createBuffer();
    // Set newly created buffer as the active one we are modifying
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_position_buffer);
    // Create array of 3D vertex values (each set of 3 values specifies a vertex: x, y, z)
    let vertices = [
        200.0, 127.0, 0.0,
        600.0, 127.0, 0.0,
        400.0, 473.0, 0.0
    ];
    // Store array of vertex positions in the vertex_position_buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Enable vertex_position_attrib in our GPU program
    gl.enableVertexAttribArray(app.vertex_position_attrib);
    // Attach vertex_position_buffer to the vertex_position_attrib
    // (as 3-component floating point values)
    gl.vertexAttribPointer(app.vertex_position_attrib, 3, gl.FLOAT, false, 0, 0);


    // Create buffer to store vertex colors (RGB)
    let vertex_color_buffer = gl.createBuffer();
    // Set newly created buffer as the active one we are modifying
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_color_buffer);
    // Create array of RGB color values (each set of 3 values specifies a color)
    let colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ];
    // Store array of vertex colors in the vertex_color_buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // Enable vertex_color_attrib in our GPU program
    gl.enableVertexAttribArray(app.vertex_color_attrib);
    // Attach vertex_color_buffer to the vertex_color_attrib
    // (as 3-component floating point values)
    gl.vertexAttribPointer(app.vertex_color_attrib, 3, gl.FLOAT, false, 0, 0);


    // Create buffer to store faces of the triangle
    let vertex_index_buffer = gl.createBuffer();
    // Set newly created buffer as the active one we are modifying
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
     // Create array of vertex indices (each set of 3 represents a triangle)
    let indices = [
         0,  1,  2
    ];
    // Store array of vertex indices in the vertex_index_buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    // No longer modifying our 'vertex array object' (or it's buffers), so deselect
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);


    // Return created 'vertex array object'
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

/*
class HelloGl {
    constructor(canvas_id, width, height) {
        // initialize <canvas> with a WebGL 2 context
        this.canvas = document.getElementById(canvas_id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl = this.canvas.getContext('webgl2');
        if (!this.gl) {
            alert('Unable to initialize WebGL 2. Your browser may not support it.');
        }

        // initialize local data members
        this.program = null;                        // GPU program (vertex shader + fragment shader)
        this.vertex_position_attrib = 0;            // vertex attribute 0: 3D position
        this.vertex_color_attrib = 1;               // vertex attribute 1: RGBA color

        this.projection_matrix = new Matrix(4, 4);  // projection matrix (on CPU)
        this.view_matrix = new Matrix(4, 4);        // view matrix (on CPU)
        this.model_matrix = new Matrix(4, 4);       // model matrix (on CPU)

        this.uniforms = {};                         // references to uniform variables in GPU program

        this.triangle_vao = null;                   // model Vertex Array Object (contains all attributes
                                                    // of the model - vertices, color, faces, ...)

        // download and compile shaders into GPU program
        let vertex_shader = this.GetFile('shaders/color.vert');
        let fragment_shader = this.GetFile('shaders/color.frag');

        Promise.all([vertex_shader, fragment_shader])
        .then((shaders) => this.LoadShaders(shaders))
        .catch((error) => this.GetFileError(error));
    }

    InitializeGl() {
        // set drawing area to be the entire framebuffer
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        // set the background color to a light gray
        this.gl.clearColor(0.8, 0.8, 0.8, 1.0);
        // enable z-buffer for visible surface determination
        this.gl.enable(this.gl.DEPTH_TEST);

        // create model of a triangle with one vertex red, one green, and one blue
        this.triangle_vao = this.CreateTriangleVao();

        // initialize projection matrix to tranform vertices in
        // range [0, width] and [0, height] to [-1, 1] and [-1, 1]
        let proj_scale = new Matrix(4, 4);
        let proj_trans = new Matrix(4, 4);
        Mat4x4Scale(proj_scale, 2 / this.canvas.width, 2 / this.canvas.height, 1);
        Mat4x4Translate(proj_trans, -1, -1, 0);
        this.projection_matrix = Matrix.multiply([proj_trans, proj_scale]);

        let model_scale = new Matrix(4, 4);
        let model_trans = new Matrix(4, 4);
        Mat4x4Scale(model_scale, this.canvas.width / 2, this.canvas.width / 2, 1);
        Mat4x4Translate(model_trans, this.canvas.width / 2, this.canvas.height / 2, 0);
        this.model_matrix = Matrix.multiply([model_trans, model_scale]);

        // note: both view and model matrices will remain the identity matrix

        // draw scene
        this.start_time = performance.now();
        this.Render(this.start_time);

        // animate scene (start draw loop)
        //this.start_time = performance.now();
        //window.requestAnimationFrame((timestamp) => this.Render(timestamp));
    }

    Render(timestamp) {
        // time since start of app
        let t = (timestamp - this.start_time) / 1000.0;

        // delete previous frame (reset both framebuffer and z-buffer)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // set which GPU program (shaders) to use for rendering
        this.gl.useProgram(this.program);

        // upload our matrices to the GPU - specifying which variables in 
        // our shaders to assign the values to
        this.gl.uniformMatrix4fv(this.uniforms.projection_matrix, false, this.projection_matrix.rawArray());
        this.gl.uniformMatrix4fv(this.uniforms.view_matrix, false, this.view_matrix.rawArray());
        this.gl.uniformMatrix4fv(this.uniforms.model_matrix, false, this.model_matrix.rawArray());

        // select our triangle Vertex Array Object for drawing
        this.gl.bindVertexArray(this.triangle_vao);
        // draw the selected Vertex Array Object (using triangles)
        this.gl.drawElements(this.gl.TRIANGLES, 3, this.gl.UNSIGNED_SHORT, 0);
        // unselect our triangle Vertex Array Object
        this.gl.bindVertexArray(null);

        // continue animation (trigger next draw)
        //window.requestAnimationFrame((timestamp) => this.Render(timestamp));
    }

    CreateTriangleVao() {
        // create a new Vertex Array Object
        let vertex_array = this.gl.createVertexArray();
        // set newly created Vertex Array Object as the active one we are modifying
        this.gl.bindVertexArray(vertex_array);


        // create buffer to store vertex positions (3D points)
        let vertex_position_buffer = this.gl.createBuffer();
        // set newly created buffer as the active one we are modifying
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_position_buffer);
        // create array of 3D vertex values (each set of 3 values specifies a vertex: x, y, z)
        let vertices = [
            -0.500, -0.433, 0.00000, //200.0, 127.0, 0.0, //-0.500, -0.433, 0.00000,
             0.500, -0.433, 0.00000,//600.0, 127.0, 0.0, // 0.500, -0.433, 0.00000,
             0.000,  0.433, 0.00000 //400.0, 473.0, 0.0  // 0.000,  0.433, 0.00000
        ];
        // store array of vertex positions in the vertex_position_buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        // enable vertex_position_attrib in our GPU program
        this.gl.enableVertexAttribArray(this.vertex_position_attrib);
        // attach vertex_position_buffer to the vertex_position_attrib
        // (as 3-component floating point values)
        this.gl.vertexAttribPointer(this.vertex_position_attrib, 3, this.gl.FLOAT, false, 0, 0);


        // create buffer to store vertex colors (RGBA)
        let vertex_color_buffer = this.gl.createBuffer();
        // set newly created buffer as the active one we are modifying
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_color_buffer);
        // create array of RGBA color values (each set of 4 values specifies a color)
        let colors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        // store array of vertex colors in the vertex_color_buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
        // enable vertex_color_attrib in our GPU program
        this.gl.enableVertexAttribArray(this.vertex_color_attrib);
        // attach vertex_color_buffer to the vertex_color_attrib
        // (as 4-component floating point values)
        this.gl.vertexAttribPointer(this.vertex_color_attrib, 4, this.gl.FLOAT, false, 0, 0);


        // create buffer to store faces of the triangle
        let vertex_index_buffer = this.gl.createBuffer();
        // set newly created buffer as the active one we are modifying
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, vertex_index_buffer);
         // create array of vertex indices (each set of 3 represents a triangle)
        let indices = [
             0,  1,  2
        ];
        // store array of vertex indices in the vertex_index_buffer
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);


        // no longer modifying our Vertex Array Object, so deselect
        this.gl.bindVertexArray(null);


        // return created Vertex Array Object
        return vertex_array;
    }

    GetFile(url) {
        // download file with specified URL
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState === 4 && req.status === 200) {
                    resolve(req.response);
                }
                else if (req.readyState === 4) {
                    reject({url: req.responseURL, status: req.status});
                }
            };
            req.open("GET", url, true);
            req.send();
        });
    }

    GetFileError(error) {
        console.log("Error:", error);
    }

    LoadShaders(shaders) {
        // compile vetex shader
        let vertex_shader = this.CompileShader(shaders[0], this.gl.VERTEX_SHADER);
        // compile fragment shader
        let fragment_shader = this.CompileShader(shaders[1], this.gl.FRAGMENT_SHADER);

        // create GPU program from the compiled vertex and fragment shaders
        this.program = this.CreateShaderProgram(vertex_shader, fragment_shader);

        // specify input and output attributes for the GPU program
        this.gl.bindAttribLocation(this.program, this.vertex_position_attrib, "vertex_position");
        this.gl.bindAttribLocation(this.program, this.vertex_color_attrib, "vertex_color");
        this.gl.bindAttribLocation(this.program, 0, "FragColor");

        // link compiled GPU program
        this.LinkShaderProgram(this.program);

        // get handles to uniform variables defined in the shaders
        let num_uniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
        let i;
        for (i = 0; i < num_uniforms; i++) {
            let info = this.gl.getActiveUniform(this.program, i);
            this.uniforms[info.name] = this.gl.getUniformLocation(this.program, info.name);
        }

        // initialize GL application once shaders are loaded
        this.InitializeGl();
    }

    CompileShader(source, type) {
        // create a shader object
        let shader = this.gl.createShader(type);

        // send the source to the shader object
        this.gl.shaderSource(shader, source);

        // compile the shader program
        this.gl.compileShader(shader);

        // check to see if it compiled successfully
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shader: " + this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    CreateShaderProgram(vertex_shader, fragment_shader) {
        // create a GPU program
        let program = this.gl.createProgram();
        
        // attach the vertex and fragment shaders to that program
        this.gl.attachShader(program, vertex_shader);
        this.gl.attachShader(program, fragment_shader);

        // return the program
        return program;
    }

    LinkShaderProgram(program) {
        // link GPU program
        this.gl.linkProgram(program);

        // check to see if it linked successfully
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            alert("An error occurred linking the shader program.");
        }
    }
}
*/
