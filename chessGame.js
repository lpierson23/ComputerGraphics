"use strict";

var canvas;
var gl;

var CHECK_NAME ="";
var turn = "white"; // start with white's turn
var previousTurn = "black";

var u_rotateBoard;
var u_projMatrixLoc;

var NumVertices  = 36;

var rotate = false;
var truth;
var theta = 0.0;
var u_thetaLoc;

var gameStatus = '';

var points = [];
var colors = [];
var texCoordsArray = [];

var framePoints = [];
var boardPoints = [];
var whitePoints = [];
var blackPoints = [];
var guidePoints = [];


var colors = [];
var frameColors = [];
var boardColors = [];
var whiteColors = [];
var blackColors = [];
var guideColors = [];
var canvasColor = vec4( 53/255, 105/255, 74/255, 1.0 );

var texFrameCoordsArray = [];
var texBoardCoordsArray = [];
var texWhiteCoordsArray = [];
var texBlackCoordsArray = [];
var texGuideCoordsArray = [];

var nBoardCoordsArray = [];
var	nWhiteCoordsArray = [];
var	nBlackCoordsArray = [];
var	nGuideCoordsArray = [];
var	nFrameCoordsArray = [];

var boardTexture;
var whiteTexture;
var guideTexture;
var blackTexture;
var frameTexture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var a_vPositionLoc;
var ctMatrix;
var u_ctMatrixLoc;

var a_vColorLoc;
var vBoardBuffer, vWhiteBuffer, vBlackBuffer, vGuideBuffer, vFrameBuffer;
var tBoardBuffer, tWhiteBuffer, tBlackBuffer, tGuideBuffer, tFrameBuffer;
var cBoardBuffer, cWhiteBuffer, cBlackBuffer, cGuideBuffer, cFrameBuffer;
var a_vTextureCoordLoc;
var u_textureSamplerLoc

//-----global array to store sphere vertex normals
var nBoardBuffer, nWhiteBuffer, nBlackBuffer, nGuideBuffer, nFrameBuffer;

var a_vNormalLoc;
//--------point light (assume in object space)
var r_val = 1.0; 
var g_val = 1.0; 
var b_val = 1.0;
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );


var lightAmbient = vec4(0.1, 0.1, 0.0, 0.0 );
var lightDiffuse;
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;


var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

// for trackball
var m_inc;
var m_curquat;
var m_mousex = 1;
var m_mousey = 1;
var trackballMove = false;
var position = trackball(0.0, 0.0, 0.0, 0.0);

//log
var wCount = 0;
var bCount = 0;
var wLog = '';
var bLog = ''; 
var whitePieceLoc = '';
var blackPieceLoc = '';

//current location
var currWhitePieces = [
    {name: "king",
    location: [1, 4]},
    {name: "queen",
    location: [1, 4]},
    {name: "bishop1",
    location: [1, 3]},
    {name: "bishop2",
    location: [1, 6]},
    {name: "knight1",
    location: [1, 2]},
    {name: "knight2",
    location: [1, 7]},
    {name: "rook1",
    location: [1, 1]},
    {name: "rook2",
    location: [1, 8]},
    {name: "pawn1",
    location: [2, 1]},
    {name: "pawn2",
    location: [2, 2]},
    {name: "pawn3",
    location: [2, 3]},
    {name: "pawn4",
    location: [2, 4]},
    {name: "pawn5",
    location: [2, 5]},
    {name: "pawn6",
    location: [2, 6]},
    {name: "pawn7",
    location: [2, 7]},
    {name: "pawn8",
    location: [2, 8]},
];

var currBlackPieces = [
    {name: "king",
    location: [8, 5]},
    {name: "queen",
    location: [8, 4]},
    {name: "bishop1",
    location: [8, 6]},
    {name: "bishop2",
    location: [8, 3]},
    {name: "knight1",
    location: [8, 7]},
    {name: "knight2",
    location: [8, 2]},
    {name: "rook1",
    location: [8, 8]},
    {name: "rook2",
    location: [8, 1]},
    {name: "pawn1",
    location: [7, 8]},
    {name: "pawn2",
    location: [7, 7]},
    {name: "pawn3",
    location: [7, 6]},
    {name: "pawn4",
    location: [7, 5]},
    {name: "pawn5",
    location: [7, 4]},
    {name: "pawn6",
    location: [7, 3]},
    {name: "pawn7",
    location: [7, 2]},
    {name: "pawn8",
    location: [7, 1]},
];

