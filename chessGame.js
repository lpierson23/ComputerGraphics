"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var rotate = false;
var rotateSpeed = 100.0;
var angles = (Math.PI / 180) * rotateSpeed;
var c = Math.cos( angles );
var s = Math.sin( angles );
var rxyz = mat4( 1.0,  0.0,  0.0, 0.0,
    0.0,  c,    -s,  0.0,
    0.0,  s,    c,   0.0,
    0.0,  0.0,  0.0, 1.0 );

var pm = mat4(1.0);

var points = [];
var boardPoints = [];
var pawnPoints = [];
var colors = [];

var ctMatrix;
var u_ctMatrixLoc;

var a_vColorLoc;
var a_vPositionLoc;
var cBuffer, vBuffer;

// for trackball
var m_inc;
var m_curquat;
var m_mousex = 1;
var m_mousey = 1;
var trackballMove = false;

var whitePieces = [
    {name: "king",
    location: [1, 4],
    inPlay: true},
    {name: "queen",
    location: [1, 5],
    inPlay: true},
    {name: "bishop1",
    location: [1, 6],
    inPlay: true},
    {name: "bishop2",
    location: [1, 3],
    inPlay: true},
    {name: "knight1",
    location: [1, 7],
    inPlay: true},
    {name: "knight2",
    location: [1, 2],
    inPlay: true},
    {name: "rook1",
    location: [1, 8],
    inPlay: true},
    {name: "rook2",
    location: [1, 1],
    inPlay: true},
    {name: "pawn1",
    location: [2, 1],
    inPlay: true},
    {name: "pawn2",
    location: [2, 2],
    inPlay: true},
    {name: "pawn3",
    location: [2, 3],
    inPlay: true},
    {name: "pawn4",
    location: [2, 4],
    inPlay: true},
    {name: "pawn5",
    location: [2, 5],
    inPlay: true},
    {name: "pawn6",
    location: [2, 6],
    inPlay: true},
    {name: "pawn7",
    location: [2, 7],
    inPlay: true},
    {name: "pawn8",
    location: [2, 8],
    inPlay: true},
];

var blackPieces = [
    {name: "king",
    location: [8, 4],
    inPlay: true},
    {name: "queen",
    location: [8, 5],
    inPlay: true},
    {name: "bishop1",
    location: [8, 6],
    inPlay: true},
    {name: "bishop2",
    location: [8, 3],
    inPlay: true},
    {name: "knight1",
    location: [8, 7],
    inPlay: true},
    {name: "knight2",
    location: [8, 2],
    inPlay: true},
    {name: "rook1",
    location: [8, 8],
    inPlay: true},
    {name: "rook2",
    location: [8, 1],
    inPlay: true},
    {name: "pawn1",
    location: [7, 1],
    inPlay: true},
    {name: "pawn2",
    location: [7, 2],
    inPlay: true},
    {name: "pawn3",
    location: [7, 3],
    inPlay: true},
    {name: "pawn4",
    location: [7, 4],
    inPlay: true},
    {name: "pawn5",
    location: [7, 5],
    inPlay: true},
    {name: "pawn6",
    location: [7, 6],
    inPlay: true},
    {name: "pawn7",
    location: [7, 7],
    inPlay: true},
    {name: "pawn8",
    location: [7, 8],
    inPlay: true},
];

var boardVertices = [
                vec4( -0.8, -0.8,  0.05, 1.0 ),
                vec4( -0.8,  0.8,  0.05, 1.0 ),
                vec4(  0.8,  0.8,  0.05, 1.0 ),
                vec4(  0.8, -0.8,  0.05, 1.0 ),
                vec4( -0.8, -0.8, -0.05, 1.0 ),
                vec4( -0.8,  0.8, -0.05, 1.0 ),
                vec4(  0.8,  0.8, -0.05, 1.0 ),
                vec4(  0.8, -0.8, -0.05, 1.0 )
                ];

