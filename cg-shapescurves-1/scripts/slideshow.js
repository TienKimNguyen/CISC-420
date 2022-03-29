var app;

function init() {
    app = new Vue({
        el: '#content',
        data: {
            view: {
                id: 'view',
                width: 800,
                height: 600
            },
            renderer: {},
            slide_description: [
                "Rectangle",
                "Circle",
                "Bezier Curve",
                "Name"
            ],
            slide_idx: 0,
            curve_sections: 12,
            show_points: false
        },
        watch: {
            curve_sections: function(new_value) {
                this.renderer.setNumCurveSections(parseInt(new_value, 10));
            },
            show_points: function(new_value) {
                this.renderer.showPoints(new_value);
            }
        }
    })

    app.renderer = new Renderer(app.view, app.curve_sections, app.show_points);
    app.renderer.drawSlide(app.slide_idx);
}

function prevSlide() {
    if (app.slide_idx > 0) {
        app.slide_idx -= 1;
        app.renderer.drawSlide(app.slide_idx);
    }
}

function nextSlide() {
    if (app.slide_idx < app.slide_description.length - 1) {
        app.slide_idx += 1;
        app.renderer.drawSlide(app.slide_idx);
    }
}