// piece data (location is [row, column])
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
    location: [0, 2],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "bishop2",
    location: [0, 5],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "knight1",
    location: [0, 1],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "knight2",
    location: [0, 6],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "rook1",
    location: [0, 0],
    inPlay: true,
    color: vec4(1.0, 1.0, 1.0, 1.0)},
    {name: "rook2",
    location: [0, 7],
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
    location: [7, 4],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "queen",
    location: [7, 3],
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
    location: [6, 7],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn2",
    location: [6, 6],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn3",
    location: [6, 5],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn4",
    location: [6, 4],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn5",
    location: [6, 3],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn6",
    location: [6, 2],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn7",
    location: [6, 1],
    inPlay: true,
    color: vec4(0.0, 0.0, 0.0, 1.0)},
    {name: "pawn8",
    location: [6, 0],
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

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( canvasColor[0], canvasColor[1], canvasColor[2], canvasColor[3] );

    gl.enable(gl.DEPTH_TEST);

    // for trackball
    m_curquat = position;
    NumVertices = 0;
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    createBoard();
    createAll();

    lightDiffuse = vec4( r_val, g_val, b_val, 1.0 );

    document.getElementById("bLog").value = bLog;
    document.getElementById("wLog").value = wLog;
    document.getElementById("currWLoc").value = whitePieceLoc;
    document.getElementById("currBLoc").value = blackPieceLoc;
   
    document.getElementById("sliderR").onchange = function(event) {
        r_val = event.target.value;
        lightDiffuse = vec4( r_val, g_val, b_val, 1.0 );
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv( gl.getUniformLocation(program,
            "u_diffuseProduct"),flatten(diffuseProduct) );
        render();
    };
    document.getElementById("sliderG").onchange = function(event) {
        g_val = event.target.value;
        lightDiffuse = vec4( r_val, g_val, b_val, 1.0 );
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv( gl.getUniformLocation(program,
            "u_diffuseProduct"),flatten(diffuseProduct) );
        render();
    };
    document.getElementById("sliderB").onchange = function(event) {
        b_val = event.target.value;
        lightDiffuse = vec4( r_val, g_val, b_val, 1.0 );
        diffuseProduct = mult(lightDiffuse, materialDiffuse);
        gl.uniform4fv( gl.getUniformLocation(program,
            "u_diffuseProduct"),flatten(diffuseProduct) );
        render();
    };

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    // COLOR BUFFERS
    cBoardBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBoardBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(boardColors), gl.STATIC_DRAW );
    a_vColorLoc = gl.getAttribLocation( program, "a_vColor" );
    gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( a_vColorLoc );
    
    cWhiteBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cWhiteBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(whiteColors), gl.STATIC_DRAW );
    
    cBlackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBlackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(blackColors), gl.STATIC_DRAW );
    
    cGuideBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cGuideBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(guideColors), gl.STATIC_DRAW );

    cFrameBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cFrameBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(frameColors), gl.STATIC_DRAW );

    // VERTEX BUFFERS
    vBoardBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBoardBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(boardPoints), gl.STATIC_DRAW ); 
    a_vPositionLoc = gl.getAttribLocation( program, "a_vPosition" );
    gl.vertexAttribPointer( a_vPositionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( a_vPositionLoc );
    
    vWhiteBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vWhiteBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(whitePoints), gl.STATIC_DRAW );
    
    vBlackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBlackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(blackPoints), gl.STATIC_DRAW );
    
    vGuideBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vGuideBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(guidePoints), gl.STATIC_DRAW );
    
    vFrameBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vFrameBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(framePoints), gl.STATIC_DRAW );


    gl.uniform4fv( gl.getUniformLocation(program,
        "u_ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "u_diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "u_specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
        "u_lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
        "u_shininess"),materialShininess );

    u_ctMatrixLoc = gl.getUniformLocation(program, "u_ctMatrix");
    u_rotateBoard = gl.getUniformLocation(program, "u_rotateBoard");
    u_projMatrixLoc = gl.getUniformLocation( program, "u_projMatrix" ); 

    var projMatrix = ortho(-1.15, 1.15, -1.15, 1.15, -1.15, 1.15);
    gl.uniformMatrix4fv(u_projMatrixLoc, false, flatten(projMatrix) );

    a_vNormalLoc = gl.getAttribLocation(program, "a_vNormal");

    nBoardBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBoardBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nBoardCoordsArray), gl.STATIC_DRAW ); ///??
    
    nWhiteBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nWhiteBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nWhiteCoordsArray), gl.STATIC_DRAW ); 
    
    nBlackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBlackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nBlackCoordsArray), gl.STATIC_DRAW ); 
    
    nGuideBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nGuideBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nGuideCoordsArray), gl.STATIC_DRAW ); 
    
    nFrameBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nFrameBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(nFrameCoordsArray), gl.STATIC_DRAW ); 

    // send texture coordiantes data down to the GPU
    // TEXTURE BUFFERS
    tBoardBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBoardBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texBoardCoordsArray), gl.STATIC_DRAW );
    
    tWhiteBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tWhiteBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texWhiteCoordsArray), gl.STATIC_DRAW ); 
    
    tBlackBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBlackBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texBlackCoordsArray), gl.STATIC_DRAW ); 
    
    tGuideBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tGuideBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texGuideCoordsArray), gl.STATIC_DRAW ); 
    
    tFrameBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tFrameBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texFrameCoordsArray), gl.STATIC_DRAW ); 

    a_vTextureCoordLoc = gl.getAttribLocation( program, "a_vTextureCoord" );
    gl.vertexAttribPointer( a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );

    // activate the texture and specify texture sampler
    gl.activeTexture(gl.TEXTURE0);
    u_textureSamplerLoc = gl.getUniformLocation( program, "u_textureSampler" );
    gl.uniform1i(u_textureSamplerLoc, 0);
    

    // INITIALIZE TEXTURES
    boardTexture = gl.createTexture();
    boardTexture.image = new Image();
    boardTexture.image.onload = function() {
        configureTexture( boardTexture);
    }
    boardTexture.image.src = "marble_board.jpeg";

    
    whiteTexture = gl.createTexture();
        whiteTexture.image = new Image();
        whiteTexture.image.onload = function() {
        configureTexture( whiteTexture);
        }
        whiteTexture.image.src = "whiteMarble.png";

    blackTexture = gl.createTexture();
        blackTexture.image = new Image();
        blackTexture.image.onload = function() {
            configureTexture( blackTexture);
        }
        blackTexture.image.src = "blackMarble.png";

    guideTexture = gl.createTexture();
    guideTexture.image = new Image();
        guideTexture.image.onload = function() {
        configureTexture( guideTexture);
        }
        guideTexture.image.src = "yellow_square.jpg";
    
    frameTexture = gl.createTexture();
    frameTexture.image = new Image();
        frameTexture.image.onload = function() {
        configureTexture( frameTexture);
        }
        frameTexture.image.src = "wood_frame.jpeg";
    
    
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
        theta = theta + 3.14;
    };

    u_thetaLoc = gl.getUniformLocation(program, "u_theta");

    render( );

    document.getElementById("changeColor").onclick = function(){
        var backgroundColor = document.getElementById("backgroundColor").value;
        switch (backgroundColor) {
            case "red": 
                canvasColor = vec4(139/255, 0/255, 0/255, 1.0 );
                break;
            case "green": 
                canvasColor = vec4( 53/255, 105/255, 74/255, 1.0 );
                break;
            case "blue": 
                canvasColor = vec4( 72/255, 61/255,139/255, 1.0 );
                break;
            case "purple":
                canvasColor = vec4( 128/255, 0/255, 128/255, 1.0 );
                break;
            case "gold":
                canvasColor = vec4( 255/255, 215/255, 0/255, 1.0 );
                break;
            default: 
                canvasColor = vec4( 53/255, 105/255, 74/255, 1.0 );
                break;
        }
        init();
    }

    document.getElementById("submit").onclick = function(){
        boardPoints = [];
        whitePoints = [];
        blackPoints = [];
        guidePoints = [];
        framePoints = [];
        
        boardColors = [];
        whiteColors = [];
        blackColors = [];
        guideColors = [];
        frameColors = [];

        nBoardCoordsArray = [];
		nWhiteCoordsArray = [];
		nBlackCoordsArray = [];
		nGuideCoordsArray = [];
		nFrameCoordsArray = [];

        texBoardCoordsArray = [];
        texWhiteCoordsArray = [];
        texBlackCoordsArray = [];
        texGuideCoordsArray = [];
        texFrameCoordsArray = [];
        
        truth = movePiece( );
        position = m_curquat;
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        init();
        var result = checkWin(turn);
        if(result == "Black Wins!" || result == "White Wins!"){
            if (confirm(result + " Press Okay to Play again!")){
                location.reload();
            }
        } else if(result != "Resume Play"){
            gameStatus = result;
        } else {
            gameStatus = "";
        }
    }

    document.getElementById("moves").onclick = function(){
        var pName = document.getElementById("id_chess_piece").value;
        boardPoints = [];
        whitePoints = [];
        blackPoints = [];
        guidePoints = [];
        framePoints = [];
        
        boardColors = [];
        whiteColors = [];
        blackColors = [];
        guideColors = [];
        frameColors = [];

        nBoardCoordsArray = [];
		nWhiteCoordsArray = [];
		nBlackCoordsArray = [];
		nGuideCoordsArray = [];
		nFrameCoordsArray = [];

        texBoardCoordsArray = [];
        texWhiteCoordsArray = [];
        texBlackCoordsArray = [];
        texGuideCoordsArray = [];
        texFrameCoordsArray = [];
                
    	CHECK_NAME = pName;
		showGuide(pName);
        position = m_curquat;
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        init();
        if (turn == "white"){
            theta = 0;
        } else if (turn == "black"){
            theta = 3.14;
        }
        
        rotate = true;
    }
}

function restartGame(){

}

function drawTurn() {
    var string = turn + "'s turn!"
    if (gameStatus != ''){
        string = string + " - " + gameStatus;
    } 
    whosTurn.innerHTML = string;
}

function pieceTaken(currentLocation, color){
    if(color == "white"){
        if (checkIfPiece(currentLocation[1], currentLocation[0], vec4(1.0, 1.0, 1.0, 1.0)) == 1){
            for (var i = 0; i < 16; i++){
                if (blackPieces[i]["location"][0] == currentLocation[0] && blackPieces[i]["location"][1] == currentLocation[1]){
                    blackPieces[i]["inPlay"] = false;
                }
            }
        }
    }

    else if(color == "black"){
        if (checkIfPiece(currentLocation[1], currentLocation[0], vec4(0.0, 0.0, 0.0, 1.0)) == 1){
            for (var i = 0; i < 16; i++){
                if (whitePieces[i]["location"][0] == currentLocation[0] && whitePieces[i]["location"][1] == currentLocation[1]){
                    whitePieces[i]["inPlay"] = false;
                }
            }
        }
    }
}
					
