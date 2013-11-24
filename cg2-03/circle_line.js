/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Circle
 *
 * A Circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"],
        (function(Util, vec2, Scene, PointDragger) {

            "use strict";

            /**
             *  A simple circle that can be moved  
             *  
             *  Parameters:
             *  - point0: array objects representing [x,y] coordinates of the mid point of a circle
             *  - r: number representing the radius of a circle
             *  - lineStyle: object defining width and color attributes for line drawing, 
             *       begin of the form { width: 2, color: "#00FF00" }
             */

            var CircleLine = function(point0, radius, lineStyle) {


                console.log("creating a circle  from [" +
                        point0[0] + "," + point0[1] + "] with Radius: " + radius);


                // draw style for drawing the line
                this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

                // initial values in case either point is undefined
                this.p0 = point0 || [10, 20];
                this.r = radius || (30);

            };

            // draw this line into the provided 2D rendering context
            CircleLine.prototype.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.arc(this.p0[0], this.p0[1], this.r, 0.0, Math.PI * 2, true);
                context.closePath();

                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // actually start drawing
                context.stroke();

            };

            // test whether the mouse position is on the edge of the circle
            CircleLine.prototype.isHit = function(context, pos) {

                // distance of the point from the circle
                var d = vec2.length(vec2.sub(this.p0, pos));
                // allow 2 pixels extra "sensitivity"
                var s = (this.lineStyle.width / 2) + 2;
                // the biggest value sub the smallest, result the tolerance
                var t = Math.max(this.r, d) - math.min(this.r, d);
                // check if the tolerance acceptable
                return t <= s;

            };

            // return list of draggers to manipulate this line
            CircleLine.prototype.createDraggers = function() {

                var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
                var draggerStyle2 = {radius: 3, color: this.lineStyle.color, width: 0, fill: true};
                var draggers = [];

                var _circle = this;

                // dragger for midpoint
                var getP0 = function() {
                    return _circle.p0;
                };
                var setP0 = function(dragEvent) {
                    _circle.p0 = dragEvent.position;
                };

                // create closure and callbacks for dragger Circle
                var getP0Circle = function() {
                    return vec2.add(_circle.p0, [_circle.r, 0]);
                };

                var setP0Circle = function(dragEvent) {
                    // prevents the radius to drop under 20
                    if (_circle.r + dragEvent.delta[0] >= 20) {
                        _circle.r += dragEvent.delta[0];
                    }

                };
                draggers.push(new PointDragger(getP0, setP0, draggerStyle));
                draggers.push(new PointDragger(getP0Circle, setP0Circle, draggerStyle2));

                return draggers;

            };

            // this module only exports the constructor for StraightLine objects
            return CircleLine;

        })); // define


// JavaScript Document// JavaScript Document