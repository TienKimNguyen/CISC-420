class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        this.drawRectangle({x: 200,y: 200}, {x: 600, y: 400}, [255, 0, 0, 255], ctx );
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        this.drawCircle({x: 400, y: 300}, 200, [0, 255, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {
        this.drawBezierCurve({x: 150, y: 150}, {x: 200, y: 450}, {x: 600, y: 170}, {x: 650, y: 500}, [0, 0, 255, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        // Draw my name Kim

        let color = [204, 0, 102, 255];

        // Capitalized K:
        this.drawLine({x: 200, y: 400}, {x: 200, y: 200}, color, ctx);
        this.drawLine({x: 200, y: 300}, {x: 300, y: 400}, color, ctx);
        this.drawLine({x: 200, y: 300}, {x: 300, y: 200}, color, ctx);

        // Letter i:
        this.drawLine({x: 350, y: 300}, {x: 350, y: 200}, color, ctx);
        this.drawCircle({x: 350, y: 330}, 5, color, ctx);

        // Letter m:
        this.drawLine({x: 400, y: 200}, {x: 400, y: 300}, color, ctx);
        this.drawBezierCurve({x: 400, y: 260}, {x: 400, y: 315}, {x: 480, y: 315}, {x: 480, y: 260}, color, ctx);
        this.drawLine({x: 480, y: 200}, {x: 480, y: 260}, color, ctx);
        this.drawBezierCurve({x: 480, y: 260}, {x: 480, y: 315}, {x: 560, y: 315}, {x: 560, y: 260}, color, ctx);
        this.drawLine({x: 560, y: 200}, {x: 560, y: 260}, color, ctx);
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        let x_left = left_bottom.x;
        let x_right = right_top.x;
        let y_top = right_top.y;
        let y_bottom = left_bottom.y;

        this.drawLine({x: x_left,y: y_top}, {x: x_right, y: y_top}, color, ctx);
        this.drawLine({x: x_right, y: y_top}, {x: x_right, y: y_bottom}, color, ctx);
        this.drawLine({x: x_right, y: y_bottom}, {x: x_left, y: y_bottom}, color, ctx);
        this.drawLine({x: x_left, y: y_bottom}, {x: x_left, y: y_top}, color, ctx);
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        let points = [];
        let degree = 360 / this.num_curve_sections;

        for (let i = 0; i < this.num_curve_sections; i++){
            let x = center.x + Math.cos((Math.PI / 180 ) * i * degree) * radius;
            let y = center.y + Math.sin((Math.PI / 180 ) * i * degree) * radius;
            points.push({x: x, y: y});
        }

        for (let j = 1; j <= this.num_curve_sections; j++){
            let index = j % this.num_curve_sections;
            let index2 = (j - 1) % this.num_curve_sections;
            this.drawLine({x: points[index].x, y: points[index].y}, {x: points[index2].x, y: points[index2].y}, color, ctx);
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        let points = []; // array of points
        
        for (let i = 0; i <= this.num_curve_sections; i++){
            let t = i * (1 / this.num_curve_sections);
            let x = Math.pow((1 - t), 3) * pt0.x + 3 * t * Math.pow((1 - t), 2) * pt1.x + 3 * t * t * (1 - t) * pt2.x + t * t * t * pt3.x;
            let y = Math.pow((1 - t), 3) * pt0.y + 3 * t * Math.pow((1 - t), 2) * pt1.y + 3 * t * t * (1 - t) * pt2.y + t * t * t * pt3.y;
            points.push({x: x, y: y});
        }

        for (let j = 0; j < this.num_curve_sections; j++){
            this.drawLine({x: points[j].x, y: points[j].y}, {x: points[j + 1].x, y: points[j + 1].y}, color, ctx);
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
    }
};