function movePiece(){

	var pRow = Number(document.getElementById("id_row").value);
	var pCol = Number(document.getElementById("id_col").value);
	var pName = document.getElementById("id_chess_piece").value;

    var possibleMoves = [];
	var i;

		if (turn == "white"){
			for (var k=0; k<16; k++){
				if (whitePieces[k]["name"] == pName){			
					var possibleMoves = playBook(whitePieces[k]);
					var includes = false;
					
					for (var p=0; p<possibleMoves.length; p++){
						if (possibleMoves[p][0] == pRow){
							if(possibleMoves[p][1] == pCol){
								includes = true;
								break;
							}
						}
					}

					if (includes == true){
						for (var p=0; p<whitePieces.length; p++){
							if (whitePieces[p]["name"] == pName){
								var i = p;
								break;
							}
						}
                        var previousLocation = whitePieces[i]["location"];
						whitePieces[i]["location"] = [pRow, pCol];
                        currWhitePieces[i]["location"] = [pRow+1, pCol+1];

                        whitePieceLoc = '';
                        for (var j= 0; j< currWhitePieces.length; j++){
                            whitePieceLoc = whitePieceLoc + currWhitePieces[j]["name"] + ": (" + (currWhitePieces[j]["location"][0]) + ", " + (currWhitePieces[j]["location"][1]) + ") \n"
                        }
                        document.getElementById("currBLoc").value = whitePieceLoc; 
                        
                        pieceTaken(whitePieces[i]["location"], "white");
        
						turn = "black";
                        previousTurn = "white";
						CHECK_NAME = "";
                        wCount++;
                        wLog = wLog + pName + " moved from (" + (previousLocation[0] + 1) + ", " + (previousLocation[1] + 1) + ") to (" + (pRow + 1)  + ", " + (pCol+1) + ")\n"; 

                        document.getElementById("wLog").value = wLog;
                    
                        theta = 3.14;
                        rotate = true;
						return true;
					}
					
				}
			}
		}
		else{ // black's turn
			for (var k=0; k<16; k++){
				if (blackPieces[k]["name"] == pName){
					possibleMoves = playBook(blackPieces[k]);
					
					var includes = false;
					
					for (var p=0; p<possibleMoves.length; p++){
						if (possibleMoves[p][0] == pRow){
							if(possibleMoves[p][1] == pCol){
								includes = true;
								break;
							}
						}
					}
					
					if (includes == true){
						
						for (var p=0; p<blackPieces.length; p++){
							if (blackPieces[p]["name"] == pName){
								var i = p;
								break;
							}
						}

                        var previousLocation = blackPieces[i]["location"];
						blackPieces[i]["location"] = [pRow, pCol];
                        currBlackPieces[i]["location"] = [pRow+1, pCol+1];

                    
                        blackPieceLoc = '';
                        for (var j= 0; j< currBlackPieces.length; j++){
                            blackPieceLoc = blackPieceLoc + currBlackPieces[j]["name"] + ": (" + (currBlackPieces[j]["location"][0] + 1) + ", " + (currBlackPieces[j]["location"][1] + 1) + ") \n"
                        }
                        document.getElementById("currBLoc").value = blackPieceLoc; 

                        pieceTaken(blackPieces[i]["location"], "black");
                        
						turn = "white";
                        previousTurn = "black;"
                        bLog = bLog + pName + " moved from (" + (previousLocation[0] + 1) + ", " + (previousLocation[1] + 1) + ") to (" + (pRow+1)  + ", " + (pCol+1) + ")\n"; 
                        document.getElementById("bLog").value = bLog; 

                        theta = 0.0;
                        rotate = true;
						return true;
					}
				}	
			}
		}
		

        previousTurn = turn;
	return false;
}
				
				
function configureTexture( texture ) { 
    gl.bindTexture( gl.TEXTURE_2D, texture );
    
    //Flips the source data along its vertical axis when texImage2D or texSubImage2D are called when param is true. The initial value for param is false.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, texture.image );
		 
	     gl.generateMipmap( gl.TEXTURE_2D );
	 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}


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



