"use strict";

var canvas;
var gl;


var turn = "white"; // start with white's turn
var done = false;

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
var texCoordsArray = [];

var boardTexture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var ctMatrix;
var u_ctMatrixLoc;

var a_vColorLoc;
var a_vPositionLoc;
var cBuffer, vBuffer;
var tBuffer;
var  a_vTextureCoordLoc;
var u_textureSamplerLoc

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
					
function movePiece(){

	var pRow = Number(document.getElementById("id_row").value);
	var pCol = Number(document.getElementById("id_col").value);
	var pName = document.getElementById("id_chess_piece").value;

	var i;

		if (turn === "white"){


			for (var k=0; k<16; k++){

				if (whitePieces[k]["name"] === pName){
					var possibleMoves = playBook(whitePieces[k]);
					console.log("movePiece func");
					console.log(whitePieces[k]["name"]);
					console.log(pRow);
					console.log(pCol);
					console.log(possibleMoves);
					console.log(vec2(pRow,pCol));
					
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
								console.log("i = "+i);
								break;
							}
						}
						
						whitePieces[i]["location"] = [pRow, pCol];
						turn = "black";
						console.log("TRUE");
						return true;
					}
					
				}
			}
		}
		else{ // black's turn
			
			for (var k=0; k<16; k++){
				if (blackPieces[k]["name"] === pName){
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
					
					console.log("include? " + includes);
					if (includes == true){
						
						for (var p=0; p<blackPieces.length; p++){
							if (blackPieces[p]["name"] == pName){
								var i = p;
								break;
							}
						}
						blackPieces[i]["location"] = [pRow, pCol];
						turn = "white";
						return true;
					}
				}	
			}
		}
		console.log("FALSE");
	return false;

	  

}
				


function configureTexture( texture ) { /////// Kylee //////////////////////
    //texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    
    //Flips the source data along its vertical axis when texImage2D or texSubImage2D are called when param is true. The initial value for param is false.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, texture.image );
		 
	     gl.generateMipmap( gl.TEXTURE_2D );
	 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	 		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			/*
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
			*/
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
	
	
    // send texture coordiantes data down to the GPU
    // to be implemented
    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW ); ///??
    
    a_vTextureCoordLoc = gl.getAttribLocation( program, "a_vTextureCoord" );
    gl.vertexAttribPointer( a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( a_vTextureCoordLoc );

    // activate the texture and specify texture sampler
    // to be implemented
    gl.activeTexture(gl.TEXTURE0);//??
    u_textureSamplerLoc = gl.getUniformLocation( program, "u_textureSampler" );
    gl.uniform1i(u_textureSamplerLoc, 0);  /////////////////////////////////////
	
    //
    // Initialize a texture ///////////// Kylee
    //
    ///*
	boardTexture = gl.createTexture();
    boardTexture.image = new Image();
    boardTexture.image.onload = function() {
        configureTexture( boardTexture);
    }
    boardTexture.image.src = "Chess_Board.png";
    //*/

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

    render( boardTexture);
	

	document.getElementById("submit").onclick = function(){
		console.log("CLICK");
		var truth = movePiece( );
		console.log("TRUTH");
		//render( boardTexture);
		 gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		drawPieces();
	}
	

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
	var white = vec4(1.0, 1.0, 1.0, 1.0);
	var colorWhite = true;
	for (var h=0;h<4;h++){
		if (color[h] != white[h]){
			colorWhite = false;
		}
	}

    for (var i = 0; i < 16; i++){
		if (colorWhite == true){ // you are white
			console.log("HERE WHITE");
       		if (blackPieces[i]["location"][1] == xLoc && blackPieces[i]["location"][0] == yLoc && blackPieces[i]["inPlay"]){
           		 // there is a piece in that location that can be attacked (black piece in that spot and you are white)
            	return 1;
        	}
        	else if (whitePieces[i]["location"][1] == xLoc && whitePieces[i]["location"][0] == yLoc && whitePieces[i]["inPlay"]){
           	 	// there is a piece in that location, but it is the same color as your team (white piece in that spot and you are white)
            	return 2;
        	}

		}
		else{ // you are black
			console.log("HERE BLACK");
       	 	if (whitePieces[i]["location"][1] == xLoc && whitePieces[i]["location"][0] == yLoc && whitePieces[i]["inPlay"]){
            	// there is a piece in that location that can be attacked (white piece in that spot and you are black)
           	 	return 1;
       	 	} 
       	 	else if (blackPieces[i]["location"][1] == xLoc && blackPieces[i]["location"][0] == yLoc && blackPieces[i]["inPlay"]){
           	 	// there is a piece in that location, but it is the same color as your team (black piece in that spot and you are black)
           	 	return 2;
      	  	}

		}
    }
	console.log("RETURN 0");
	return 0;
	
}

