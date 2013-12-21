/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 *
 */


/* requireJS module definition */
define(["vbo"],
        (function(vbo) {

            "use strict";
            /* constructor for Parametric Surface objects
             * gl:  WebGL context object
             * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
             * config: configuration object defining attributes uMin, uMax, vMin, vMax, 
             *         and drawStyle (i.e. "points", "wireframe", or "surface")
             */
            var ParametricSurface = function(gl, posFunc, config) {

                // read the configuration parameters
                posFunc = posFunc || function(u, v) {
                    return [0.5 * Math.sin(u) * Math.cos(v),
                        0.3 * Math.sin(u) * Math.sin(v),
                        0.9 * Math.cos(u)];
                }
                ;
                config = config || {};
                var uSegments = config.uSegments || 40;
                var vSegments = config.vSegments || 20;
                var uMin = config.uMin || -Math.PI;
                var uMax = config.uMax || Math.PI;
                var vMin = config.vMin || -Math.PI;
                var vMax = config.vMax || Math.PI;
                this.drawStyle = config.drawStyle || "points";
                this.asWireframe = config.asWireframe || false;
                this.filled = config.filled || false;


                // arrays for the buffer obects

                /*              var triangles = new Uint16Array(numPatches * 6);
                 var lines = new Uint16Array(numPatches * 4);
                 */
                window.console.log("Creating a Ellipse with uSegments:" + uSegments + ", vSegments: " + vSegments + ", uMin: "
                        + uMin + ", drawstyle: " + this.drawstyle + ", asWireframe: " + this.asWireframe + ", filled: " + this.filled + ", uMax: " + uMax + ", vMin: " + vMin + ", vMax:" + vMax);
                //create u and v
                // generate vertex coordinates and store in an array
                var coords = [];
                for (var i = 0; i <= uSegments; i++) {
                    for (var j = 0; j <= vSegments; j++) {

                        // current position (u,v) on the surface 
                        var u = uMin + i * (uMax - uMin) / uSegments;
                        var v = vMin + j * (vMax - vMin) / vSegments;



                        // calculate the vertex attributes and push it in the array
                        var position = posFunc(u, v);
                        coords.push(position[0], position[1], position[2]);
                        //  var vindex = i * (vSegments + 1) + j;

                        /*   // index inside the 
                         var iindex = i * vSegments + j;
                         
                         // indices for drawing two triangles per patch
                         if (i < uSegments && j < vSegments) {
                         var ii = iindex * 6;
                         triangles[ii++] = vindex;
                         triangles[ii++] = vindex + (vSegments + 1);
                         triangles[ii++] = vindex + (vSegments + 1) + 1;
                         triangles[ii++] = vindex + (vSegments + 1) + 1;
                         triangles[ii++] = vindex + 1;
                         triangles[ii++] = vindex;
                         }
                         ;
                         // indices for drawing two lines per patch
                         if (i < uSegments && j < vSegments) {
                         var ii = iindex * 4;
                         lines[ii++] = vindex;
                         lines[ii++] = vindex + (vSegments + 1);
                         lines[ii++] = vindex;
                         lines[ii++] = vindex + 1;
                         }
                         ;*/
                    }
                }
                // create vertex buffer object (VBO) for the coordinates
                this.coordsBuffer = new vbo.Attribute(gl, {"numComponents": 3,
                    "dataType": gl.FLOAT,
                    "data": coords
                });
                // indices for filled band
                /*  var bIndex = [];
                 for (var i = 0; i < segments * 2; i += 2) {
                 bIndex.push(i, i + 1, i + 2, i + 2, i + 1, i + 3); //CCW
                 
                 }
                 ;
                 // indices for wireframe
                 var separator = [];
                 for (var i = 0; i < segments * 2; i += 2) {
                 separator.push(i, i + 1);
                 separator.push(i, i + 2);
                 separator.push(i + 1, i + 3);
                 //    separator.push(i + 2, i + 3);
                 }
                 ;*/


                /*              // create vertex buffer object (VBO) for the indices
                 this.bIndexBuffer = new vbo.Indices(gl, {"indices": bIndex});
                 
                 // create vertex buffer object (VBO) for the indices
                 this.separatorBuffer = new vbo.Indices(gl, {"indices": separator});
                 
                 this.triangleBuffer = new vbo.Indices(gl, {"indices": triangles});
                 this.lineBuffer = new vbo.Indices(gl, {"indices": lines});*/
            };
            // draw method: activate buffers and issue WebGL draw() method
            ParametricSurface.prototype.draw = function(gl, program) {

                // bind the attribute buffers
                program.use();
                this.coordsBuffer.bind(gl, program, "vertexPosition");
                // draw the vertices as points
                if (this.drawStyle == "points") {
                    gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
                } else {
                    window.console.log("Ellipse: draw style " + this.drawStyle + " not implemented.");
                }
                /*
                 if (this.asWireframe) {
                 // bind the attribute buffers
                 this.coordsBuffer.bind(gl, program, "vertexPosition");
                 this.separatorBuffer.bind(gl);
                 
                 // draw the vertices as points
                 gl.drawElements(gl.LINES, this.separatorBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
                 }
                 ;
                 if (this.filled) {
                 
                 // bind the attribute buffers
                 this.coordsBuffer.bind(gl, program, "vertexPosition");
                 this.bIndexBuffer.bind(gl);
                 
                 // draw the vertices as points
                 gl.drawElements(gl.TRIANGLES, this.bIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
                 }
                 ;*/
                /*if (this.wireframe) {
                 // draw wireframe lines
                 this.lineBuffer.bind(gl);
                 program.gl.drawElements(gl.LINES, this.lineBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
                 } else {
                 // draw as solid / surface
                 this.triangleBuffer.bind(gl);
                 gl.polygonOffset(2.0, 2.0);
                 gl.enable(gl.POLYGON_OFFSET_FILL);
                 program.gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
                 gl.disable(gl.POLYGON_OFFSET_FILL);
                 }
                 ;*/

            };
            // this module only returns the Band constructor function    
            return ParametricSurface;
        })); // define