function showGuide(pieceName){
    var spaceVertices = []
    var possibleMoves =[];
    if (turn == "white"){
        for (var k=0; k<16; k++){
            if (whitePieces[k]["name"] == pieceName){
                possibleMoves = playBook(whitePieces[k]);
                for (var p=0; p<possibleMoves.length; p++){
                    spaceVertices = highlightMoves(possibleMoves[p][0], possibleMoves[p][1]);
                    guideQuad( 1, 0, 3, 2, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 2, 3, 7, 6, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 3, 0, 4, 7, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 6, 5, 1, 2, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 4, 5, 6, 7, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 5, 4, 0, 1, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    NumVertices += 6;
                }
            }
        }
    } else if (turn == "black"){ // black's turn
        for (var k=0; k<16; k++){
            if (blackPieces[k]["name"] == pieceName){
                possibleMoves = playBook(blackPieces[k]);
                var count = 0;
                for (var p=0; p<possibleMoves.length; p++){
                    spaceVertices = highlightMoves(possibleMoves[p][0], possibleMoves[p][1]);
                    guideQuad( 1, 0, 3, 2, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 2, 3, 7, 6, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 3, 0, 4, 7, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 6, 5, 1, 2, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 4, 5, 6, 7, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    guideQuad( 5, 4, 0, 1, spaceVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                    NumVertices += 6;
                    count ++;
                }
            }
        }
    }
}

function highlightMoves(row, col){
    // calculate vertices for a square where piece can move
    // should appear as a yellow square slightly raised from the board
    var vertices = [
        vec4( -0.8 + ((0.2) * col) + 0.2 , -0.8 + ((0.2) * row),  0.06, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.2,  -0.8 + ((0.2) * row) + 0.20,  0.06, 1.0 ),
        vec4( - 0.8 + ((0.2) * col),  -0.8 + ((0.2) * row) + 0.20,  0.06, 1.0 ),
        vec4( - 0.8 + ((0.2) * col), -0.8 + ((0.2) * row),  0.06, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.2, -0.8 + ((0.2) * row), 0.04, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.2,  -0.8 + ((0.2) * row) + 0.20, 0.04, 1.0 ),
        vec4( - 0.8 + ((0.2) * col),  -0.8 + ((0.2) * row) + 0.20, 0.04, 1.0 ),
        vec4( - 0.8 + ((0.2) * col), -0.8 + ((0.2) * row), 0.04, 1.0 )
    ];

    return vertices;
}

function checkIfPiece(col, row, color) {
    // this function will check if there is a piece in the given space and that it is the opposite color
	var white = vec4(1.0, 1.0, 1.0, 1.0);
	var colorWhite = true;
	for (var h=0;h<4;h++){
		if (color[h] != white[h]){
			colorWhite = false;
		}
	}

    var result = 0;

    for (var i = 0; i < 16; i++){
		if (colorWhite == true){ // you are white
       		if (blackPieces[i]["location"][0] == row && blackPieces[i]["location"][1] == col && blackPieces[i]["inPlay"]){
           		 // there is a piece in that location that can be attacked (black piece in that spot and you are white)
            	return 1;
        	}
        	else if (whitePieces[i]["location"][0] == row && whitePieces[i]["location"][1] == col && whitePieces[i]["inPlay"]){
           	 	// there is a piece in that location, but it is the same color as your team (white piece in that spot and you are white)
            	result = 2;
        	}
		}
		else{ // you are black
       	 	if (whitePieces[i]["location"][0] == row && whitePieces[i]["location"][1] == col && whitePieces[i]["inPlay"]){
            	// there is a piece in that location that can be attacked (white piece in that spot and you are black)
           	 	return 1;
       	 	} 
       	 	else if (blackPieces[i]["location"][0] == row && blackPieces[i]["location"][1] == col && blackPieces[i]["inPlay"]){
           	 	// there is a piece in that location, but it is the same color as your team (black piece in that spot and you are black)
           	 	result = 2;
      	 	}
		}
    }
	return result;
	
}

function checkWin(turn){
    var kingLoc;
    var possibleMoves = [];
    var checkSpots = [];
    var checkNow = [];
    var kingMoves = [];

    if (turn == "white"){
        kingLoc = whitePieces[0]["location"];
        kingMoves = playBook(whitePieces[0]);

        for (var i = 0; i<blackPieces.length; i++){
            if (blackPieces[i]["inPlay"] == true) {
                //check if piece has already taken king
                if (blackPieces[i]["location"][0] == kingLoc[0] && blackPieces[i]["location"][1] == kingLoc[1]){
                    return "Black Wins!"
                }

                // get moves of all black pieces in play
                possibleMoves = playBook(blackPieces[i]);

                // check plays against king position
                for (var j = 0; j < possibleMoves.length; j++){
                    if (possibleMoves[j][0] == kingLoc[0] && possibleMoves[j][1] == kingLoc[1]){
                        checkNow.push(possibleMoves[i]);
                    }
                    for (var k = 0; k < kingMoves.length; k++){
                        if (possibleMoves[j][0] == kingMoves[k][0] && possibleMoves[j][1] == kingMoves[k][1] && kingMoves.length > 0){
                            checkSpots.push(possibleMoves[j]);
                        }
                    }
                }
            }
        }
        if (checkNow.length > 0){
            checkSpots.concat(checkNow);
        }
    }

    else if (turn == "black"){
        kingLoc = blackPieces[0]["location"];
        kingMoves = playBook(blackPieces[0]);

        for (var i = 0; i<whitePieces.length; i++){
            if (whitePieces[i]["inPlay"] == true) {
                //check if piece has already taken king
                if (whitePieces[i]["location"][0] == kingLoc[0] && whitePieces[i]["location"][1] == kingLoc[1]){
                    return "White Wins!"
                }

                // get moves of all black pieces in play
                possibleMoves = playBook(whitePieces[i]);

                // check plays against king position
                for (var j = 0; j < possibleMoves.length; j++){
                    if (possibleMoves[j][0] == kingLoc[0] && possibleMoves[j][1] == kingLoc[1]){
                        checkNow.push(possibleMoves[i]);
                    }
                    for (var k = 0; k < kingMoves.length; k++){
                        if (possibleMoves[j][0] == kingMoves[k][0] && possibleMoves[j][1] == kingMoves[k][1] && kingMoves.length > 0){
                            checkSpots.push(possibleMoves[j]);
                        }
                    }
                }
            }
        }
        if (checkNow.length > 0){
            checkSpots.concat(checkNow);
        }
        
    }

    if (kingMoves == checkSpots) {
        return "Check Mate";
    } else {
        if (checkNow.length > 0){
            return "Check";
        } else {
            return "Resume Play";
        }
    }
    
}

function playBook(piece) {
	var possibleMoves = [];
    // this function will calculate what spaces are avilable for the piece to move to
    var row = piece["location"][0];
    var col = piece["location"][1];
    var pieceColor = piece["color"];
    var white = vec4(1.0, 1.0, 1.0, 1.0);
    var black = vec4(0.0, 0.0, 0.0, 1.0);
	var j;
	var k;
	
	var colorWhite = true;
	for (var h=0;h<4;h++){
		if (pieceColor[h] != white[h]){
			colorWhite = false;
		}
	}
    
    //king
    if (piece["name"] === "king" && piece["inPlay"]){
        if(checkIfPiece(col - 1, row - 1, pieceColor) != 2){
            if(col - 1 >= 0 && col - 1 < 8 && row - 1 >= 0 && row - 1 < 8){
			    possibleMoves.push([row-1, col-1]);
            }
        }
        if(checkIfPiece(col - 1, row + 1, pieceColor) != 2){
            if(col - 1 >= 0 && col - 1 < 8 && row + 1 >= 0 && row + 1 < 8){
			    possibleMoves.push([row+1, col-1]);
            }
        }

        if(checkIfPiece(col + 1, row + 1, pieceColor) != 2){
            if(col + 1 >= 0 && col + 1 < 8 && row + 1 >= 0 && row + 1 < 8){
			    possibleMoves.push([row+1, col+1]);
            }
        }

        if(checkIfPiece(col + 1, row - 1, pieceColor) != 2){
			if(col + 1 >= 0 && col + 1 < 8 && row - 1 >= 0 && row - 1 < 8){
                possibleMoves.push([row+1, col-1]);
            }
        }

        if(checkIfPiece(col - 1, row, pieceColor) != 2){
			if(col - 1 >= 0 && col - 1 < 8 && row >= 0 && row < 8){
                possibleMoves.push([row, col-1]);
            }
        }

        if(checkIfPiece(col + 1, row, pieceColor) != 2){
            if(col + 1 >= 0 && col + 1 < 8 && row >= 0 && row < 8){
			    possibleMoves.push([row, col+1]);
            }
        }

        if(checkIfPiece(col, row+1, pieceColor) != 2){
            if(col >= 0 && col < 8 && row + 1 >= 0 && row + 1 < 8){
			    possibleMoves.push([row+1, col]);
            }
        }

        if(checkIfPiece(col, row-1, pieceColor) != 2){
			if(col >= 0 && col < 8 && row - 1 >= 0 && row - 1 < 8){
                possibleMoves.push([row-1, col]);
            }
        }
    }

    //queen
    if (piece["name"] === "queen" && piece["inPlay"]){
		// same as bishop and rook combined!
		// ROOK FUNCTIONALITY
            // suggest if there is no piece in the spot or a piece of the other color on right
 			j = col+1;
 			k = row;
			
 			// RIGHT
 			while (j<8){
 				if(checkIfPiece(j, row, pieceColor) != 2){
                    possibleMoves.push([row, j]); // switch bc Row, Col = y,x 
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(j, row, pieceColor) == 1){
					break;
			 	}
 			 	j++;
 			}
			
 			j = col-1;
 			// LEFT
 			while (j>=0){
 				if(checkIfPiece(j, row, pieceColor) != 2){
					possibleMoves.push([row, j]);
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(j, row, pieceColor) == 1){
					break;
			 	}
 			 	j--;
 			}
			
 			j = col;
 			k = row+1;
 			// UP
 			while (k<8){
 				if(checkIfPiece(col, k, pieceColor) != 2){
					possibleMoves.push([k, col]);
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(col, k, pieceColor) == 1){
					break;
			 	}
 			 	k++;
 			}
			
 			k = row-1;
 			// DOWN
 			while (k>=0){
 				if(checkIfPiece(col, k, pieceColor) != 2){
                    possibleMoves.push([k, col]);
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(col, k, pieceColor) == 1){
					break;
			 	}
 			 	k--;
 			}
 			
			/// BISHOP FUNCTIONALITY
             j = col+1;
             k = row+1;
              // TOP RIGHT
              while (j<8 && k<8 ){
                  if(checkIfPiece(j, k, pieceColor) != 2){
                     possibleMoves.push([k, j]); // switch bc Row, Col = y,x 
                   }
                  else{ // no more paths to highlight
                      break;
                  }
  				if(checkIfPiece(j, k, pieceColor) == 1){
  					break;
  			 	}
                   j++;
                 k++;
              }

             j = col - 1;
             k = row + 1;
              // TOP LEFT
              while (j>=0 && k < 8){
                  if(checkIfPiece(j, k, pieceColor) != 2){
                     possibleMoves.push([k, j]);
                   }
                  else{ // no more paths to highlight
                      break;
                  }
  				if(checkIfPiece(j, k, pieceColor) == 1){
  					break;
  			 	}
                  j--;
                  k++;
              }
             
              // BOTTOM LEFT
             j = col - 1;
             k = row - 1;
              while (j>=0 && k>0){
                  if(checkIfPiece(j, k, pieceColor) != 2){
                     possibleMoves.push([k, j]);
                   }
                  else{ // no more paths to highlight
                      break;
                  }
  				if(checkIfPiece(j, k, pieceColor) == 1){
  					break;
  			 	}
                  j--;
                  k--;
              }

              j = col + 1;
              k = row - 1;
              // BOTTOM RIGHT
              while (j<8 && k>=0){
                  if(checkIfPiece(j, k, pieceColor) != 2){
                     possibleMoves.push([k, j]);
                   }
   				if(checkIfPiece(j, k, pieceColor) == 1){
   					break;
   			 	}
                  else{ // no more paths to highlight
                      break;
                  }
                  j++;
                  k--;
              }
     }

    //bishop
    if (piece["name"].startsWith("bishop") && piece["inPlay"]){
            j = col+1;
            k = row+1;
 			// TOP RIGHT
 			while (j<8 && k<8 ){
 				if(checkIfPiece(j, k, pieceColor) != 2){
					possibleMoves.push([k, j]); // switch bc Row, Col = y,x 
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(j, k, pieceColor) == 1){
					break;
			 	}
 			 	j++;
                k++;
 			}
			j = col - 1;
            k = row + 1;
 			// TOP LEFT
 			while (j>=0 && k < 8){
 				if(checkIfPiece(j, k, pieceColor) != 2){
					possibleMoves.push([k, j]);
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(j, k, pieceColor) == 1){
					break;
			 	}
                 j--;
                 k++;
 			}
			
 			// BOTTOM LEFT
            j = col - 1;
            k = row - 1;
 			while (j>=0 && k>0){
 				if(checkIfPiece(j, k, pieceColor) != 2){
					possibleMoves.push([k, j]);
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(j, k, pieceColor) == 1){
					break;
			 	}
                 j--;
                 k--;
 			}
             j = col + 1;
             k = row - 1;
 			// BOTTOM RIGHT
 			while (j<8 && k>=0){
 				if(checkIfPiece(j, k, pieceColor) != 2){
					possibleMoves.push([k, j]);
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
				if(checkIfPiece(j, k, pieceColor) == 1){
					break;
			 	}
                 j++;
                 k--;
 			}
 			//}    
    }

    //knight
    if (piece["name"].startsWith("knight") && piece["inPlay"]){
       
        // suggest if there is no piece in the spot or a piece of the other color on left
        if(checkIfPiece(col - 1, row + 2, pieceColor) != 2){
            //highlight ending square
            if(col - 1 >= 0 && col - 1 < 8 && row + 2 >= 0 && row + 2 < 8){
                possibleMoves.push([row+2, col-1]);
            }
        }

        // suggest if there is no piece in the spot or a piece of the other color on right
        if(checkIfPiece(col + 1, row + 2,pieceColor) != 2){
            //highlight ending square
            if(col + 1 >= 0 && col + 1 < 8 && row + 2 >= 0 && row + 2 < 8){
                possibleMoves.push([row+2, col+1]);
            }
        }

        // suggest if there is no piece in the spot or a piece of the other color on left
        if(checkIfPiece(col - 1, row - 2, pieceColor) != 2){
            //highlight ending square
            if(col - 1 >= 0 && col - 1 < 8 && row - 2 >= 0 && row - 2 < 8){
                possibleMoves.push([row-2, col-1]);
            }
        }

        // suggest if there is no piece in the spot or a piece of the other color on right
        if(checkIfPiece(col + 1, row - 2, pieceColor) != 2){
            //highlight ending square
            if(col + 1 >= 0 && col + 1 < 8 && row - 2 >= 0 && row - 2 < 8){
                possibleMoves.push([ row-2, col+1]);
            }
        }

       // suggest if there is no piece in the spot or a piece of the other color on left
        if(checkIfPiece(col + 2, row - 1, pieceColor) != 2){
        //highlight ending square
            if(col + 2 >= 0 && col + 2 < 8 && row - 1 >= 0 && row - 1 < 8){
                possibleMoves.push([row-1, col+2]);
            }
        }

        // suggest if there is no piece in the spot or a piece of the other color on right
        if(checkIfPiece(col + 2, row + 1,pieceColor) != 2){
            //highlight ending square
            if(col + 2 >= 0 && col + 2 < 8 && row + 1 >= 0 && row + 1 < 8){
                possibleMoves.push([row+1, col+2]);
            }
        }

        // suggest if there is no piece in the spot or a piece of the other color on left
        if(checkIfPiece(col - 2, row - 1, pieceColor) != 2){
            //highlight ending square
            if(col - 2 >= 0 && col - 2 < 8 && row - 1 >= 0 && row - 1 < 8){
                possibleMoves.push([row-1, col-2]);
            }
        }

        // suggest if there is no piece in the spot or a piece of the other color on right
        if(checkIfPiece(col - 2, row + 1, pieceColor) != 2){
            //highlight ending square
            if(col - 2 >= 0 && col - 2 < 8 && row + 1 >= 0 && row + 1 < 8){
                possibleMoves.push([ row+1, col-2]);
            }
        }
    }

    //rook
    if (piece["name"].startsWith("rook") && piece["inPlay"]){
 
        // suggest if there is no piece in the spot or a piece of the other color on right
        j = col+1;
        k = row;
        
        // RIGHT
        while (j<8){
            if(checkIfPiece(j, row, pieceColor) != 2){
                possibleMoves.push([row, j]);
            }
            else{ // no more paths to highlight
                break;
            }
            if(checkIfPiece(j, row, pieceColor) == 1){
                break;
            }
            j++;
		}
			
        j = col-1;
        // LEFT
        while (j>=0){
            if(checkIfPiece(j, row, pieceColor) != 2){
                possibleMoves.push([row, j]);
            }
            else{ // no more paths to highlight
                break;
            }
            if(checkIfPiece(j, row, pieceColor) == 1){
                break;
            }
            j--;
        }
        
        j = col;
        k = row+1;
        // UP
        while (k<8){
            if(checkIfPiece(col, k, pieceColor) != 2){
                possibleMoves.push([k, col]);
            }
            else{ // no more paths to highlight
                break;
            }
            if(checkIfPiece(col, k, pieceColor) == 1){
                break;
            }
            k++;
        }
        
        k = row-1;
        // DOWN
        while (k>=0){
            if(checkIfPiece(col, k, pieceColor) != 2){
                possibleMoves.push([k, col]);
            }
            else{ // no more paths to highlight
                break;
            }
            if(checkIfPiece(col, k, pieceColor) == 1){
                break;
            }
            k--;
        }   
    }

    //pawn
    if (piece["name"].startsWith("pawn") && piece["inPlay"]){
        if(colorWhite){
            //check if pawn has been moved already and if there is no piece two spaces ahead
            if (row == 1 && checkIfPiece(col, row + 2, vec4(1.0, 1.0, 1.0, 1.0)) == 0){
                // highlight move two forward for white piece
				possibleMoves.push([row+2, col]);
            }

            // if there is a piece diagonally to left and it is the opposite color
            if (checkIfPiece(col - 1, row + 1, vec4(1.0, 1.0, 1.0, 1.0)) == 1){
                if(col - 1 >= 0 && col - 1 < 8 && row + 1 >= 0 && row + 1 < 8){
				    possibleMoves.push([row+1, col-1]);
                }
            }

            // if there is a piece diagonally to right and it is the opposite color
            if (checkIfPiece(col + 1, row + 1, vec4(1.0, 1.0, 1.0, 1.0)) == 1){
                if(col + 1 >= 0 && col + 1 < 8 && row + 1 >= 0 && row + 1 < 8){
				    possibleMoves.push([row+1, col+1]);
                }
            }

            // if there are no piece one space ahead, move there
            if (checkIfPiece(col, row + 1, vec4(1.0, 1.0, 1.0, 1.0)) == 0){
                if(col >= 0 && col < 8 && row + 1 >= 0 && row + 1 < 8){
				    possibleMoves.push([row+1, col]);
                }
            }
        }

        else{
            //check if pawn has been moved already and if there is no piece two spaces ahead
            if (row == 6 && checkIfPiece(col, row - 2, vec4(0.0, 0.0, 0.0, 1.0)) != 2){
                // highlight move two forward for black piece
				possibleMoves.push([row-2, col]);
            }

            // if there is a piece diagonally to left and it is the opposite color
            if (checkIfPiece(col - 1, row - 1, vec4(0.0, 0.0, 0.0, 1.0)) == 1){
                if (col - 1 >= 0 && col - 1 < 8 && row - 1 >= 0 && row - 1 < 8){
				    possibleMoves.push([row-1, col-1]);
                }
            }

            // if there is a piece diagonally to right and it is the opposite color
            if (checkIfPiece(col + 1, row - 1, vec4(0.0, 0.0, 0.0, 1.0)) == 1){
                if(col + 1 >= 0 && col + 1 < 8 && row - 1 >= 0 && row - 1 < 8){
				    possibleMoves.push([row-1, col+1]);
                }
            }

            // if there are no piece one space ahead, move there
            if (checkIfPiece(col, row - 1, vec4(0.0, 0.0, 0.0, 1.0)) == 0){
                if(col >= 0 && col < 8 && row - 1 >= 0 && row - 1 < 8){
				    possibleMoves.push([row-1, col]);
                }
            }
        }      
    }
	return possibleMoves;
}

function createBoard()
{
    boardQuad( 1, 0, 3, 2, boardVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    frameQuad( 2, 3, 7, 6, boardVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    frameQuad( 3, 0, 4, 7, boardVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    frameQuad( 6, 5, 1, 2, boardVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    frameQuad( 4, 5, 6, 7, boardVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    frameQuad( 5, 4, 0, 1, boardVertices, vec4(1.0, 1.0, 1.0, 1.0) );
}

function drawGuide(texture, color){
    // set uniforms
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix) );

	gl.enableVertexAttribArray( a_vColorLoc );
	gl.bindBuffer( gl.ARRAY_BUFFER, cGuideBuffer );
	gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );
	gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tGuideBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vNormalLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, nGuideBuffer);
    gl.vertexAttribPointer(a_vNormalLoc, 4, gl.FLOAT, false, 0, 0);
	
	gl.enableVertexAttribArray( a_vPositionLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, vGuideBuffer);
    gl.vertexAttribPointer(a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, guidePoints.length);
}

function drawBlack(texture, color){
    // set uniforms
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix) );
    
	gl.enableVertexAttribArray( a_vColorLoc );
	gl.bindBuffer( gl.ARRAY_BUFFER, cBlackBuffer );
	gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );

	gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tBlackBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vNormalLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, nBlackBuffer);
    gl.vertexAttribPointer(a_vNormalLoc, 4, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray( a_vPositionLoc );
	gl.bindBuffer(gl.ARRAY_BUFFER, vBlackBuffer);
	gl.vertexAttribPointer(a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, blackPoints.length);
}


function drawWhite(texture, color){
    // set uniforms
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix) );
	
	gl.enableVertexAttribArray( a_vColorLoc );
	gl.bindBuffer( gl.ARRAY_BUFFER, cWhiteBuffer );
	gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tWhiteBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vNormalLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, nWhiteBuffer);
    gl.vertexAttribPointer(a_vNormalLoc, 4, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vPositionLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, vWhiteBuffer);
    gl.vertexAttribPointer(a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, whitePoints.length);
}