function playBook(piece) {
	
	var possibleMoves = [];
    // this function will calculate what spaces are avilable for the piece to move to
    var xLoc = piece["location"][1];
    var yLoc = piece["location"][0];
    var pieceColor = piece["color"];
	console.log(pieceColor);
    var white = vec4(1.0, 1.0, 1.0, 1.0);
    var black = vec4(0.0, 0.0, 0.0, 1.0);
    
    //king
    if (piece["name"] == "king" && piece["inPlay"]){

    }

    //queen
    if (piece["name"] == "queen" && piece["inPlay"]){
		// same as bishop and rook combined!
		
        // if (pieceColor == white){
             // suggest if there is no piece in the spot or a piece of the other color on right
 			j = xLoc+1;
 			k = yLoc;
			
 			// RIGHT
 			while (j<8){
 				if(checkIfPiece(j, yLoc) != 2){
					possibleMoves.push([yLoc, j]); // switch bc Row, Col = y,x 
                  	var moveRookVertices = highlightMoves(j, yLoc);
                  	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
 			 	j++;
 			}
			
 			j = xLoc-1;
 			// LEFT
 			while (j>=0){
 				if(checkIfPiece(j, yLoc) != 2){
					possibleMoves.push([yLoc, j]);
                  	var moveRookVertices = highlightMoves(j, yLoc);
                  	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
 			 	j--;
 			}
			
 			j = xLoc;
 			k = yLoc+1;
 			// UP
 			while (k<8){
 				if(checkIfPiece(xLoc, k) != 2){
					possibleMoves.push([k, xLoc]);
                  	var moveRookVertices = highlightMoves(xLoc, k);
                  	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
 			 	k++;
 			}
			
 			k = yLoc-1;
 			// DOWN
 			while (k>=0){
 				if(checkIfPiece(xLoc, k) != 2){
					possibleMoves.push([k, xLoc]);
                  	var moveRookVertices = highlightMoves(xLoc, k);
                  	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                 	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
 			 	}
 				else{ // no more paths to highlight
 					break;
 				}
 			 	k--;
 			}
 			//}    
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
				possibleMoves.push([yLoc+2, xLoc-1]);
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
				possibleMoves.push([yLoc+2, xLoc+1]);
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
				possibleMoves.push([yLoc-2, xLoc-1]);
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
				possibleMoves.push([ yLoc-2, xLoc+1]);
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
       // if (pieceColor == white){
            // suggest if there is no piece in the spot or a piece of the other color on right
			j = xLoc+1;
			k = yLoc;
			
			// RIGHT
			while (j<8){
				if(checkIfPiece(j, yLoc) != 2){
					possibleMoves.push([yLoc, j]);
                 	var moveRookVertices = highlightMoves(j, yLoc);
                 	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
			 	}
				else{ // no more paths to highlight
					break;
				}
			 	j++;
			}
			
			j = xLoc-1;
			// LEFT
			while (j>=0){
				if(checkIfPiece(j, yLoc) != 2){
					possibleMoves.push([yLoc, j]);
                 	var moveRookVertices = highlightMoves(j, yLoc);
                 	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
			 	}
				else{ // no more paths to highlight
					break;
				}
			 	j--;
			}
			
			j = xLoc;
			k = yLoc+1;
			// UP
			while (k<8){
				if(checkIfPiece(xLoc, k) != 2){
					possibleMoves.push([k, xLoc]);
                 	var moveRookVertices = highlightMoves(xLoc, k);
                 	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
			 	}
				else{ // no more paths to highlight
					break;
				}
			 	k++;
			}
			
			k = yLoc-1;
			// DOWN
			while (k>=0){
				if(checkIfPiece(xLoc, k) != 2){
					possibleMoves.push([k, xLoc]);
                 	var moveRookVertices = highlightMoves(xLoc, k);
                 	quad( 1, 0, 3, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 2, 3, 7, 6, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 3, 0, 4, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 6, 5, 1, 2, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 4, 5, 6, 7, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                	quad( 5, 4, 0, 1, moveRookVertices, vec4(1.0, 1.0, 0.0, 1.0) );
			 	}
				else{ // no more paths to highlight
					break;
				}
			 	k--;
			}
			//}    
    }

    //pawn
    if (piece["name"].startsWith("pawn") && piece["inPlay"]){
		var colorWhite = true;
		for (var h=0;h<4;h++){
			if (pieceColor[h] != white[h]){
				colorWhite = false;
			}
		}
		
        if(colorWhite){
			console.log("playbook func pawn");
            console.log("check");
			console.log(checkIfPiece(xLoc, yLoc+2,white));
            //check if pawn has been moved already and if there is no piece two spaces ahead
            if (yLoc == 1 && checkIfPiece(xLoc, yLoc + 2, white) == 0){
				console.log("HERE?");
                // highlight move two forward for white piece
				possibleMoves.push([yLoc+2, xLoc]);
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
				possibleMoves.push([yLoc+1, xLoc-1]);
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
				possibleMoves.push([yLoc+1, xLoc+1]);
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
				possibleMoves.push([yLoc+1, xLoc]);
                var movePawnVertices = highlightMoves(xLoc, yLoc + 1);
                quad( 1, 0, 3, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 2, 3, 7, 6, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 3, 0, 4, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 6, 5, 1, 2, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 4, 5, 6, 7, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
                quad( 5, 4, 0, 1, movePawnVertices, vec4(1.0, 1.0, 0.0, 1.0) );
            }
        }

        else{
            //check if pawn has been moved already and if there is no piece two spaces ahead
            if (yLoc == 6 && checkIfPiece(xLoc, yLoc - 2, black) == 0){
                // highlight move two forward for black piece
				possibleMoves.push([yLoc-2, xLoc]);
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
				possibleMoves.push([yLoc-1, xLoc-1]);
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
				possibleMoves.push([yLoc-1, xLoc+1]);
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
				possibleMoves.push([yLoc-1, xLoc]);
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
	return possibleMoves;
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
		
		// a = 1
		// b = 0 
		// c = 3
		// d = 2
		if ( i == 0 || i == 3) { //a
			texCoordsArray.push(texCoord[1]);////////Kylee
		}
		else if ( i == 1) { //b
			texCoordsArray.push(texCoord[0]);
		}
		else if ( i == 2 || i == 4){ //c
			texCoordsArray.push(texCoord[3]);
		}
		else if ( i == 5){ //d
			texCoordsArray.push(texCoord[2]);
		}
    }
}

function drawKing() {
    if (whitePieces[0]["inPlay"]){

    }

    if (blackPieces[0]["inPlay"]){

    }
}

function calculateQueenVertices(xLoc, yLoc){
    var queenVertices = [

        vec4( -0.8 + 0.15 + (0.2*xLoc), -0.8 + ((0.2) * yLoc) + 0.05 ,  0.35, 1 ), // TBR
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15,  0.35, 1 ), //TFR
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15,  0.25, 1 ), //TFL
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05,  0.25, 1 ), // TBL
		

    
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1 ), // BR
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1 ), //FR
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1 ), //FL
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1 ), //BL
		

    ];

    return queenVertices;
}

