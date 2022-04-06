// function init(){
//     console.log("Initializing App");

//     let width = 600;
//     let height = 400;

//     // Get a handle to HTML canvas element
//     let mycanvas = document.getElementById("mycanvas");
    
//     // Set canvas width and height in pizel
//     mycanvas.width = width;
//     mycanvas.height = height;

//     // Get handle on 2D rendering context
//     let ctx = mycanvas.getContext("2d");

//     // Get a copy of the framebuffer
//     let framebuffer = ctx.getImageData(0, 0, width, height);
//     console.log(framebuffer);

    // // Operations to edit the framebuffer
    // drawLine(50, 100, 300, 250, [255, 0, 0, 255], framebuffer);
    // drawLine(50, 100, 250, 50, [0, 255, 0, 255], framebuffer);
    // drawLine(50, 100, 100, 350, [0, 0, 255, 255], framebuffer);
    // drawLine(400, 50, 250, 300, [0, 0, 0, 255], framebuffer);
    // drawLine(200, 100, 200, 300, [0, 120, 120, 255], framebuffer);

//     // Make altered framebuffer the one to display
//     ctx.putImageData(framebuffer, 0, 0);
// }

// function drawLine(x0, y0, x1, y1, color, framebuffer) {
//     if (x0 == x1) {
//         drawLineVertical(x0, y0, x1, y1, color, framebuffer);
//     } else if (Math.abs(x1 - x0) >= Math.abs(y1 - y0)){
//         drawlineLow(x0, y0, x1, y1, color, framebuffer);
//     } else {
//         drawlineHigh(x0, y0, x1, y1, color, framebuffer);
//     }
// }

// function drawLineVertical (x0, y0, x1, y1, color, framebuffer){
//     if (y1 < y0){   
//         let y_temp = y0;
//         y0 = y1;
//         y1 = y_temp;
//     }

//     for (let y = y0; y <= y1; y++){
//         // Fill in pixel (x,y)
//         let idx = pixelIndex(x0, y, framebuffer.width);
//         framebuffer.data[idx] = color[0]; // red
//         framebuffer.data[idx + 1] = color[1]; // green
//         framebuffer.data[idx + 2] = color[2]; // blue
//         framebuffer.data[idx + 3] = color[3]; // alpha or opacity
//     }
// }

// function drawlineLow (x0, y0, x1, y1, color, framebuffer) {
//     if (x1 < x0){
//         let x_temp = x0;
//         x0 = x1;
//         x1 = x_temp;
        
//         let y_temp = y0;
//         y0 = y1;
//         y1 = y_temp;
//     }

//     let A = y1 - y0;
//     let B = - (x1 - x0);
//     let D = 2*A + B;
//     let D0 = 2*A;
//     let D1 = 2*A + 2*B;

//     let y = y0;
    
//     /* This is for 0 ≤ slope ≤ 1

//     let idx = pixelIndex(x, y, framebuffer.width);
//     framebuffer.data[idx] = color[0]; // red
//     framebuffer.data[idx + 1] = color[1]; // green
//     framebuffer.data[idx + 2] = color[2]; // blue
//     framebuffer.data[idx + 3] = color[3]; // alpha or opacity

//     while (x <= x1){
//         if (D > 0){
//             D = D + D1;
//             y = y + 1;
//         } else {
//             D = D + D0;
//         }

//         let idx = pixelIndex(x, y, framebuffer.width);
//         framebuffer.data[idx] = color[0]; // red
//         framebuffer.data[idx + 1] = color[1]; // green
//         framebuffer.data[idx + 2] = color[2]; // blue
//         framebuffer.data[idx + 3] = color[3]; // alpha or opacity

//         x++;
//     }

//     */

//     let yi = 1;

//     if (A < 0) {
//         A = -1 * A;
//         yi = -1;
//     }

//     for (let x = x0; x <= x1; x++){
//         // Fill in pixel (x,y)
//         let idx = pixelIndex(x, y, framebuffer.width);
//         framebuffer.data[idx] = color[0]; // red
//         framebuffer.data[idx + 1] = color[1]; // green
//         framebuffer.data[idx + 2] = color[2]; // blue
//         framebuffer.data[idx + 3] = color[3]; // alpha or opacity

//         // Determine the next pixel (right or up-right/down-right)
//         if (D > 0){
//             D = D + D1;
//             y = y + yi;
//         } else {
//             D = D + D0;
//         }
//     }
// }

// function drawlineHigh (x0, y0, x1, y1, color, framebuffer){
//     if (y1 < y0){
//         let x_temp = x0;
//         x0 = x1;
//         x1 = x_temp;
        
//         let y_temp = y0;
//         y0 = y1;
//         y1 = y_temp;
//     }

//     let A = x1 - x0;
//     let B = - (y1 - y0);
//     let D = 2*A + B;
//     let D0 = 2*A;
//     let D1 = 2*A + 2*B;
//     let x = x0;
//     let xi = 1;
    
//     if (A < 0) {
//         A = -1 * A;
//         xi = -1;
//     }

//     for (let y = y0; y <= y1; y++){
//         // Fill in pixel (x,y)
//         let idx = pixelIndex(x, y, framebuffer.width);
//         framebuffer.data[idx] = color[0]; // red
//         framebuffer.data[idx + 1] = color[1]; // green
//         framebuffer.data[idx + 2] = color[2]; // blue
//         framebuffer.data[idx + 3] = color[3]; // alpha or opacity

