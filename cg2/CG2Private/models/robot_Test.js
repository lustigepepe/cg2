
/* requireJS module definition */
define(["scene_node", "models/cube"],
        (function(SceneNode, Cube) {

            "use strict";

            /*
             *  This function asks the HTML Canvas element to create
             *  a context object for WebGL rendering.
             *
             *  It also creates a wrapper around it for debugging 
             *  purposes, using webgl-debug.js
             *
             */
            var RobotTest = function(gl, programs) {
                var cube = new Cube(gl);
                var headSize = [0.3, 0.35, 0.3];
                var torsoSize = [0.6, 1.0, 0.4];

                var head = new SceneNode("head");
                mat4.translate(head.transform(), [0, torsoSize[1] / 2+ headSize[1] / 2, 0]);
                this.torso = new SceneNode("torso");
                this.torso.add(head);

                var torsoSkin = new SceneNode("torso skin");
                torsoSkin.add(cube, programs.vertexColor);
                mat4.scale(torsoSkin.transform(), torsoSize);
                var headSkin = new SceneNode("head skin");
                headSkin.add(cube, programs.vertexColor);
                mat4.rotate(headSkin.transform(), 0.6 * Math.PI, [0, 1, 0]);
                mat4.scale(headSkin.transform(), headSize);

                this.torso.add(torsoSkin);
                head.add(headSkin);



            };
            RobotTest.prototype.draw = function(gl, program, transformation) {

                this.torso.draw(gl, program, transformation);
            };

            return RobotTest;

        }));