function drawBoard(texture, color){
    // set uniforms
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix) );

  	gl.enableVertexAttribArray( a_vColorLoc );
    gl.bindBuffer( gl.ARRAY_BUFFER, cBoardBuffer );
	gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );

	gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tBoardBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vNormalLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, nBoardBuffer);
    gl.vertexAttribPointer(a_vNormalLoc, 4, gl.FLOAT, false, 0, 0);
	
    gl.enableVertexAttribArray( a_vPositionLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, vBoardBuffer);
    gl.vertexAttribPointer(a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
	
    gl.drawArrays(gl.TRIANGLES, 0, boardPoints.length);
}

function boardQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];
    
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));

    for ( var i = 0; i < indices.length; ++i ) {
        boardPoints.push( vertices[indices[i]] );
        nBoardCoordsArray.push(normal);
        boardColors.push( color );
    }
	
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texBoardCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texBoardCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texBoardCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texBoardCoordsArray.push(texCoord[2]);
		}
    }
}

function drawFrame(texture, color){
    // set uniforms
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix) );

  	gl.enableVertexAttribArray( a_vColorLoc );
    gl.bindBuffer( gl.ARRAY_BUFFER, cFrameBuffer );
	gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );

	gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tFrameBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vNormalLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, nFrameBuffer);
    gl.vertexAttribPointer(a_vNormalLoc, 4, gl.FLOAT, false, 0, 0);
	
    gl.enableVertexAttribArray( a_vPositionLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, vFrameBuffer);
    gl.vertexAttribPointer(a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
	
    gl.drawArrays(gl.TRIANGLES, 0, framePoints.length);
}

function frameQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));

    for ( var i = 0; i < indices.length; ++i ) {
        framePoints.push( vertices[indices[i]] );
        nFrameCoordsArray.push( normal);
        frameColors.push( color );
    }
	
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texFrameCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texFrameCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texFrameCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texFrameCoordsArray.push(texCoord[2]);
		}
    }
}

function whiteQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));


    for ( var i = 0; i < indices.length; ++i ) {
        whitePoints.push( vertices[indices[i]] );
        nWhiteCoordsArray.push( normal );
        whiteColors.push( color );
    }
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texWhiteCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texWhiteCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texWhiteCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texWhiteCoordsArray.push(texCoord[2]);
		}
    }
}


function drawFrame(texture, color){
    // set uniforms
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix) );

  	gl.enableVertexAttribArray( a_vColorLoc );
    gl.bindBuffer( gl.ARRAY_BUFFER, cFrameBuffer );
	gl.vertexAttribPointer( a_vColorLoc, 4, gl.FLOAT, false, 0, 0 );

	gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tFrameBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray( a_vNormalLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, nFrameBuffer);
    gl.vertexAttribPointer(a_vNormalLoc, 4, gl.FLOAT, false, 0, 0);
	
    gl.enableVertexAttribArray( a_vPositionLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, vFrameBuffer);
    gl.vertexAttribPointer(a_vPositionLoc, 4, gl.FLOAT, false, 0, 0);
	
    gl.drawArrays(gl.TRIANGLES, 0, framePoints.length);
}

function frameQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));

    for ( var i = 0; i < indices.length; ++i ) {
        framePoints.push( vertices[indices[i]] );
        nFrameCoordsArray.push( normal);
        frameColors.push( color );
    }
	
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texFrameCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texFrameCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texFrameCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texFrameCoordsArray.push(texCoord[2]);
		}
    }
}

function whiteQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));

    for ( var i = 0; i < indices.length; ++i ) {
        whitePoints.push( vertices[indices[i]] );
        nWhiteCoordsArray.push( normal );
        whiteColors.push( color );
    }
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texWhiteCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texWhiteCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texWhiteCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texWhiteCoordsArray.push(texCoord[2]);
		}
    }
}

function blackQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    var indices = [ a, b, c, a, c, d ];

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));

    for ( var i = 0; i < indices.length; ++i ) {
        blackPoints.push( vertices[indices[i]] );
        nBlackCoordsArray.push( normal );
        blackColors.push( color );
    }
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texBlackCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texBlackCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texBlackCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texBlackCoordsArray.push(texCoord[2]);
		}
    }
}

function guideQuad(a, b, c, d, vertices, color)
{
    var indices = [ a, b, c, a, c, d ];

    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = cross(t1, t2);
    normal = normalize(vec4(normal));

    for ( var i = 0; i < indices.length; ++i ) {
        guidePoints.push( vertices[indices[i]] );
        nGuideCoordsArray.push(normal);
        guideColors.push( color );
    }
    for ( var i = 0; i < 6; ++i ) {
		if ( i == 0 || i == 3) { //a
			texGuideCoordsArray.push(texCoord[1]);
		}
		else if ( i == 1) { //b
			texGuideCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texGuideCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texGuideCoordsArray.push(texCoord[2]);
		}
    }
}

function calculateKingVertices(col, row) {
    var vertices = [
        //base square
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05,  0.29, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.29, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15,  0.29, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05,  0.29, 1.0 ),

        vec4( -0.8 + ((0.2) * col) + 0.16, -0.8 + ((0.2) * row) + 0.04, 0.29, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.16,  -0.8 + ((0.2) * row) + 0.16, 0.29, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.04,  -0.8 + ((0.2) * row) + 0.16, 0.29, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.04, -0.8 + ((0.2) * row) + 0.04, 0.29, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.16, -0.8 + ((0.2) * row) + 0.04,  0.35, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.16,  -0.8 + ((0.2) * row) + 0.16,  0.35, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.04,  -0.8 + ((0.2) * row) + 0.16,  0.35, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.04, -0.8 + ((0.2) * row) + 0.04,  0.35, 1.0 )
        

    ];

    return vertices;
}