//         // Determine the next pixel (up or up-right/up-left)
//         if (D > 0){
//             D = D + D1;
//             x = x + xi;
//         } else {
//             D = D + D0;
//         }
//     }
// }

// function pixelIndex(x, y, width){
//     return (width * y * 4) + (4 * x);
// }

function init() {
    console.log("Initializing App")

    let width = 600;
    let height = 400;

    //Get a handle to HTML canvas element
    let mycanvas = document.getElementById("mycanvas");

    //Set canvas width and height (in pixels)
    mycanvas.width = width;
    mycanvas.height = height;

    //Get handle 2D rendering context
    let ctx = mycanvas.getContext("2d");

    //Get a copy of the framebuffer
    let framebuffer = ctx.getImageData(0, 0, width, height)

    //Operations to edit the framebuffer    
    drawLine(50, 100, 300, 250, [255, 0, 0, 255], framebuffer);
    drawLine(50, 100, 250, 50, [0, 255, 0, 255], framebuffer);
    drawLine(50, 100, 100, 350, [0, 0, 255, 255], framebuffer);
    drawLine(400, 50, 250, 300, [0, 0, 0, 255], framebuffer);
    drawLine(200, 100, 200, 300, [0, 120, 120, 255], framebuffer);
    //Make altered framebuffer the one to display
    ctx.putImageData(framebuffer, 0, 0);
}

function drawLine(x0, y0, x1, y1, color, framebuffer) {
    if(x0 == x1) {
        drawLineVertical(x0, y0, x1, y1, color, framebuffer);
    }
    else if(Math.abs(x1 - x0) >= Math.abs(y1 - y0)) {
        drawLineLow(x0, y0, x1, y1, color, framebuffer);
    }
    else {
        drawLineHigh(x0, y0, x1, y1, color, framebuffer);
    }
}

function drawLineVertical(x0, y0, x1, y1, color, framebuffer) {
    if(y1 < y0) {
        let y_tmp = y0;
        y0 = y1;
        y1 = y_tmp;
    }

    for (let y = y0; y <= y1; y++) {
        // fill in pixel (x,y)
        let idx = pixelIndex(x0, y, framebuffer.width);
        framebuffer.data[idx] = color[0];
        framebuffer.data[idx + 1] = color[0 + 1];
        framebuffer.data[idx + 2] = color[0 + 2];
        framebuffer.data[idx + 3] = color[0 + 3];
    }   
}

function drawLineLow(x0, y0, x1, y1, color, framebuffer) {
    if(x1 < x0) {
        let x_tmp = x0;
        let y_tmp = y0;
        x0 = x1;
        y0 = y1;
        x1 = x_tmp;
        y1 = y_tmp;
    }

    let A = y1 - y0; // A = 250 - 100 = 150
    let B = x0 - x1; 
    let yi = 1;
    if (A < 0) {
        A = -1 * A;
        yi = -1;
    }
    let initial = (2 * A) + B; // initial = (2 * 150) - 250 => 300 - 250 = 50
    let d0 = 2 * A; // d0 = 300
    let d1 = (2 * A) + (2 * B) // d1 = 300 - 500 = - 200
    let x = x0 
    let y = y0
    let output = initial 

    while(x <= x1) {
        idx = pixelIndex(x, y, framebuffer.width);
        framebuffer.data[idx] = color[0]; //red
        framebuffer.data[idx + 1] = color[1]; //green
        framebuffer.data[idx + 2] = color[2]; //blue
        framebuffer.data[idx + 3] = color[3]; //alpha 

        if(output <= 0) {
            output = output + d0;
        } else {
            output = output + d1;
            y = y + yi;
        }
        x = x + 1;
    } 
    // Teacher's Loop Code:
    /* for (let x = x0; x <= x1; x++) {
        // fill in pixel (x,y)
        let idx = pixelIndex(x, y, framebuffer.width);
        framebuffer.data[idx] = color[0];
        framebuffer.data[idx + 1] = color[0 + 1];
        framebuffer.data[idx + 2] = color[0 + 2];
        framebuffer.data[idx + 3] = color[0 + 3];
        
        // determine next pixel (right, or right-up)
        if (d > 0) {
            d = d + 2 + a + 2 * b;
            y++;
        }
        else {
            d = d + 2 * a;
        }
        */
}  

function drawLineHigh(x0, y0, x1, y1, color, framebuffer) {
    if(y1 < y0) {
        let x_tmp = x0;
        let y_tmp = y0;
        x0 = x1;
        y0 = y1;
        x1 = x_tmp;
        y1 = y_tmp;
    }

    let a = x1 - x0;
    let b = y0 - y1;
    let xi = 1;
    let d = 2 * a + b;
    if (a < 0) {
        a = -1 * a;
        xi = -1;
    }
    let x = x0;
    for (let y = y0; y <= y1; y++) {
        // fill in pixel (x,y)
        let idx = pixelIndex(x, y, framebuffer.width);
        framebuffer.data[idx] = color[0];
        framebuffer.data[idx + 1] = color[0 + 1];
        framebuffer.data[idx + 2] = color[0 + 2];
        framebuffer.data[idx + 3] = color[0 + 3];
        
        // determine next pixel (up, or up-right/up-left)
        if (d > 0) {
            d = d + 2 * a + 2 * b;
            x = x + xi;
        }
        else {
            d = d + 2 * a;
        }
    }
}

function pixelIndex(x, y, width) {
    return (width * 4 * y) + (4 * x);
 }
