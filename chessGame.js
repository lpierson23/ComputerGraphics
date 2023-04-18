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

// piece data (location is [y, x])
var whitePieces = [
    {name: "king",
    location: [0, 3],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "queen",
    location: [0, 4],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "bishop1",
    location: [0, 5],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "bishop2",
    location: [0, 2],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "knight1",
    location: [0, 6],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "knight2",
    location: [0, 1],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "rook1",
    location: [0, 7],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "rook2",
    location: [0, 0],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn1",
    location: [1, 0],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn2",
    location: [1, 1],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn3",
    location: [1, 2],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn4",
    location: [1, 3],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn5",
    location: [1, 4],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn6",
    location: [1, 5],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn7",
    location: [1, 6],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "pawn8",
    location: [1, 7],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
];

var blackPieces = [
    {name: "king",
    location: [7, 3],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "queen",
    location: [7, 4],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "bishop1",
    location: [7, 5],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "bishop2",
    location: [7, 2],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "knight1",
    location: [7, 6],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "knight2",
    location: [7, 1],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "rook1",
    location: [7, 7],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "rook2",
    location: [7, 0],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn1",
    location: [6, 0],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn2",
    location: [6, 1],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn3",
    location: [6, 2],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn4",
    location: [6, 3],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn5",
    location: [6, 4],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn6",
    location: [6, 5],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn7",
    location: [6, 6],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn8",
    location: [6, 7],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
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

function highlightMoves(xLoc, yLoc){
    // calculate vertices for a square where piece can move
    // should appear as a yellow square slightly raised from the board
    var vertices = [
        vec4( -0.8 + ((0.2) * xLoc) + 0.2 , -0.8 + ((0.2) * yLoc),  0.06, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.2,  -0.8 + ((0.2) * yLoc) + 0.20,  0.06, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc),  -0.8 + ((0.2) * yLoc) + 0.20,  0.06, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc), -0.8 + ((0.2) * yLoc),  0.06, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.2, -0.8 + ((0.2) * yLoc), 0.04, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.2,  -0.8 + ((0.2) * yLoc) + 0.20, 0.04, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc),  -0.8 + ((0.2) * yLoc) + 0.20, 0.04, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc), -0.8 + ((0.2) * yLoc), 0.04, 1.0 )
    ];

    return vertices;
}

function checkIfPiece(xLoc, yLoc, color) {
    // this function will check if there is a piece in the given space and that it is the opposite color
    for (var i = 0; i++; i < 16){
        if (blackPieces[i][location][1] == xLoc && blackPieces[i][location][0] == yLoc && blackPieces[i]["inPlay"] && blackPieces[i]["color"] != color){
            // there is a piece in that location that can be attacked (black piece in that spot and you are white)
            return 1;
        }
        else if (whitePieces[i][location][1] == xLoc && whitePieces[i][location][0] == yLoc && whitePieces[i]["inPlay"] && blackPieces[i]["color"] != color){
            // there is a piece in that location that can be attacked (white piece in that spot and you are black)
            return 1;
        } 
        else if (blackPieces[i][location][1] == xLoc && blackPieces[i][location][0] == yLoc && blackPieces[i]["inPlay"] && blackPieces[i]["color"] == color){
            // there is a piece in that location, but it is the same color as your team (black piece in that spot and you are black)
            return 2;
        }
        else if (whitePieces[i][location][1] == xLoc && whitePieces[i][location][0] == yLoc && whitePieces[i]["inPlay"] && blackPieces[i]["color"] == color){
            // there is a piece in that location, but it is the same color as your team (white piece in that spot and you are white)
            return 2;
        }
        else {
            // there is no piece there
            return 0;
        }
    }
}

