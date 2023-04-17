"use strict";

var canvas;
var gl;

var program;

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

window.onload = init;


function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var a_vColorLoc = gl.getAttribLocation( program, "a_vColor" );
    gl.vertexAttribPointer(a_vColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_vColorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    
    var a_vPositionLoc = gl.getAttribLocation( program, "a_vPosition" );
    gl.vertexAttribPointer( a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_vPositionLoc);

    u_modelViewMatrixLoc = gl.getUniformLocation( program, "u_modelViewMatrix" );
    u_projectionMatrixLoc = gl.getUniformLocation( program, "u_projectionMatrix" );

    render();
}

function drawKing() {

}

function drawQueen() {

}

function drawBishop() {

}

function drawKnight() {

}

function drawRook() {

}

function drawPawn() {

}

function drawPieces() {

}

function drawBoard() {

}

function setUpBoard() {

}

function playBook() {
    //king

    //queen

    //bishop

    //knight

    //rook

    //pawn
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT);

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( u_modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( u_projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