function drawKing() {
    var kingcol = 0;
    var kingrow = 0;
    var kingVertices;
    if (whitePieces[0]["inPlay"]){
        kingcol = whitePieces[0]["location"][1];
        kingrow = whitePieces[0]["location"][0];
        kingVertices = calculateKingVertices(kingcol, kingrow);

        whiteQuad( 1, 0, 3, 2, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 2, 3, 7, 6, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 3, 0, 4, 7, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 6, 5, 1, 2, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 4, 5, 6, 7, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 5, 4, 0, 1, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );

        whiteQuad( 9, 8, 11, 10, kingVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 10, 11, 15, 14, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 11, 8, 12, 15, kingVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 14, 13, 9, 10, kingVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 12, 13, 14, 15, kingVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 13, 12, 8, 9, kingVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    }

    if (blackPieces[0]["inPlay"]){
        kingcol = blackPieces[0]["location"][1];
        kingrow = blackPieces[0]["location"][0];
        kingVertices = calculateKingVertices(kingcol, kingrow);

        blackQuad( 1, 0, 3, 2, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 2, 3, 7, 6, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 3, 0, 4, 7, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 6, 5, 1, 2, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 4, 5, 6, 7, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 5, 4, 0, 1, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );

        blackQuad( 9, 8, 11, 10, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 10, 11, 15, 14, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 11, 8, 12, 15, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 14, 13, 9, 10, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 12, 13, 14, 15, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 13, 12, 8, 9, kingVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    }
}

function calculateQueenVertices(col, row){
    var queenVertices = [
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05,  0.30, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.30, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15,  0.30, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05,  0.30, 1.0 ),

        vec4( -0.8 + ((0.2) * col) + 0.14, -0.8 + ((0.2) * row) + 0.05, 0.30, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.14,  -0.8 + ((0.2) * row) + 0.15, 0.30, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.06,  -0.8 + ((0.2) * row) + 0.15, 0.30, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.06, -0.8 + ((0.2) * row) + 0.05, 0.30, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.14, -0.8 + ((0.2) * row) + 0.05,  0.35, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.14,  -0.8 + ((0.2) * row) + 0.15,  0.35, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.06,  -0.8 + ((0.2) * row) + 0.15,  0.35, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.06, -0.8 + ((0.2) * row) + 0.05,  0.35, 1.0 )
    ];

    return queenVertices;
}

function drawQueen() {
    var queencol = 0;
    var queenrow = 0;
    var queenVertices;
	
    if (whitePieces[1]["inPlay"]){
        queencol = whitePieces[1]["location"][1];
		queenrow = whitePieces[1]["location"][0];
        queenVertices = calculateQueenVertices(queencol, queenrow);

        
        whiteQuad( 1, 0, 3, 2, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 2, 3, 7, 6, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 3, 0, 4, 7, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 6, 5, 1, 2, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 4, 5, 6, 7, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 5, 4, 0, 1, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
		
        whiteQuad( 9, 8, 11, 10, queenVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 10, 11, 15, 14, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 11, 8, 12, 15, queenVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 14, 13, 9, 10, queenVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 12, 13, 14, 15, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 13, 12, 8, 9, queenVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    }

    if (blackPieces[1]["inPlay"]){
        queencol = blackPieces[1]["location"][1];
		queenrow = blackPieces[1]["location"][0];
        queenVertices = calculateQueenVertices(queencol, queenrow);

        blackQuad( 1, 0, 3, 2, queenVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 2, 3, 7, 6, queenVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 3, 0, 4, 7, queenVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 6, 5, 1, 2, queenVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 4, 5, 6, 7, queenVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 5, 4, 0, 1, queenVertices, vec4(0.99, 0.99, 0.98, 1.0) );
		
        blackQuad( 9, 8, 11, 10, queenVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        blackQuad( 10, 11, 15, 14, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        blackQuad( 11, 8, 12, 15, queenVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        blackQuad( 14, 13, 9, 10, queenVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        blackQuad( 12, 13, 14, 15, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        blackQuad( 13, 12, 8, 9, queenVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    }
}


function calculateBishopVertices(col, row) {
    var vertices = [
    //base square
    vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
    vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
    vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05,  0.20, 1.0 ),
    vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.20, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15,  0.20, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05,  0.20, 1.0 ),

    //alternative design
    vec4( -0.8 + ((0.2) * col) + 0.13, -0.8 + ((0.2) * row) + 0.07, 0.20, 1.0 ),
    vec4( -0.8 + ((0.2) * col) + 0.13,  -0.8 + ((0.2) * row) + 0.13, 0.20, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.07,  -0.8 + ((0.2) * row) + 0.13, 0.20, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.07, -0.8 + ((0.2) * row) + 0.07, 0.20, 1.0 ),
    vec4( -0.8 + ((0.2) * col) + 0.13, -0.8 + ((0.2) * row) + 0.07,  0.30, 1.0 ),
    vec4( -0.8 + ((0.2) * col) + 0.13,  -0.8 + ((0.2) * row) + 0.13,  0.30, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.07,  -0.8 + ((0.2) * row) + 0.13,  0.30, 1.0 ),
    vec4( - 0.8 + ((0.2) * col) + 0.07, -0.8 + ((0.2) * row) + 0.07,  0.30, 1.0 )
    ];

    return vertices;
}

function drawBishop() {
    var bishopcol = 0;
    var bishoprow = 0;
    var bishopVertices;

    if (whitePieces[2]["inPlay"]){
        bishopcol = whitePieces[2]["location"][1];
        bishoprow = whitePieces[2]["location"][0];
        bishopVertices = calculateBishopVertices(bishopcol, bishoprow);

        whiteQuad( 1, 0, 3, 2, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 2, 3, 7, 6, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 3, 0, 4, 7, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 6, 5, 1, 2, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 4, 5, 6, 7, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 5, 4, 0, 1, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );

        whiteQuad( 9, 8, 11, 10, bishopVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 10, 11, 15, 14, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 11, 8, 12, 15, bishopVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 14, 13, 9, 10, bishopVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 12, 13, 14, 15, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 13, 12, 8, 9, bishopVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    } 

    if (whitePieces[3]["inPlay"]){
        bishopcol = whitePieces[3]["location"][1];
        bishoprow = whitePieces[3]["location"][0];
        bishopVertices = calculateBishopVertices(bishopcol, bishoprow);

        whiteQuad( 1, 0, 3, 2, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 2, 3, 7, 6, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 3, 0, 4, 7, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 6, 5, 1, 2, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 4, 5, 6, 7, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 5, 4, 0, 1, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );

        whiteQuad( 9, 8, 11, 10, bishopVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 10, 11, 15, 14, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 11, 8, 12, 15, bishopVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 14, 13, 9, 10, bishopVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 12, 13, 14, 15, bishopVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 13, 12, 8, 9, bishopVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
    }

    if (blackPieces[2]["inPlay"]){
        bishopcol = blackPieces[2]["location"][1];
        bishoprow = blackPieces[2]["location"][0];
        bishopVertices = calculateBishopVertices(bishopcol, bishoprow);

        blackQuad( 1, 0, 3, 2, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 2, 3, 7, 6, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 3, 0, 4, 7, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 6, 5, 1, 2, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 4, 5, 6, 7, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 5, 4, 0, 1, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );

        blackQuad( 9, 8, 11, 10, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 10, 11, 15, 14, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 11, 8, 12, 15, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 14, 13, 9, 10, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 12, 13, 14, 15, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 13, 12, 8, 9, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    }

    if (blackPieces[3]["inPlay"]){
        bishopcol = blackPieces[3]["location"][1];
        bishoprow = blackPieces[3]["location"][0];
        bishopVertices = calculateBishopVertices(bishopcol, bishoprow);

        blackQuad( 1, 0, 3, 2, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 2, 3, 7, 6, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 3, 0, 4, 7, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 6, 5, 1, 2, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 4, 5, 6, 7, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 5, 4, 0, 1, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );

        blackQuad( 9, 8, 11, 10, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 10, 11, 15, 14, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 11, 8, 12, 15, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 14, 13, 9, 10, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 12, 13, 14, 15, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 13, 12, 8, 9, bishopVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    }
}

function calculateKnightVertices(col, row) {
    var vertices = [
        //base square
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
    

        // small rectangle on top
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05,  0.25, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.25, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.10,  -0.8 + ((0.2) * row) + 0.15,  0.25, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.10, -0.8 + ((0.2) * row) + 0.05,  0.25, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.10,  -0.8 + ((0.2) * row) + 0.15, 0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.10, -0.8 + ((0.2) * row) + 0.05, 0.15, 1.0 ),
    
    ];

    return vertices;
}

function drawKnight() {
    if (whitePieces[4]["inPlay"]){
        var knightcol = 0;
        var knightrow = 0;
        var knightVertices;
    
        if (whitePieces[4]["inPlay"]){
            knightcol = whitePieces[4]["location"][1];
            knightrow = whitePieces[4]["location"][0];
            knightVertices = calculateKnightVertices(knightcol, knightrow);
    
            whiteQuad( 1, 0, 3, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 2, 3, 7, 6, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 3, 0, 4, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 6, 5, 1, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 4, 5, 6, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 5, 4, 0, 1, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    
            whiteQuad( 9, 8, 11, 10, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 10, 11, 15, 14, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 11, 8, 12, 15, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 14, 13, 9, 10, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 12, 13, 14, 15, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 13, 12, 8, 9, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        } 
    
        if (whitePieces[5]["inPlay"]){
    
            knightcol = whitePieces[5]["location"][1];
            knightrow = whitePieces[5]["location"][0];
            knightVertices = calculateKnightVertices(knightcol, knightrow);
    
            whiteQuad( 1, 0, 3, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 2, 3, 7, 6, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 3, 0, 4, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 6, 5, 1, 2, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 4, 5, 6, 7, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 5, 4, 0, 1, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    
            whiteQuad( 9, 8, 11, 10, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 10, 11, 15, 14, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 11, 8, 12, 15, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 14, 13, 9, 10, knightVertices,  vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 12, 13, 14, 15, knightVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 13, 12, 8, 9, knightVertices,   vec4(1.0, 1.0, 1.0, 1.0) );
        }
    
        if (blackPieces[4]["inPlay"]){
    
            knightcol = blackPieces[4]["location"][1];
            knightrow = blackPieces[4]["location"][0];
            knightVertices = calculateKnightVertices(knightcol, knightrow);
    
            blackQuad( 1, 0, 3, 2, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 2, 3, 7, 6, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 3, 0, 4, 7, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 6, 5, 1, 2, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 4, 5, 6, 7, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 5, 4, 0, 1, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    
            blackQuad( 9, 8, 11, 10, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 10, 11, 15, 14, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 11, 8, 12, 15, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 14, 13, 9, 10, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 12, 13, 14, 15, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 13, 12, 8, 9, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        }
    
        if (blackPieces[5]["inPlay"]){
    
            knightcol = blackPieces[5]["location"][1];
            knightrow = blackPieces[5]["location"][0];
            knightVertices = calculateKnightVertices(knightcol, knightrow);
      
            blackQuad( 1, 0, 3, 2, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 2, 3, 7, 6, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 3, 0, 4, 7, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 6, 5, 1, 2, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 4, 5, 6, 7, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 5, 4, 0, 1, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    
            blackQuad( 9, 8, 11, 10, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 10, 11, 15, 14, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 11, 8, 12, 15, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 14, 13, 9, 10, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 12, 13, 14, 15, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 13, 12, 8, 9, knightVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        }
    }
}

function calculateRookVertices(col, row){
    var rookVertices = [
        vec4( -0.8 + 0.15 + (0.2*col), -0.8 + ((0.2) * row) + 0.05 ,  0.25, 1 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.25, 1 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15,  0.25, 1 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05,  0.25, 1 ),
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.05, 1 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05, 0.05, 1 ),      
        
    ];

    return rookVertices;
}

function drawRook() {
	
    var rookcol = 0;
    var rookrow = 0;
    var rookVertices;
	
    if (whitePieces[6]["inPlay"]){
        rookcol = whitePieces[6]["location"][1];
		rookrow = whitePieces[6]["location"][0];
        rookVertices = calculateRookVertices(rookcol, rookrow);
        
        whiteQuad( 1, 0, 3, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 2, 3, 7, 6, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 3, 0, 4, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 6, 5, 1, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 4, 5, 6, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 5, 4, 0, 1, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    } 

    if (whitePieces[7]["inPlay"]){
		rookcol = whitePieces[7]["location"][1];
        rookrow = whitePieces[7]["location"][0];
        rookVertices = calculateRookVertices(rookcol, rookrow);
       
        whiteQuad( 1, 0, 3, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 2, 3, 7, 6, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 3, 0, 4, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 6, 5, 1, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 4, 5, 6, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        whiteQuad( 5, 4, 0, 1, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );

    }

    if (blackPieces[6]["inPlay"]){
        rookcol = blackPieces[6]["location"][1];
        rookrow = blackPieces[6]["location"][0];
        rookVertices = calculateRookVertices(rookcol, rookrow);

        blackQuad( 1, 0, 3, 2, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 2, 3, 7, 6, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 3, 0, 4, 7, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 6, 5, 1, 2, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 4, 5, 6, 7, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 5, 4, 0, 1, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    }

    if (blackPieces[7]["inPlay"]){
        rookcol = blackPieces[7]["location"][1];
        rookrow = blackPieces[7]["location"][0];
        rookVertices = calculateRookVertices(rookcol, rookrow);

        blackQuad( 1, 0, 3, 2, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 2, 3, 7, 6, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 3, 0, 4, 7, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 6, 5, 1, 2, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 4, 5, 6, 7, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        blackQuad( 5, 4, 0, 1, rookVertices, vec4(0.99, 0.99, 0.98, 1.0) );
    }
}

function calculatePawnVertices(col, row){
    var pawnVertices = [
        vec4( -0.8 + 0.15 + (0.2*col), -0.8 + ((0.2) * row) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * col) + 0.15,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05,  -0.8 + ((0.2) * row) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * col) + 0.05, -0.8 + ((0.2) * row) + 0.05, 0.05, 1.0 )
    ];

    return pawnVertices;
}

function drawPawn() {
    var pawncol = 0;
    var pawnrow = 0;
    var pawnVertices;

    for (var i = 8; i < 16; i++){
        if (whitePieces[i]["inPlay"]){
            pawncol = whitePieces[i]["location"][1];
            pawnrow = whitePieces[i]["location"][0];
            pawnVertices = calculatePawnVertices(pawncol, pawnrow);
            
            whiteQuad( 1, 0, 3, 2, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 2, 3, 7, 6, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 3, 0, 4, 7, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 6, 5, 1, 2, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 4, 5, 6, 7, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            whiteQuad( 5, 4, 0, 1, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );

        }
        if (blackPieces[i]["inPlay"]){
            pawncol = blackPieces[i]["location"][1];
            pawnrow = blackPieces[i]["location"][0];

            pawnVertices = calculatePawnVertices(pawncol, pawnrow);

            blackQuad( 1, 0, 3, 2, pawnVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 2, 3, 7, 6, pawnVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 3, 0, 4, 7, pawnVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 6, 5, 1, 2, pawnVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 4, 5, 6, 7, pawnVertices, vec4(0.99, 0.99, 0.98, 1.0) );
            blackQuad( 5, 4, 0, 1, pawnVertices, vec4(0.99, 0.99, 0.98, 1.0) );
        }
    }
}

function createAll(){
    drawKing();
    drawQueen();
    drawBishop();
    drawKnight();
    drawRook();
    drawPawn();
}

function drawPieces() {
	drawGuide(guideTexture, vec4(1.0, 1.0, 1.0, 1.0));
	drawWhite(whiteTexture, vec4(1.0, 1.0, 1.0, 1.0));
	drawBlack(blackTexture, vec4(0.99, 0.99, 0.98, 1.0));
}

function drawAll(){
     gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
     ctMatrix = build_rotmatrix(m_curquat);

    //rotate board on click
    if (rotate) {
        gl.uniform1f(u_thetaLoc, theta);
        rotate = false;
        gl.uniform1i(u_rotateBoard, true);
        
    }
    // orthogonal projection matrix * trackball rotation matrix
    else {
        gl.uniform1i(u_rotateBoard, false);
    }


	gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
	drawBoard(boardTexture, vec4(1.0, 1.0, 1.0, 1.0));
	drawFrame(frameTexture, vec4(1.0, 1.0, 1.0, 1.0));
    drawPieces();
}

function render(  )
{
    
    drawTurn();
	requestAnimFrame(  render);
	 drawAll();	
}