/*
 *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* requireJS module definition */
define(["gl-matrix", "program", "shaders", "models/band", "models/triangle", "models/cube", "models/robot", "models/robot_Test",
    "models/parametric"],
        (function(glmatrix, Program, shaders, Band, Triangle, Cube, Robot, RobotTest, ParametricSurface) {

            "use strict";

            // simple scene: create some scene objects in the constructor, and
            // draw them in the draw() method
            var Scene = function(gl) {

                // store the WebGL rendering context 
                this.gl = gl;

                // create all required GPU programs from vertex and fragment shaders
                this.programs = {};
                this.programs.red = new Program(gl,
                        shaders.getVertexShader("red"),
                        shaders.getFragmentShader("red"));
                this.programs.red2 = new Program(gl,
                        shaders.getVertexShader("red2"),
                        shaders.getFragmentShader("red2"));
                this.programs.vertexColor = new Program(gl,
                        shaders.getVertexShader("vertex_color"),
                        shaders.getFragmentShader("vertex_color"));
                this.programs.black = new Program(gl,
                        shaders.getVertexShader("black"),
                        shaders.getFragmentShader("black"));
                this.programs.blue = new Program(gl,
                        shaders.getVertexShader("blue"),
                        shaders.getFragmentShader("blue"));




                // create a parametric surface to be drawn in this scene
                var positionFunc = function(u, v) {
                    return [0.5 * Math.sin(u) * Math.cos(v),
                        0.3 * Math.sin(u) * Math.sin(v),
                        0.9 * Math.cos(u)];
                };

                // R is the radius from the torus center
                var R = 0.8;
                // r is the radius from the torus 
                var r = 0.2;
                var torusFunc = function(u, v) {
                    return [(r * Math.cos(u) + R) * Math.cos(v),
                        (r * Math.cos(u) + R) * Math.sin(v),
                        r * Math.sin(u)];
                };




                var hyperboloidFunc = function(u, v) {
                    return [Math.sqrt(Math.pow((u), 2) + 1) * Math.cos(v),
                        Math.sqrt(Math.pow((u), 2) + 1) * Math.sin(v),
                        (u)];
                };
                var config = {
                    "uMin": -Math.PI,
                    "uMax": Math.PI,
                    "vMin": -Math.PI,
                    "vMax": Math.PI,
                    "uSegments": 40,
                    "vSegments": 20
                };
                //Objects for class Ellipsoid
                this.ellipsoid = new ParametricSurface(gl, positionFunc, config);
                this.ellipsoidFilled = new ParametricSurface(gl, positionFunc, {filled: true});
                this.ellipsoidWirefire = new ParametricSurface(gl, positionFunc, {asWireframe: true});

                this.torusEllipsoidFilled = new ParametricSurface(gl, torusFunc, {filled: true});
                this.torusEllipsoidWireFire = new ParametricSurface(gl, torusFunc, {asWireframe: true});
                this.torusEllipsoid = new ParametricSurface(gl, torusFunc, config);

                this.hyperboloidEllipsoid = new ParametricSurface(gl, hyperboloidFunc, config);
                this.hyperboloidEllipsoidFilled = new ParametricSurface(gl, hyperboloidFunc, {filled: true});
                this.hyperboloidEllipsoidWirefire = new ParametricSurface(gl, hyperboloidFunc, {asWireframe: true});



                // create some objects to be drawn in this scene
                this.triangle = new Triangle(gl);
                this.cube = new Cube(gl);
                this.band = new Band(gl, {height: 0.4, drawStyle: "points"});
                this.bandWireframe = new Band(gl, {height: 0.4, asWireframe: true});
                this.bandFilled = new Band(gl, {height: 0.4, filled: true});
                this.robot = new Robot(gl, this.programs);
                this.robotTest = new RobotTest(gl, this.programs);


                // initial position of the camera
                this.cameraTransformation = mat4.lookAt([0, 0.5, 3], [0, 0, 0], [0, 1, 0]);

                // transformation of the scene, to be changed by animation
                this.transformation = mat4.create(this.cameraTransformation);

                // the scene has an attribute "drawOptions" that is used by 
                // the HtmlController. Each attribute in this.drawOptions 
                // automatically generates a corresponding checkbox in the UI.
                this.drawOptions = {"Perspective Projection": false,
                    "Show Triangle": false,
                    "Show Cube": false,
                    "Show Band": false,
                    "Solid Band": false,
                    "Wireframe Band": true,
                    "Show Ellipsoid": false,
                    "Solid Ellipsoid": false,
                    "Wire Ellipsoid": false,
                    "Show TorusSurface": false,
                    "Solid TorusSurface": false,
                    "Wire TorusSurface": false,
                    "Show HyperboloidSurFace": false,
                    "Solid HyperboloidSurFace": false,
                    "Wire HyperboloidSurFace": false,
                    "Show Robot": true,
                    "Show RobotTest": false

                }
                ;
            };

            // the scene's draw method draws whatever the scene wants to draw
            Scene.prototype.draw = function() {

                // just a shortcut
                var gl = this.gl;

                // set up the projection matrix, depending on the canvas size
                var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
                var projection = this.drawOptions["Perspective Projection"] ?
                        mat4.perspective(45, aspectRatio, 0.01, 100) :
                        mat4.ortho(-aspectRatio, aspectRatio, -1, 1, 0.01, 100);


                // set the uniform variables for all used programs
                for (var p in this.programs) {
                    this.programs[p].use();
                    this.programs[p].setUniform("projectionMatrix", "mat4", projection);
                    this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
                }

                // clear color and depth buffers
                gl.clearColor(0.7, 0.7, 0.7, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT |  gl.DEPTH_BUFFER_BIT);
                // set up depth test to discard occluded fragments
                gl.enable(gl.DEPTH_TEST);
                gl.depthFunc(gl.LESS);

                // Z-Fighting
                gl.enable(gl.POLYGON_OFFSET_FILL);
                gl.polygonOffset(1.0, 1.0);



                // draw the scene objects
                if (this.drawOptions["Show Triangle"]) {
                    this.triangle.draw(gl, this.programs.vertexColor);
                }
                ;
                if (this.drawOptions["Show Cube"]) {
                    this.cube.draw(gl, this.programs.vertexColor);
                }
                ;
                if (this.drawOptions["Show Band"]) {
                    this.band.draw(gl, this.programs.red);
                }
                ;
                if (this.drawOptions["Solid Band"]) {
                    this.bandFilled.draw(gl, this.programs.red2);
                }
                ;
                if (this.drawOptions["Wireframe Band"]) {
                    this.bandWireframe.draw(gl, this.programs.black);
                }
                ;

                if (this.drawOptions["Show Ellipsoid"]) {
                    this.ellipsoid.draw(gl, this.programs.red);
                }
                ;
                if (this.drawOptions["Wire Ellipsoid"]) {
                    this.ellipsoidWirefire.draw(gl, this.programs.black);
                }
                if (this.drawOptions["Solid Ellipsoid"]) {
                    this.ellipsoidFilled.draw(gl, this.programs.red2);
                }

                if (this.drawOptions["Show Ellipsoid"]) {
                    this.ellipsoid.draw(gl, this.programs.red);
                }
                if (this.drawOptions["Show TorusSurface"]) {
                    this.torusEllipsoid.draw(gl, this.programs.red);
                }
                if (this.drawOptions["Solid TorusSurface"]) {
                    this.torusEllipsoidFilled.draw(gl, this.programs.red);
                }
                if (this.drawOptions["Wire TorusSurface"]) {
                    this.torusEllipsoidWireFire.draw(gl, this.programs.black);
                }
                if (this.drawOptions["Show HyperboloidSurFace"]) {
                    this.hyperboloidEllipsoid.draw(gl, this.programs.red);
                }
                if (this.drawOptions["Solid HyperboloidSurFace"]) {
                    this.hyperboloidEllipsoidFilled.draw(gl, this.programs.red);
                }
                  if (this.drawOptions["Wire HyperboloidSurFace"]) {
                    this.hyperboloidEllipsoidWirefire.draw(gl, this.programs.black);
                }
                if (this.drawOptions["Show Robot"]) {
                    this.robot.draw(gl, this.program, this.transformation);
                }
                if (this.drawOptions["Show RobotTest"]) {
                    this.robotTest.draw(gl, this.program, this.transformation);
                }
            }
            ;

            // the scene's rotate method is called from HtmlController, when certain
            // keyboard keys are pressed. Try Y and Shift-Y, for example.
            Scene.prototype.rotate = function(rotationAxis, angle) {

                window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees.");

                // degrees to radian
                angle = angle * Math.PI / 180;

                // manipulate the corresponding matrix, depending on the name of the joint
                switch (rotationAxis) {
                    case "worldY":
                        mat4.rotate(this.transformation, angle, [0, 1, 0]);
                        break;
                    case "worldX":
                        mat4.rotate(this.transformation, angle, [1, 0, 0]);
                        break;
                    case "headY":
                        mat4.rotate(this.robot.headNeck.transform(), angle, [0, 1, 0]); // h-key headNeck-rotation
                        break;
                    case "leftArm":
                        mat4.rotate(this.robot.leftArm.transform(), -angle, [1, 0, 0]); // q-key leftArm-rotation
                        break;
                    case "rightArm":
                        mat4.rotate(this.robot.rightArm.transform(), -angle, [1, 0, 0]); // w-key rightArm-rotation
                        break;
                    case "leftForearm":
                        mat4.rotate(this.robot.leftForearm.transform(), -angle, [1, 0, 0]); // e-key leftForearm-rotation
                        break;
                    case "rightForearm":
                        mat4.rotate(this.robot.rightForearm.transform(), -angle, [1, 0, 0]); // r-key rightForearm-rotation
                        break;

                    case "leftHand":
                        mat4.rotate(this.robot.leftForearm.transform(), angle, [0, 0, 1]);
                        break;
                    case "rightHand":
                        mat4.rotate(this.robot.rightForearm.transform(), -angle, [0, 0, 1]);
                        break;
                    case "leftHandX":
                        mat4.rotate(this.robot.LHandSkin.transform(), angle, [0, 1, 0]); // v-key LHandSkin-rotation
                        break;
                    case "rightHandX":
                        mat4.rotate(this.robot.RHandSkin.transform(), -angle, [0, 1, 0]); // b-key RHandSkin-rotation
                        break;
                    default:
                        window.console.log("axis " + rotationAxis + " not implemented.");
                        break;
                    case "glory":
                        mat4.rotate(this.robot.gloryHead.transform(), angle, [0, 1, 0]); // v-key LHandSkin-rotation
                        break;
                    case "glory":
                        mat4.rotate(this.robot.gloryHead.transform(), -angle, [0, 1, 0]); // b-key RHandSkin-rotation
                        break;
                }
                ;



                // redraw the scene
                this.draw();
            };

            return Scene;

        })); // define module


