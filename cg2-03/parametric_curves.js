/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"],
        (function(Util, vec2, Scene, PointDragger) {

            "use strict";
            /*		
             * @param f_t function f(t)
             * @param g_t function g(t)
             */

            var ParaCurve = function(min_t, max_t, f_t, g_t, segment, lineStyle, marks) {


                this.min_t = min_t || 0;
                this.max_t = max_t || 5;
                this.f = f_t || ("350+100*Math.sin(t)");
                this.g = g_t || ("150+100*Math.cos(t)");
                this.segment = segment || 20;
                this.point = [];
                this.marks = marks;
                console.log("creating parametric curve: " +
                        "\nt_min " + this.min_t +
                        "\nt_max " + this.max_t +
                        "\nmarks" +this.marks +
                        "\nsegments " + this.segment);

                // draw style for drawing the line
                this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
            };
            // draw this line into the provided 2D rendering context
            ParaCurve.prototype.draw = function(context) {

                try {
                    var t = 2;
                    var err = eval(this.f);
                    var err1 = eval(this.g);
                } catch (e) {
                    alert("The variable in her formel must have a -> t! ");
                    return;
                }

                context.beginPath();
                var deltaT = (this.max_t - this.min_t) / this.segment;
                for (var i = 0; i <= this.segment; i++) {
                    var t = (i * deltaT + this.min_t);
                    this.point[i] = [eval(this.f), eval(this.g)];
                }
                ;
                for (var i = 1; i <= this.segment; i++) {
                    context.moveTo(this.point[i - 1][0], this.point[i - 1][1]);
                    context.lineTo(this.point[i][0], this.point[i][1]);
                }
                ;
                // set drawing style
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                // actually start drawing
                context.stroke();
                if (this.marks) {

                    context.beginPath();
                    for (var i = 1; i <= this.segment; i++) {

                        var appr = vec2.sub(this.point[i], this.point[i - 1]);
                        var norm = [appr[1] * (-1), appr[0]];
                        var marker = vec2.mult(norm, 1 / 10);

                        var start = vec2.add(this.point[i - 1], marker);
                        var end = vec2.sub(this.point[i - 1], marker);

                        context.moveTo(start[0], start[1]);
                        context.lineTo(end[0], end[1]);

                    }
                    ;
                    // draw style

                    context.lineWidth = 1;
                    context.strokeStyle = "#FF1493";
                    // start drawing
                    context.stroke();
                }
            };
            ParaCurve.prototype.isHit = function(context, pos) {

                var b;

                for (var i = 1; i <= this.segment; i++) {

                    var p0 = this.point[i - 1];
                    var p1 = this.point[i];
                    // project point on line, get parameter of that projection point
                    var t = vec2.projectPointOnLine(pos, p0, p1);
                    // outside the line segment?
                    if (t < 0.0 || t > 1) {
                        return false;
                    }
                    // coordinates of the projected point 
                    var p = vec2.add(p0, vec2.mult(vec2.sub(p1, p0), t));
                    // distance of the point from the line
                    var d = vec2.length(vec2.sub(p, pos));
                    // allow 2 pixels extra "sensitivity"
                    if (d <= (this.lineStyle.width / 2) + 2) {
                        b = true;
                    } else {
                        b = false;
                    }
                    ;

                }


                return b;
            };


            // return list of draggers to manipulate this line
            ParaCurve.prototype.createDraggers = function() {
                return [];
            };
            // this module only exports the constructor for Circle objects
            return ParaCurve;
        })); // define


