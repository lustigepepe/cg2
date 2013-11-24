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
                window.console.log("Creating a Ellipse with uSegments:" + uSegments + ", vSegments: " + vSegments + ", uMin: "
                        + uMin + ", uMax: " + uMax + ", vMin: " + vMin + ", vMax:" + vMax);
                //create u and v
                // generate vertex coordinates and store in an array
                var coords = [];
                for (var i = 0; i <= uSegments; i++) {
                    for (var j = 0; j <= vSegments; j++) {

                        // current position (u,v) on the surface 
                        var u = uMin + i * (uMax - uMin) / uSegments;
                        var v = vMin + j * (vMax - vMin) / vSegments;
                        
                        
                        
                        // calculate the vertex attributes and push it in the array
                       var position = posFunc(u,v);
                       coords.push(position[0],position[1],position[2]);
                    }
                }
             
                // create vertex buffer object (VBO) for the coordinates
                this.coordsBuffer = new vbo.Attribute(gl, {"numComponents": 3,
                    "dataType": gl.FLOAT,
                    "data": coords
                });
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

            };
            // this module only returns the Band constructor function    
            return ParametricSurface;
        })); // define