function drawQueen() {
    var queenXLoc = 0;
    var queenYLoc = 0;
    var queenVertices;
	
    if (whitePieces[1]["inPlay"]){
        queenXLoc = whitePieces[1]["location"][1];
		queenYLoc = whitePieces[1]["location"][0];
        queenVertices = calculateQueenVertices(queenXLoc, queenYLoc);

        
        quad( 1, 0, 3, 2, queenVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 2, 3, 7, 6, queenVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 3, 0, 4, 7, queenVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 6, 5, 1, 2, queenVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 4, 5, 6, 7, queenVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 5, 4, 0, 1, queenVertices, vec4(0.0, 0.0, 0.0, 1.0) );

    }

    if (blackPieces[1]["inPlay"]){
        queenXLoc = blackPieces[1]["location"][1];
		queenYLoc = blackPieces[1]["location"][0];
        queenVertices = calculateQueenVertices(queenXLoc, queenYLoc);

        quad( 1, 0, 3, 2, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 2, 3, 7, 6, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 3, 0, 4, 7, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 6, 5, 1, 2, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 4, 5, 6, 7, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 5, 4, 0, 1, queenVertices, vec4(1.0, 1.0, 1.0, 1.0) );
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
function calculateRookVertices(xLoc, yLoc){
    var rookVertices = [
        vec4( -0.8 + 0.15 + (0.2*xLoc), -0.8 + ((0.2) * yLoc) + 0.05 ,  0.25, 1 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15,  0.25, 1 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15,  0.25, 1 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05,  0.25, 1 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1 )
    ];

    return rookVertices;
}

function drawRook() {
	
    var rookXLoc = 0;
    var rookYLoc = 0;
    var rookVertices;
	
    if (whitePieces[6]["inPlay"]){
        rookXLoc = whitePieces[6]["location"][1];
		rookYLoc = whitePieces[6]["location"][0];
        rookVertices = calculateRookVertices(rookXLoc, rookYLoc);

        
        quad( 1, 0, 3, 2, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 2, 3, 7, 6, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 3, 0, 4, 7, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 6, 5, 1, 2, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 4, 5, 6, 7, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 5, 4, 0, 1, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
    } 

    if (whitePieces[7]["inPlay"]){
		rookXLoc = whitePieces[7]["location"][1];
        rookYLoc = whitePieces[7]["location"][0];
        rookVertices = calculateRookVertices(rookXLoc, rookYLoc);

        
        quad( 1, 0, 3, 2, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 2, 3, 7, 6, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 3, 0, 4, 7, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 6, 5, 1, 2, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 4, 5, 6, 7, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );
        quad( 5, 4, 0, 1, rookVertices, vec4(0.0, 0.0, 0.0, 1.0) );

    }

    if (blackPieces[6]["inPlay"]){
        rookXLoc = blackPieces[6]["location"][1];
        rookYLoc = blackPieces[6]["location"][0];

        rookVertices = calculateRookVertices(rookXLoc, rookYLoc);

        quad( 1, 0, 3, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 2, 3, 7, 6, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 3, 0, 4, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 6, 5, 1, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 4, 5, 6, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 5, 4, 0, 1, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );

    }

    if (blackPieces[7]["inPlay"]){
        rookXLoc = blackPieces[7]["location"][1];
        rookYLoc = blackPieces[7]["location"][0];

        rookVertices = calculateRookVertices(rookXLoc, rookYLoc);

        quad( 1, 0, 3, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 2, 3, 7, 6, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 3, 0, 4, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 6, 5, 1, 2, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 4, 5, 6, 7, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
        quad( 5, 4, 0, 1, rookVertices, vec4(1.0, 1.0, 1.0, 1.0) );
    }
}

function calculatePawnVertices(xLoc, yLoc){
    var pawnVertices = [
        vec4( -0.8 + 0.15 + (0.2*xLoc), -0.8 + ((0.2) * yLoc) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15,  0.15, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05,  0.15, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1.0 ),
        vec4( -0.8 + ((0.2) * xLoc) + 0.15,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05,  -0.8 + ((0.2) * yLoc) + 0.15, 0.05, 1.0 ),
        vec4( - 0.8 + ((0.2) * xLoc) + 0.05, -0.8 + ((0.2) * yLoc) + 0.05, 0.05, 1.0 )
    ];

    return pawnVertices;
}
function drawPawn() {
    var pawnXLoc = 0;
    var pawnYLoc = 0;
    var pawnVertices;

    for (var i = 8; i < 16; i++){
        if (whitePieces[i]["inPlay"]){
            pawnXLoc = whitePieces[i]["location"][1];
            //console.log(pawnXLoc);
            pawnYLoc = whitePieces[i]["location"][0];
            //console.log(pawnYLoc);

            pawnVertices = calculatePawnVertices(pawnXLoc, pawnYLoc);
            //console.log(pawnVertices);
            
            quad( 1, 0, 3, 2, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 2, 3, 7, 6, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 3, 0, 4, 7, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 6, 5, 1, 2, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 4, 5, 6, 7, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );
            quad( 5, 4, 0, 1, pawnVertices, vec4(0.0, 0.0, 0.0, 1.0) );

        }
        if (blackPieces[i]["inPlay"]){
            pawnXLoc = blackPieces[i]["location"][1];
            console.log(pawnXLoc);
            pawnYLoc = blackPieces[i]["location"][0];
            console.log(pawnYLoc);

            pawnVertices = calculatePawnVertices(pawnXLoc, pawnYLoc);

            quad( 1, 0, 3, 2, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 2, 3, 7, 6, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 3, 0, 4, 7, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 6, 5, 1, 2, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 4, 5, 6, 7, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
            quad( 5, 4, 0, 1, pawnVertices, vec4(1.0, 1.0, 1.0, 1.0) );
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
/*
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
*/



function render( texture )
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // for trackball
    m_inc = build_rotmatrix(m_curquat);
	//console.log("CHECKPOINT 1");
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
		//console.log("CHECKPOINT 2");
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
	
	/*
	gl.bindTexture( gl.TEXTURE_2D, texture );     /////////////// ?
    gl.enableVertexAttribArray( a_vTextureCoordLoc );
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.vertexAttribPointer(a_vTextureCoordLoc, 2, gl.FLOAT, false, 0, 0);
	*/
		//console.log("CHECKPOINT 3");
    
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
		//console.log("CHECKPOINT 4");
    requestAnimFrame( render );
}