/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "straight_line", "circle_line", "parametric_curves", "bezier_curve"],
        (function($, StraightLine, CircleLine, ParaCurve, BezierCurve) {

            "use strict";
            /*
             * define callback functions to react to changes in the HTML page
             * and provide them with a closure defining context and scene
             */
            var HtmlController = function(context, scene, sceneController) {


                // random min_t and max_t
                var randomMinMax_t = function() {
                    var mini = Math.floor(Math.random() * 50);
                    var maxi = Math.floor(Math.random() * 50);
                    var t_min = Math.min(mini, maxi);
                    var t_max = Math.max(mini, maxi);

                    return [t_min, t_max];
                };

                // random amount of segments 
                var randomIntValue = function(min, max) {
                    var delta = max - min;
                    return (Math.floor(Math.random() * delta)) + min;
                };

                // generate random X coordinate within the canvas
                var randomX = function() {
                    return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
                };
                // generate random Y coordinate within the canvas
                var randomY = function() {
                    return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
                };
                // generate a good scaled radius
                var randomR = function() {
                    return Math.floor((Math.random() * (context.canvas.height - 10)) + 5) / 3;
                };
                // generate random color in hex notation
                var randomColor = function() {

                    // convert a byte (0...255) to a 2-digit hex string
                    var toHex2 = function(byte) {
                        var s = byte.toString(16); // convert to hex string
                        if (s.length == 1)
                            s = "0" + s; // pad with leading 0
                        return s;
                    };
                    var r = Math.floor(Math.random() * 25.9) * 10;
                    var g = Math.floor(Math.random() * 25.9) * 10;
                    var b = Math.floor(Math.random() * 25.9) * 10;
                    // convert to hex notation
                    return "#" + toHex2(r) + toHex2(g) + toHex2(b);
                };
                /*
                 * event handler for "new line button".
                 */
                $("#btnNewCircle").click((function() {

                    // create the actual line and add it to the scene
                    var style = {
                        width: Math.floor(Math.random() * 3) + 1,
                        color: randomColor()
                    };
                    var circle = new CircleLine([randomX(), randomY()], parseInt(randomR()), style);
                    scene.addObjects([circle]);
                    // deselect all objects, then select the newly created object
                    sceneController.deselect();
                    sceneController.select(circle);
                    // this will also redraw

                }));
                $("#btnNewLine").click((function() {

                    // create the actual line and add it to the scene
                    var style = {
                        width: Math.floor(Math.random() * 3) + 1,
                        color: randomColor()
                    };
                    var line = new StraightLine([randomX(), randomY()],
                            [randomX(), randomY()],
                            style);
                    scene.addObjects([line]);
                    // deselect all objects, then select the newly created object
                    sceneController.deselect();
                    sceneController.select(line);
                    // this will also redraw


                }));

                /*
                 * event handler for "BezierCurve".
                 */

                $("#btnNewBezierC").click((function() {

                    var style = {
                        width: Math.floor(Math.random() * 3) + 1,
                        color: randomColor()
                    };
                    var x = randomX();
                    var y = randomY();

                    var p0 = [30 + x, 320];
                    var p1 = [240, 80];
                    var p2 = [400, 200 - y];
                    var p3 = [300, 280];
                    var segments = 60;
                    var minMin_t = 0;
                    var minMax_t = 1;
                    var x = "(Math.pow((1-t),3)*p0[0])+(3*t*Math.pow((1-t),2)*p1[0])+(3*(1-t)*Math.pow(t,2)*p2[0])+(Math.pow(t,3)*p3[0])";
                    var y = "(Math.pow((1-t),3)*p0[1])+(3*t*Math.pow((1-t),2)*p1[1])+(3*(1-t)*Math.pow(t,2)*p2[1])+(Math.pow(t,3)*p3[1])";
                    var marks = true;

                    var para = new ParaCurve(minMin_t, minMax_t, x, y, segments, style, marks);
                  //  var beziercurve = new BezierCurve(p0, p1, p2, p3, para);

                    scene.addObjects([para]);

                    sceneController.deselect();
                    sceneController.select(para);

                }));

                /*
                 * event handler for "parametric curve button".
                 */
                $("#btnNewParaCurve").click((function() {

                    // create the actual line and add it to the scene
                    var style = {
                        width: Math.floor(Math.random() * 3) + 1,
                        color: randomColor()
                    };

                    var x = randomX();
                    var y = randomY();

                    var minMax_t = randomMinMax_t();
                    var f_t = x + "+100*Math.sin(t)";
                    var g_t = y + "+100*Math.cos(t)";
                    var marks = true;
                    var paraCurve = new ParaCurve(minMax_t[0], minMax_t[1], f_t, g_t, randomIntValue(5, 30), style, marks);
                    console.log(paraCurve);
                    scene.addObjects([paraCurve]);

                    // deselect all objects, then select the newly created object
                    sceneController.deselect();
                    sceneController.select(paraCurve); // this will also redraw

                }));






                /*
                 *show properties of selected Object		
                 */
                var showSelectedProps = function() {

                    var obj = sceneController.getSelectedObject();
                    $(".newProps").hide();
                    if (obj instanceof CircleLine) {
                        $("#circleCircle").show();
                    }
                    ;
                    if (obj instanceof ParaCurve) {
                        $("#paraCurveProps").show();
                    }
                    ;
                    if (obj instanceof BezierCurve) {
                        $("#paraCurveProps").show();
                        $("#circleCircle").show();


                    }
                    ;

                    $(".input").change(getInputField);
                    $(".newProps").change(getInputField);
                    setInputField();
                };
                /*
                 * get Value of the input field and update the object
                 */
                var getInputField = function() {

                    var obj = sceneController.getSelectedObject();
                    obj.lineStyle.color = ($("#ipColor").attr("value"));
                    obj.lineStyle.width = parseInt($("#ipLineWidth").attr("value"));

                    if (obj instanceof CircleLine) {
                        console.log("Hallo");
                        obj.r = parseFloat($("#circRadius").attr("value"));
                    }
                    ;
                    if (obj instanceof ParaCurve) {

                        obj.min_t = parseInt($("#ipParaCurveMinT").attr("value"));
                        obj.max_t = parseInt($("#ipParaCurveMaxT").attr("value"));
                        obj.segment = parseInt($("#ipParaCurveSeg").attr("value"));
                        obj.f_t = $("#ipParaCurveX_t").attr("value");
                        obj.g_t = $("#ipParaCurveY_t").attr("value");
                        obj.marks = $("#cbParaCurve").is("checked");

                        console.log(obj.f_t + " \n" + obj.g_t);

                    }
                    ;
                    if (obj instanceof BezierCurve) {


                        obj.segment = parseInt($("#ipParaCurveSeg").attr("value"));
                        obj.f_t = $("#ipParaCurveX_t").attr("value");
                        obj.g_t = $("#ipParaCurveY_t").attr("value");
                        obj.marks = $("#cbParaCurve").is(":checked");
                        obj.r = parseFloat($("#circRadius").attr("value"));

                        console.log(obj.f_t + " \n" + obj.g_t);

                    }
                    ;
                    sceneController.scene.draw(context);
                };
                /*
                 * passing the value of the object to the input field
                 */
                var setInputField = function() {

                    var obj = sceneController.getSelectedObject();
                    $("#ipLineWidth").attr("value", parseFloat(obj.lineStyle.width));
                    $("#ipColor").attr("value", obj.lineStyle.color);
                    if (obj instanceof CircleLine) {

                        $("#circRadius").attr("value", parseFloat(obj.r));
                    }
                    ;
                    if (obj instanceof ParaCurve) {

                        $("#ipParaCurveMinT").attr("value", parseInt(obj.min_t));
                        $("#ipParaCurveMaxT").attr("value", parseInt(obj.max_t));
                        $("#ipParaCurveSeg").attr("value", parseInt(obj.segment));
                        $("#ipParaCurveX_T").attr("value", obj.f);
                        $("#ipParaCurveY_T").attr("value", obj.g);


                    }
                    ;
                    if (obj instanceof BezierCurve) {

                        $("#ipParaCurveMinT").attr("value", parseInt(obj.min_t));
                        $("#ipParaCurveMaxT").attr("value", parseInt(obj.max_t));
                        $("#ipParaCurveSeg").attr("value", parseInt(obj.segment));
                        $("#ipParaCurveX_T").attr("value", obj.f);
                        $("#ipParaCurveY_T").attr("value", obj.g);
                        $("#circRadius").attr("value", parseFloat(obj.r));

                    }
                    ;

                };
                sceneController.onSelection(showSelectedProps);
                sceneController.onObjChange(setInputField);
            };
            (function init() {
                $(".newProps").hide();
            })();
            // return the constructor function 
            return HtmlController;
        })); // require 




