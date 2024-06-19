var inc = 0.1;
var scl = 10;
var cols, rows;

var zoff = 0;

var particles = [];

var flowfield;

function setup() {
    createCanvas(600, 400);
    cols = floor(width / scl);
    rows = floor(height / scl);

    flowfield = new Array(cols * rows);

    for (var i = 0; i < 50; i++) { // Réduction du nombre de particules
        particles[i] = new Particle();
    }
    background(51);
}

function draw() {
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            var index = x + y * cols;
            var angle = map(noise(xoff, yoff, zoff), 0, 1, 0, TWO_PI);
            var v = p5.Vector.fromAngle(angle);
            v.setMag(0.5);
            flowfield[index] = v;
            xoff += inc;
        }
        yoff += inc;
        zoff += 0.0003;
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }
}