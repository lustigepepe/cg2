/* requireJS module definition */
define(["jquery", "gl-matrix", "webgl-debug",
    "program", "shaders", "animation", "html_controller", "scene_node",
    "models/triangle", "models/cube", "models/band"],
        (function($, glmatrix, WebGLDebugUtils,
                Program, shaders, Animation, HtmlController, SceneNode,
                Triangle, Cube, Band) {

            "use strict";
            /*
             *  This function asks the HTML Canvas element to create
             *  a context object for WebGL rendering.
             *
             *  It also creates a wrapper around it for debugging 
             *  purposes, using webgl-debug.js
             *
             */





            // a simple scene is an object with a few objects and a draw() method
            var Robot = function(gl, programs) {



                // create WebGL program using constant red color
                var red = programs.red2;
                var blue = programs.blue;
                // create WebGL program using per-vertex-color
                var color = programs.vertexColor;
                // please register all programs in this list


                // create some objects to be drawn
                var cube = new Cube(gl);
                var band = new Band(gl, {radius: 0.5, height: 1.0, segments: 50, filled: true});
                var triangle = new Triangle(gl);
                /**
                 * Dimension
                 **/
                {
                    // head
                    var faceSize = [0.3, 0.3, 0.3];
                    var neckSize = [0.2, 0.05, 0.15];
                    // torso
                    var torsoSize = [0.5, 0.7, 0.275];
                    // leftArm
                    var leftArmSize = [[0.025, 0.1, 0.1], // LShoulderJointSize(0)
                        [0.15, 0.325, 0.15], // LUpperarmSize(1)
                        [0.1, 0.1, 0.1], // LEllbowSize(2)
                        [0.1, 0.3, 0.1], // LForearmSize(3)
                        [0.1, 0.1, 0.1], // LWristSize(4)
                        [0.2, 0.2, 0.2] // LHandSize(5)			
                    ];
                    // leftArm
                    var rightArmSize = [[0.025, 0.1, 0.1], // RShoulderJointSize(0)
                        [0.15, 0.325, 0.15], // RUpperarmSize(1)
                        [0.1, 0.1, 0.1], // REllbowSize(2)
                        [0.1, 0.3, 0.1], // RForearmSize(3)
                        [0.1, 0.1, 0.1], // RWristSize(4)
                        [0.2, 0.2, 0.2] // RHandSize(5)	

                    ];
                }
                ;
                /**
                 * translation
                 **/
                {
                    // head
                    var headSkeletonTrans = [0.0, 1.0, 0.0];
                    var faceTranslate = [0.0, 0.175, 0.0];
                    var neckTranslate = [0.0, 0.0, 0.0];
                    // torso
                    var torsoTranslate = [0.0, 0.65, 0.0];
                    // leftArm
                    var leftArmSkeletonTrans = [-0.27, 0.925, 0.0, ];
                    var leftArmTranslate = [[0.0, 0.0, 0.0], // LShoulderJointTranslate(0)
                        [-0.09, -0.125, 0.0], // LUpperarmTranslate(1)
                        [-0.09, -0.325, 0.0], // LEllbowTranslate(2)
                        [0.0, -0.2, 0.0], // LForearmTranslate(3)
                        [0.0, 0.0, 0.0], // LWristTranslate(4)
                        [0.0, -0.1, 0.0] // LHandTranslate(5)
                    ];
                    var leftHandTranslate = [0.0, -0.35, 0.0];
                    // rightArm
                    var rightArmSkeletonTrans = [0.27, 0.925, 0.0, ];
                    var rightArmTranslate = [[0.0, 0.0, 0.0], // RShoulderJointTranslate(0)
                        [0.09, -0.125, 0.0], // RUpperarmTranslate(1)
                        [0.09, -0.325, 0.0], // REllbowTranslate(2)
                        [0.0, -0.2, 0.0], // RForearmTranslate(3)
                        [0.0, 0.0, 0.0], // RWristTranslate(4)
                        [0.0, -0.1, 0.0] // RHandTranslate(5)
                    ];
                    var rightHandTranslate = [0.0, -0.35, 0.0];
                }
                ;
                /**
                 * rotation
                 **/
                {
                    // head
                    var faceRotation = {degree: Math.PI / 2, axis: "[ 0, 1, 0 ]"};
                    var neckRotation = {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"};
                    // torso
                    var torsoRotation = {degree: Math.PI / 2, axis: "[ 1, 0, 0 ]"};
                    // leftArm
                    var leftArmRotate = [{degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // LShoulderJointRotate(0)
                        {degree: Math.PI / 2, axis: "[ 0, 1, 0 ]"}, // LUpperarmRotate(1)
                        {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // LEllbowRotate(2)
                        {degree: Math.PI / 2, axis: "[ 0, 1, 0 ]"}, // LForearmRotate(3)
                        {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // LWristRotate(4)
                        {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // LHandRotate(5)
                    ];
                    // rightArm
                    var rightArmRotate = [{degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // RShoulderJointRotate(0)
                        {degree: Math.PI / 2, axis: "[ 0, 1, 0 ]"}, // RUpperarmRotate(1)
                        {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // REllbowRotate(2)
                        {degree: Math.PI / 2, axis: "[ 0, 1, 0 ]"}, // RForearmRotate(3)
                        {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // RWristRotate(4)
                        {degree: Math.PI / 2, axis: "[ 0, 0, 1 ]"}, // RHandRotate(5)
                    ];
                }
                ;
                // skeleton for the torso - TODO connect shoulders and neck HERE
                this.torso = new SceneNode("torso");
                // skin for the torso: a cube...
                {
                    var torsoSkin = new SceneNode("torso skin");

                    torsoSkin.add(cube, color);
                    mat4.translate(torsoSkin.transform(), torsoTranslate);
                    mat4.scale(torsoSkin.transform(), torsoSize);
                    mat4.rotate(torsoSkin.transform(), eval(torsoRotation.degree), eval(torsoRotation.axis));
                    // connect skeleton + skin
                    this.torso.add(torsoSkin);
                }
                ;
                // Head skeleton
                {
                    var headNeck = new SceneNode("Head skeleton");
                    mat4.translate(headNeck.transform(), headSkeletonTrans);
                    {
                        var faceSkin = new SceneNode("Face skin");
                        faceSkin.add(cube, color);
                        mat4.translate(faceSkin.transform(), faceTranslate);
                        mat4.scale(faceSkin.transform(), faceSize);
                        mat4.rotate(faceSkin.transform(), eval(faceRotation.degree), eval(faceRotation.axis));
                        var LEyeSkin = new SceneNode("left eye skin");
                        LEyeSkin.add(triangle, color);
                        mat4.translate(LEyeSkin.transform(), [-0.06, 0.22, 0.16]);
                        mat4.scale(LEyeSkin.transform(), [0.05, 0.05, 0.05]);
                        var REyeSkin = new SceneNode("left eye skin");
                        REyeSkin.add(triangle, color);
                        mat4.translate(REyeSkin.transform(), [0.06, 0.22, 0.16]);
                        mat4.scale(REyeSkin.transform(), [0.05, 0.05, 0.05]);
                        var mouthSkin = new SceneNode("mouth skin");
                        mouthSkin.add(band, blue);
                        mat4.translate(mouthSkin.transform(), [0.0, 0.1, 0.15]);
                        mat4.scale(mouthSkin.transform(), [0.1, 0.05, 0.1]);
                        var neckSkin = new SceneNode("Neck skin");
                        neckSkin.add(band, red);
                        mat4.scale(neckSkin.transform(), neckSize);
                        headNeck.add(REyeSkin);
                        headNeck.add(LEyeSkin);
                        headNeck.add(mouthSkin);
                        headNeck.add(faceSkin);
                        headNeck.add(neckSkin);
                    }
                    ;
                    this.torso.add(headNeck);
                }
                ;
                /**
                 * -- left arm 
                 */
                {
                    var leftArm = new SceneNode("Left arm");
                    mat4.translate(leftArm.transform(), leftArmSkeletonTrans);
                    // left upperarm skeleton
                    {

                        var leftUpperarm = new SceneNode("left upperarm skeleton");
                        //mat4.translate(leftUpperarm.transform(), [0,0,0]);

                        {
                            var LShoulderJointSkin = new SceneNode("left shoulder joint skin");
                            LShoulderJointSkin.add(band, blue);
                            mat4.scale(LShoulderJointSkin.transform(), leftArmSize[0]);
                            mat4.rotate(LShoulderJointSkin.transform(), eval(leftArmRotate[0].degree), eval(leftArmRotate[0].axis));
                            var LUpperarmSkin = new SceneNode("left upperarm skin");
                            LUpperarmSkin.add(cube, color);
                            mat4.translate(LUpperarmSkin.transform(), leftArmTranslate[1]);
                            mat4.scale(LUpperarmSkin.transform(), leftArmSize[1]);
                            mat4.rotate(LUpperarmSkin.transform(), eval(leftArmRotate[1].degree), eval(leftArmRotate[1].axis));
                            leftUpperarm.add(LShoulderJointSkin);
                            leftUpperarm.add(LUpperarmSkin);
                        }
                        ;
                        leftArm.add(leftUpperarm);
                    }
                    ;
                    // --left forearm skeleton 
                    {
                        var leftForearm = new SceneNode("left ellbow skeleton");
                        mat4.translate(leftForearm.transform(), leftArmTranslate[2]);
                        {
                            var LEllbowSkin = new SceneNode("left ellbow joint skin");
                            LEllbowSkin.add(band, blue);
                            mat4.scale(LEllbowSkin.transform(), leftArmSize[2]);
                            mat4.rotate(LEllbowSkin.transform(), eval(leftArmRotate[2].degree), eval(leftArmRotate[2].axis));
                            var LForearmSkin = new SceneNode("left forearm skin");
                            LForearmSkin.add(cube, color);
                            mat4.translate(LForearmSkin.transform(), leftArmTranslate[3]);
                            mat4.scale(LForearmSkin.transform(), leftArmSize[3]);
                            mat4.rotate(LForearmSkin.transform(), eval(leftArmRotate[3].degree), eval(leftArmRotate[3].axis));
                            leftForearm.add(LEllbowSkin);
                            leftForearm.add(LForearmSkin);
                        }
                        ;
                        // left hand Skeleton
                        {
                            var leftHand = new SceneNode("Left hand skeleton");
                            mat4.translate(leftHand.transform(), leftHandTranslate);
                            {
                                var LWristSkin = new SceneNode("Left wrist skin");
                                LWristSkin.add(band, red);
                                mat4.scale(LWristSkin.transform(), leftArmSize[4]);
                                mat4.rotate(LWristSkin.transform(), eval(leftArmRotate[4].degree), eval(leftArmRotate[4].axis));
                                var LHandSkin = new SceneNode("Left hand skin");
                                LHandSkin.add(triangle, color);
                                mat4.translate(LHandSkin.transform(), leftArmTranslate[5]);
                                mat4.scale(LHandSkin.transform(), leftArmSize[5]);
                                leftHand.add(LWristSkin);
                                leftHand.add(LHandSkin);
                            }
                            ;
                            leftForearm.add(leftHand);
                        }
                        ;
                        leftArm.add(leftForearm);
                    }
                    ;
                    this.torso.add(leftArm);
                }
                ;
                /**
                 * -- right arm
                 */
                {
                    var rightArm = new SceneNode("right arm");
                    mat4.translate(rightArm.transform(), rightArmSkeletonTrans);
                    // right upperarm skeleton
                    {
                        var rightUpperarm = new SceneNode("right upperarm skeleton");
                        {
                            var RShoulderJointSkin = new SceneNode("right shoulder joint skin");
                            RShoulderJointSkin.add(band, blue);
                            mat4.scale(RShoulderJointSkin.transform(), rightArmSize[0]);
                            mat4.rotate(RShoulderJointSkin.transform(), eval(rightArmRotate[0].degree), eval(rightArmRotate[0].axis));
                            var RUpperarmSkin = new SceneNode("right upperarm skin");
                            RUpperarmSkin.add(cube, color);
                            mat4.translate(RUpperarmSkin.transform(), rightArmTranslate[1]);
                            mat4.scale(RUpperarmSkin.transform(), rightArmSize[1]);
                            mat4.rotate(RUpperarmSkin.transform(), eval(rightArmRotate[1].degree), eval(rightArmRotate[1].axis));
                            rightUpperarm.add(RShoulderJointSkin);
                            rightUpperarm.add(RUpperarmSkin);
                        }
                        ;
                        rightArm.add(rightUpperarm);
                    }
                    ;
                    // right forearm skeleton
                    {
                        var rightForearm = new SceneNode("right ellbow skeleton");
                        mat4.translate(rightForearm.transform(), rightArmTranslate[2]);
                        {
                            var REllbowSkin = new SceneNode("right ellbow joint skin");
                            REllbowSkin.add(band, blue);
                            mat4.scale(REllbowSkin.transform(), rightArmSize[2]);
                            mat4.rotate(REllbowSkin.transform(), eval(rightArmRotate[2].degree), eval(rightArmRotate[2].axis));
                            var RForearmSkin = new SceneNode("right forearm skin");
                            RForearmSkin.add(cube, color);
                            mat4.translate(RForearmSkin.transform(), rightArmTranslate[3]);
                            mat4.scale(RForearmSkin.transform(), rightArmSize[3]);
                            mat4.rotate(RForearmSkin.transform(), eval(rightArmRotate[3].degree), eval(rightArmRotate[3].axis));
                            rightForearm.add(REllbowSkin);
                            rightForearm.add(RForearmSkin);
                        }
                        ;
                        // right hand Skeleton
                        {
                            var rightHand = new SceneNode("right hand skeleton");
                            mat4.translate(rightHand.transform(), rightHandTranslate);
                            {
                                var RWristSkin = new SceneNode("right wrist skin");
                                RWristSkin.add(band, red);
                                mat4.scale(RWristSkin.transform(), rightArmSize[4]);
                                mat4.rotate(RWristSkin.transform(), eval(rightArmRotate[4].degree), eval(rightArmRotate[4].axis));
                                var RHandSkin = new SceneNode("right hand skin");
                                RHandSkin.add(triangle, color);
                                mat4.translate(RHandSkin.transform(), rightArmTranslate[5]);
                                mat4.scale(RHandSkin.transform(), rightArmSize[5]);
                                rightHand.add(RWristSkin);
                                rightHand.add(RHandSkin);
                            }
                            ;
                            rightForearm.add(rightHand);
                        }
                        ;
                        rightArm.add(rightForearm);
                    }
                    ;
                    this.torso.add(rightArm);
                }
                ;
                // an entire robot
                mat4.translate(this.torso.transform(), [0, -0.5, 0]);
            };
            // the scene's draw method draws whatever the scene wants to draw
            Robot.prototype.draw = function(gl, program, transformation) {

                this.torso.draw(gl, program, transformation);

            };

            return Robot;

        }));
