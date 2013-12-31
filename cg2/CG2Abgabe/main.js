/*
 *
 * Module main: CG2 Aufgabe 2 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */

requirejs.config({
    paths: {
// jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7",
    }
});
/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "webgl-debug", "animation", "scene", "html_controller"],
        (function($, glmatrix, WebGLDebugUtils, Animation, Scene, HtmlController) {

            "use strict";
            /*
             * create an animation that rotates the scene around 
             * the Y axis over time. 
             */
            var makeAnimation = function(scene) {
                // head animation
                var headRight = true;
                var headLeft = false;
                var headCounter = 0;
                // arm animation
                var armCounter = 0;
                var forearmCounterX = 0;
                var forearmCounterZ = 0;
                var armUp = true;
                var armDown = false;
                var armUpDown = 0;
                // create animation to rotate the scene
                var animation = new Animation((function(t, deltaT) {

                    // rotation angle, depending on animation time
                    var angle = deltaT / 1000 * animation.customSpeed; // in degrees


                    // scene.rotate("worldY", angle);
                    //glory animation
                   
                    scene.rotate("glory", 3);

                    // head animation
                    if (headRight == true && headLeft == false) {
                        scene.rotate("headY", 2);
                        headCounter++;
                        if (headCounter == 10) {
                            headRight = false;
                            headLeft = true;
                        }
                    }
                    ;
                    if (headRight == false && headLeft == true) {
                        scene.rotate("headY", -2);
                        headCounter--;
                        if (headCounter == -10) {
                            headRight = true;
                            headLeft = false;
                        }
                    }
                    ;
                    // arm animation
                    if (armCounter < 15) {
                        scene.rotate("leftArm", 2);
                        scene.rotate("rightArm", 2);
                        armCounter++;
                    }
                    ;
                    if (forearmCounterX < 10) {
                        scene.rotate("leftForearm", 2);
                        scene.rotate("rightForearm", 2);
                        forearmCounterX++;
                    } else {
                        scene.rotate("leftHandX", 4);
                        scene.rotate("rightHandX", 4);
                        if (forearmCounterZ < 15) {
                            scene.rotate("leftHand", 2);
                            scene.rotate("rightHand", 2);
                            forearmCounterZ++;
                        } else {
                            if (armUp == true && armDown == false) {
                                scene.rotate("leftArm", 3 / 2 * angle);
                                scene.rotate("rightArm", 3 / 2 * angle);
                                armUpDown++;
                                if (armUpDown == 5) {
                                    armUp = false;
                                    armDown = true;
                                }
                            }
                            if (armUp == false && armDown == true) {
                                scene.rotate("leftArm", -3 / 2 * angle);
                                scene.rotate("rightArm", -3 / 2 * angle);
                                armUpDown--;
                                if (armUpDown == -2) {
                                    armUp = true;
                                    armDown = false;
                                }
                            }
                        }
                    }
                    ;
                   
                    scene.draw();
                })); 

                // set an additional attribute that can be controlled from the outside
                animation.customSpeed = 20;
                return animation;
            };
            var makeWebGLContext = function(canvas_name) {

                // get the canvas element to be used for drawing
                var canvas = $("#" + canvas_name).get(0);
                if (!canvas) {
                    throw "HTML element with id '" + canvas_name + "' not found";
                    return null;
                }
                ;
                // get WebGL rendering context for canvas element
                var options = {alpha: true, depth: true, antialias: true};
                var gl = canvas.getContext("webgl", options) ||
                        canvas.getContext("experimental-webgl", options);
                if (!gl) {
                    throw "could not create WebGL rendering context";
                }
                ;
                // create a debugging wrapper of the context object
                var throwOnGLError = function(err, funcName, args) {
                    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
                };
                var gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
                return gl;
            };
            $(document).ready((function() {

                // create WebGL context object for the named canvas object
                var gl = makeWebGLContext("drawing_area");
                // create scene, create animation, and draw once
                var scene = new Scene(gl);
                var animation = makeAnimation(scene);
                scene.draw();
                // mapping from character pressed on the keyboard to 
                // rotation axis and angle
                var keyMap = {
                    'x': {axis: "worldX", angle: 5.0},
                    'X': {axis: "worldX", angle: -5.0},
                    'y': {axis: "worldY", angle: 5.0},
                    'Y': {axis: "worldY", angle: -5.0},
                    'a': {axis: "headY", angle: 5.0},
                    'A': {axis: "headY", angle: -5.0},
                    's': {axis: "leftArm", angle: 5.0},
                    'S': {axis: "leftArm", angle: -5.0},
                    'd': {axis: "rightArm", angle: 5.0},
                    'D': {axis: "rightArm", angle: -5.0},
                    'c': {axis: "leftForearm", angle: 5.0},
                    'C': {axis: "leftForearm", angle: -5.0},
                    'q': {axis: "glory", angle: 5.0},
                    'Q': {axis: "glory", angle: -5.0}
                };
                // create HtmlController that takes care of all interaction
                // of HTML elements with the scene and the animation
                var controller = new HtmlController(scene, animation, keyMap);
            })); // $(document).ready()



        })); // define module