function playBook(piece) {
    // this function will calculate what spaces are avilable for the piece to move to
    var xLoc = piece[location][1];
    var yLoc = piece[location][0];
    var pieceColor = piece[color]
    var white = vec4(1.0, 1.0, 1.0, 1.0)
    var black = vec4(0.0, 0.0, 0.0, 1.0)
    
    //king
    if (piece["name"] == "king" && piece["inPlay"]){

    }

    //queen
    if (piece["name"] == "queen" && piece["inPlay"]){

    }

    //bishop
    if (piece["name"] == "bishop" && piece["inPlay"]){

    }

    //knight
    if (piece["name"] == "knight" && piece["inPlay"]){
        if (pieceColor == white){
            // suggest if there is no piece in the spot or a piece of the other color on left
            if(checkIfPiece(xLoc - 1, yLoc + 2) != 2){
                //highlight ending square
                var moveKnightVertices = highlightMoves(xLoc - 1, yLoc + 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );

                //lightly highlight path squares
                var moveKnightVertices = highlightMoves(xLoc, yLoc + 1);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );

                var moveKnightVertices = highlightMoves(xLoc, yLoc + 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
            }

            // suggest if there is no piece in the spot or a piece of the other color on right
            if(checkIfPiece(xLoc + 1, yLoc + 2) != 2){
                //highlight ending square
                var moveKnightVertices = highlightMoves(xLoc + 1, yLoc + 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );

                //lightly highlight path squares
                var moveKnightVertices = highlightMoves(xLoc, yLoc + 1);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );

                var moveKnightVertices = highlightMoves(xLoc, yLoc + 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
            }
        }

        if (pieceColor == black){
            // suggest if there is no piece in the spot or a piece of the other color on left
            if(checkIfPiece(xLoc - 1, yLoc - 2) != 2){
                //highlight ending square
                var moveKnightVertices = highlightMoves(xLoc - 1, yLoc - 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );

                //lightly highlight path squares
                var moveKnightVertices = highlightMoves(xLoc, yLoc - 1);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );

                var moveKnightVertices = highlightMoves(xLoc, yLoc - 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
            }

            // suggest if there is no piece in the spot or a piece of the other color on right
            if(checkIfPiece(xLoc + 1, yLoc - 2) != 2){
                //highlight ending square
                var moveKnightVertices = highlightMoves(xLoc + 1, yLoc - 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(1.0, 1.0, 0.0, 1.0) );

                //lightly highlight path squares
                var moveKnightVertices = highlightMoves(xLoc, yLoc - 1);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );

                var moveKnightVertices = highlightMoves(xLoc, yLoc - 2);
                quad( 1, 0, 3, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 2, 3, 7, 6, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 3, 0, 4, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 6, 5, 1, 2, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 4, 5, 6, 7, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
                quad( 5, 4, 0, 1, moveKnightVertices, vec4(0.5, 0.5, 0.0, 1.0) );
            }
        }
    }

    //rook
    if (piece["name"] == "rook" && piece["inPlay"]){

    }

    //pawn
    if (piece["name"] == "pawn" && piece["inPlay"]){
        if(pieceColor == white){
            //check if pawn has been moved already and if there is no piece two spaces ahead
            if (yLoc == 1 && checkIfPiece(xLoc, yLoc + 2, white) == 0){
                // highlight move two forward for white piece
                var movePawnVertices = highlightMoves(xLoc, yLoc + 2);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }

            // if there is a piece diagonally to left and it is the opposite color
            if (checkIfPiece(xLoc - 1, yLoc + 1, white) == 1){
                var movePawnVertices = highlightMoves(xLoc - 1, yLoc + 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }

            // if there is a piece diagonally to right and it is the opposite color
            if (checkIfPiece(xLoc + 1, yLoc + 1, white) == 1){
                var movePawnVertices = highlightMoves(xLoc + 1, yLoc + 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }

            // if there are no piece one space ahead, move there
            if (checkIfPiece(xLoc, yLoc + 1, white) == 0){
                var movePawnVertices = highlightMoves(xLoc, yLoc + 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }
        }

        if(pieceColor == black){
            //check if pawn has been moved already and if there is no piece two spaces ahead
            if (yLoc == 6 && checkIfPiece(xLoc, yLoc - 2, black) == 0){
                // highlight move two forward for black piece
                var movePawnVertices = highlightMoves(xLoc, yLoc - 2);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }

            // if there is a piece diagonally to left and it is the opposite color
            if (checkIfPiece(xLoc - 1, yLoc - 1, black) == 1){
                var movePawnVertices = highlightMoves(xLoc - 1, yLoc - 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }

            // if there is a piece diagonally to right and it is the opposite color
            if (checkIfPiece(xLoc + 1, yLoc - 1, black) == 1){
                var movePawnVertices = highlightMoves(xLoc + 1, yLoc - 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }

            // if there are no piece one space ahead, move there
            if (checkIfPiece(xLoc, yLoc - 1, black) == 0){
                var movePawnVertices = highlightMoves(xLoc, yLoc - 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }
        }      
    }
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

function calculateKnightVertices(xLoc, yLoc) {
    var vertices = [
        //base square
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1.0 ),

        // small rectangle on top
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05,  0.25, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15,  0.25, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.10,  -0.8 + ((0.2) * yLoc) + 0.15,  0.25, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.10, -0.8 + ((0.2) * yLoc) + 0.05,  0.25, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05, 0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15, 0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.10,  -0.8 + ((0.2) * yLoc) + 0.15, 0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.10, -0.8 + ((0.2) * yLoc) + 0.05, 0.15, 1.0 )
    ];

    return vertices;
}

function drawKnight() {
    var knightXLoc = 0;
    var knightYLoc = 0;
    var knightVertices;

    if (whitePieces[4]["inPlay"]){
        knightXLoc = whitePieces[4]["location"][1];
        knightYLoc = whitePieces[4]["location"][0];
        knightVertices = calculateKnightVertices(knightXLoc, knightYLoc);
            
        quad( 1, 0, 3, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 2, 3, 7, 6, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 3, 0, 4, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 6, 5, 1, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 4, 5, 6, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 5, 4, 0, 1, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );

        quad( 9, 8, 11, 10, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 10, 11, 15, 14, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 11, 8, 12, 15, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 14, 13, 9, 10, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 12, 13, 14, 15, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 13, 12, 8, 9, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    } 

    if (whitePieces[5]["inPlay"]){
        knightXLoc = whitePieces[5]["location"][1];
        knightYLoc = whitePieces[5]["location"][0];
        knightVertices = calculateKnightVertices(knightXLoc, knightYLoc);
            
        quad( 1, 0, 3, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 2, 3, 7, 6, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 3, 0, 4, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 6, 5, 1, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 4, 5, 6, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 5, 4, 0, 1, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );

        quad( 9, 8, 11, 10, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 10, 11, 15, 14, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 11, 8, 12, 15, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 14, 13, 9, 10, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 12, 13, 14, 15, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 13, 12, 8, 9, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    }

    if (blackPieces[4]["inPlay"]){
        knightXLoc = blackPieces[4]["location"][1];
        knightYLoc = blackPieces[4]["location"][0];
        knightVertices = calculateKnightVertices(knightXLoc, knightYLoc);
            
        quad( 1, 0, 3, 2, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 2, 3, 7, 6, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 3, 0, 4, 7, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 6, 5, 1, 2, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 4, 5, 6, 7, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 5, 4, 0, 1, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );

        quad( 9, 8, 11, 10, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 10, 11, 15, 14, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 11, 8, 12, 15, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 14, 13, 9, 10, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 12, 13, 14, 15, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 13, 12, 8, 9, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
    }

    if (blackPieces[5]["inPlay"]){
        knightXLoc = blackPieces[5]["location"][1];
        knightYLoc = blackPieces[5]["location"][0];
        knightVertices = calculateKnightVertices(knightXLoc, knightYLoc);
            
        quad( 1, 0, 3, 2, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 2, 3, 7, 6, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 3, 0, 4, 7, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 6, 5, 1, 2, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 4, 5, 6, 7, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 5, 4, 0, 1, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );

        quad( 9, 8, 11, 10, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 10, 11, 15, 14, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 11, 8, 12, 15, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 14, 13, 9, 10, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 12, 13, 14, 15, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 13, 12, 8, 9, knightVertices, vec4(0.0, 0.0, 0.0, 1.0) );
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

function calculatePawnVertices(xLoc, yLoc){
    var vertices = [
        vec4( -0.8 + 0.15 + (0.2*xLoc), -0.8 + ((0.2) * yLoc) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1.0 )
    ];

    return vertices;
}

function drawPawn() {
    var pawnXLoc = 0;
    var pawnYLoc = 0;
    var pawnVertices;

    for (var i = 8; i < 16; i++){
        if (whitePieces[i]["inPlay"]){
            pawnXLoc = whitePieces[i]["location"][1];
            console.log(pawnXLoc);
            pawnYLoc = whitePieces[i]["location"][0];
            console.log(pawnYLoc);

            pawnVertices = calculatePawnVertices(pawnXLoc, pawnYLoc);
            console.log(pawnVertices);

            quad( 1, 0, 3, 2, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 2, 3, 7, 6, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 3, 0, 4, 7, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 6, 5, 1, 2, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 4, 5, 6, 7, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 5, 4, 0, 1, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        }
        if (blackPieces[i]["inPlay"]){
            pawnXLoc = blackPieces[i]["location"][1];
            console.log(pawnXLoc);
            pawnYLoc = blackPieces[i]["location"][0];
            console.log(pawnYLoc);

            pawnVertices = calculatePawnVertices(pawnXLoc, pawnYLoc);

            quad( 1, 0, 3, 2, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 2, 3, 7, 6, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 3, 0, 4, 7, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 6, 5, 1, 2, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 4, 5, 6, 7, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 5, 4, 0, 1, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );

        }
    }
}

function drawPieces() {
    drawKing();
    drawQueen();
    drawBishop();
    drawKnight();
    drawRook();
    drawPawn();
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