var vertexColors = [
                    [ 0.0, 0.0, 0.0, 1.0 ],  // black
                    [ 1.0, 0.0, 0.0, 1.0 ],  // red
                    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
                    [ 0.0, 1.0, 0.0, 1.0 ],  // green
                    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
                    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
                    [ 1.0, 1.0, 1.0, 1.0 ],  // white
                    [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
                    ];

// for trackball
function mouseMotion( x,  y)
{
        var lastquat;
        if (m_mousex != x || m_mousey != y)
        {
            lastquat = trackball(
                  (2.0*m_mousex - canvas.width) / canvas.width,
                  (canvas.height - 2.0*m_mousey) / canvas.height,
                  (2.0*x - canvas.width) / canvas.width,
                  (canvas.height - 2.0*y) / canvas.height);
            m_curquat = add_quats(lastquat, m_curquat);
            m_mousex = x;
            m_mousey = y;
        }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    // for trackball
    m_curquat = trackball(0, 0, 0, 0);

    createBoard();
    drawPieces();
 
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    a_vColorLoc = gl.getAttribLocation( program, "a_vColor" );
    gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( a_vColorLoc );

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    a_vPositionLoc = gl.getAttribLocation( program, "a_vPosition" );
    gl.vertexAttribPointer( a_vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( a_vPositionLoc );

    u_ctMatrixLoc = gl.getUniformLocation(program, "u_ctMatrix");

    // for trackball
    canvas.addEventListener("mousedown", function(event){
        m_mousex = event.clientX - event.target.getBoundingClientRect().left;
        m_mousey = event.clientY - event.target.getBoundingClientRect().top;
        trackballMove = true;
    });

    // for trackball
    canvas.addEventListener("mouseup", function(event){
        trackballMove = false;
    });

    // for trackball
    canvas.addEventListener("mousemove", function(event){
      if (trackballMove) {
        var x = event.clientX - event.target.getBoundingClientRect().left;
        var y = event.clientY - event.target.getBoundingClientRect().top;
        mouseMotion(x, y);
      }
    } );

    document.getElementById("rotate").onclick = function(){
        rotate = true;
    };

    render();

}

function playBook() {
    //king

    //queen

    //bishop

    //knight

    //rook

    //pawn
}

function createBoard()
{
    quad( 1, 0, 3, 2, boardVertices, vec4(0.5, 0.5, 0.5, 1.0) );
    quad( 2, 3, 7, 6, boardVertices, vec4(0.5, 0.5, 0.5, 1.0) );
    quad( 3, 0, 4, 7, boardVertices, vec4(0.5, 0.5, 0.5, 1.0) );
    quad( 6, 5, 1, 2, boardVertices, vec4(0.5, 0.5, 0.5, 1.0) );
    quad( 4, 5, 6, 7, boardVertices, vec4(0.5, 0.5, 0.5, 1.0) );
    quad( 5, 4, 0, 1, boardVertices, vec4(0.5, 0.5, 0.5, 1.0) );

    //to do: add grid texture to one face of the board to make it 8x8

    //to do: add shading

}

function quad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push( color );
    }
}

function drawKing() {
    if (whitePieces[0]["inPlay"]){

    }

    if (blackPieces[0]["inPlay"]){

    }
}

function drawQueen() {
    if (whitePieces[1]["inPlay"]){

    }

    if (blackPieces[1]["inPlay"]){

    }
}

function drawBishop() {
    if (whitePieces[2]["inPlay"]){

    } 

    if (whitePieces[3]["inPlay"]){

    }

    if (blackPieces[2]["inPlay"]){

    }

    if (blackPieces[3]["inPlay"]){

    }
}

function drawKnight() {
    
    if (whitePieces[4]["inPlay"]){

    } 

    if (whitePieces[5]["inPlay"]){

    }

    if (blackPieces[4]["inPlay"]){

    }

    if (blackPieces[5]["inPlay"]){

    }

}

function drawRook() {
    if (whitePieces[6]["inPlay"]){

    } 

    if (whitePieces[7]["inPlay"]){

    }

    if (blackPieces[6]["inPlay"]){

    }

    if (blackPieces[7]["inPlay"]){

    }
}

function drawPawn() {
    
}

function drawPieces() {
    drawKing();
    drawQueen();
    drawBishop();
    drawKnight();
    drawRook();
    drawPawn();
}

// pause functions
const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};

const testSleep = async () => {
    for (let i = 0; i < 10; i++) {
        await sleep(1000);
        console.log(i);
    }

    console.log("The loop is finished :)");
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // for trackball
    m_inc = build_rotmatrix(m_curquat);

    //rotate board on click
    if (rotate) {
        pm = mult(rxyz, pm);
        ctMatrix = mult(ortho(-1, 1, -1, 1, -1, 1), pm);
        ctMatrix = mult(ctMatrix, m_inc);
        rotate = false;
    }
    // orthogonal projection matrix * trackball rotation matrix
    else {
        ctMatrix = mult(ortho(-1, 1, -1, 1, -1, 1), m_inc);
    }
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
    
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    requestAnimFrame( render );
}