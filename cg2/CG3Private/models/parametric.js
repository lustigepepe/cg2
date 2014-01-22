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
                        0.5 * Math.sin(u) * Math.sin(v),
                        0.5 * Math.cos(u)];
                }
                ;
                var texCoords = function(u, v) {
                    return [0.5 + u / (Math.PI * 2), v / (Math.PI)];
                };
                config = config || {};
                var uSegments = config.uSegments || 70;
                var vSegments = config.vSegments || 70;
                var uMin = config.uMin || -Math.PI;
                var uMax = config.uMax || Math.PI;
                var vMin = config.vMin || -Math.PI;
                var vMax = config.vMax || Math.PI;
                this.drawStyle = config.drawStyle || "points";
                this.asWireframe = config.asWireframe || false;
                this.filled = config.filled || false;


                window.console.log("Creating a Ellipse with uSegments:" + uSegments + ", vSegments: " + vSegments + ", uMin: "
                        + uMin + ", drawstyle: " + this.drawstyle + ", asWireframe: " + this.asWireframe + ", filled: " + this.filled + ", uMax: " + uMax + ", vMin: " + vMin + ", vMax:" + vMax);
                //create u and v
                // generate vertex coordinates and store in an array
                var coords = [];
                //      var colors = [];
                var normals = [];
                //    var texcoords = [];
                for (var i = 0; i <= uSegments; i++) {
                    for (var j = 0; j <= vSegments; j++) {

                        // current position (u,v) on the surface 
                        var u = uMin + i * (uMax - uMin) / uSegments;
                        var v = vMin + j * (vMax - vMin) / vSegments;

                        // calculate the vertex attributes and push it in the array
                        var position = posFunc(u, v);
                        coords.push(position[0], position[1], position[2]);
                        //   colors.push(1, 0, 0, 1);
                        normals.push(position[0], position[1], position[2]);
                        //var tex = texCoords(u, v);
                        // texcoords.push(tex[0],tex[1]);
                    }
                }

                // indices for filled band
                var bIndex = [];

                // indices for wireframe
                var separator = [];

                var rightSide = (vSegments + 1);
                var realValue = 0;
                for (var j = 0; j < uSegments * rightSide; j += rightSide) {
                    for (var i = 0; i < vSegments; i++) {
                        realValue = j + i;
                        separator.push(realValue, realValue + 1);
                        separator.push(realValue, realValue + rightSide);
                        separator.push(realValue + 1, realValue + 1 + rightSide);
                        bIndex.push(realValue, realValue + 1, realValue + rightSide, realValue + rightSide, realValue + 1, realValue + rightSide + 1);

                    }
                    ;
                }
                ;

                // Filled - create vertex buffer object (VBO) for the indices
                this.bIndexBuffer = new vbo.Indices(gl, {"indices": bIndex});

                // Wire - create vertex buffer object (VBO) for the indices
                this.separatorBuffer = new vbo.Indices(gl, {"indices": separator});

                // create vertex buffer object (VBO) for the coordinates
                this.coordsBuffer = new vbo.Attribute(gl, {"numComponents": 3,
                    "dataType": gl.FLOAT,
                    "data": coords
                });



                // create vertex buffer object (VBO) for the colors
                /*  this.colorBuffer = new vbo.Attribute(gl, {"numComponents": 4,
                 "dataType": gl.FLOAT,
                 "data": colors
                 });*/

                // create vertex buffer object (VBO) for the normal vectors
                this.normalBuffer = new vbo.Attribute(gl, {"numComponents": 3,
                    "dataType": gl.FLOAT,
                    "data": normals
                });

                // create vertex buffer object (VBO) for the normal vectors
                /*   this.texcoordsBuffer = new vbo.Attribute(gl, {"numComponents": 2,
                 "dataType": gl.FLOAT,
                 "data": texcoords
                 });*/


            };

            // draw method: activate buffers and issue WebGL draw() method
            ParametricSurface.prototype.draw = function(gl, material) {

                material.apply();

                // bind the attribute buffers
                var program = material.getProgram();
                this.coordsBuffer.bind(gl, program, "vertexPosition");
                // this.colorBuffer.bind(gl, program, "vertexColor");
                this.normalBuffer.bind(gl, program, "vertexNormal");
                //his.texcoordsBuffer.bind(gl, program, "vertexTexCoords");
                // bind the attribute buffers
                // draw the vertices as points
                if (this.drawStyle == "points") {
                    gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
                } else {
                    window.console.log("Ellipse: draw style " + this.drawStyle + " not implemented.");
                }

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
                    material.apply();

                    // bind the attribute buffers
                    var program = material.getProgram();
                    this.normalBuffer.bind(gl, program, "vertexNormal");
                    this.coordsBuffer.bind(gl, program, "vertexPosition");
                    this.bIndexBuffer.bind(gl);

                    // draw the vertices as points
                    gl.drawElements(gl.TRIANGLES, this.bIndexBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
                }



            };
            // this module only returns the Band constructor function    
            return ParametricSurface;
        })); // define


