/*
 *
 * Module: bezier_curve
 *
 */


/* requireJS module definition */
define(["jquery", "util", "vec2", "scene", "point_dragger", "parametric_curves", "straight_line"],
        (function($, Util, vec2, Scene, PointDragger, ParaCurve, StraightLine) {



            "use strict";

            var BezierCurve = function(p0, p1, p2, p3, para) {

                this.p0 = p0 || [30, 320];
                this.p1 = p1 || [240, 80];
                this.p2 = p2 || [400, 200];
                this.p3 = p3 || [300, 280];
                this.para = para;
                this.lineStyle = para.lineStyle || {width: "2", color: "#0000AA"};
                this.marks = para.marks || true;
                this.min_t = para.min_t || 0;
                this.max_t = para.max_t || 1;
                this.segment = para.segment;
                this.draggerStyle = {width: "2", color: "#0000FF"};
                this.newDrag = {width: "3", color: "##FF0000"};



                console.log("creating parametric curve: " +
                        "\nt_min " + this.min_t +
                        "\nt_max " + this.max_t +
                        "\nsegments " + this.segment);

                var p0 = this.p0;
                var p1 = this.p1;
                var p2 = this.p2;
                var p3 = this.p3;


                BezierCurve.prototype.parA = this.para;
                BezierCurve.prototype.straightDrag = new StraightLine(p0, p3, this.draggerStyle);
                BezierCurve.prototype.newDrag = new StraightLine(p1, p2, this.draggerStyle);
                BezierCurve.parA.draw();
                BezierCurve.parA.isHit();
                //  BezierCurve.para.draw();

                BezierCurve.straightDrag.createDraggers();
                BezierCurve.straightDrag.isHit();

                BezierCurve.newDrag.createDraggers();


            };

            return BezierCurve;

        })); // define