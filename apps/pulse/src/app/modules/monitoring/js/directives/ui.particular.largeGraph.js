(function(window, angular, d3) {
    'use strict';

    var firstAverageTooltip = $('.avg-tooltip');

    // var tooltip = d3.select("body")
	// .append("div")
    // .attr('class','avg-tooltip')
	// .style("position", "absolute")
	// .style("z-index", "10")
	// //.style("visibility", "hidden")
	// .text("a simple lable");

    function drawDataSeries(chart, data, color, fillColor, scaleX, scaleY) {

        var area = d3.area()
            .x(function (d, i) { return scaleX(i);})
            .y(function (d)    { return scaleY(d); })
            .y1(function ()    { return scaleY(0); })
            .curve(d3.curveLinear);

        var line = d3.line()
            .x(function (d, i) { return scaleX(i);})
            .y(function (d, i) { return scaleY(d);})
            .curve(d3.curveLinear);

        var group = chart.append('g').attr('class', 'dataSeries');

        var p = group.append('path')
            .datum(data.points)
            .attr('d', area)
            .attr('fill', fillColor)
            .attr('opacity', 0.8)
            .attr('stroke', fillColor);

        group.append('path')
            .datum(data.points)
            .attr('d', line)
            .attr('stroke', color)
            .attr('stroke-width', 2.75)
            .attr('fill', 'none');
    }

    function drawAverageLine(chart, data, color, fillColor, scaleX, scaleY) {

        var line = d3.line()
            .x(function (d, i) { return scaleX(i); })
            .y(function (d, i) { return scaleY(d); })
            .curve(d3.curveLinear);

        var group = chart.append('g').attr('class', 'dataAverage');

        var avgLine = group.append('path')
            .datum(Array(data.points.length).fill(data.average))
            .attr('d', line)
            .attr('stroke', color)
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.5)
            .attr('stroke-dasharray', '10,10');
            
        return group;
    }

    function padToWholeValue(value) {
        var emptyDataSetyAxisMax = 10;

        if (!value) {
            return emptyDataSetyAxisMax;
        }

        var upperBound = 10;

        while (value > upperBound) {
            upperBound *= 10;
        }

        upperBound /= 10;

        return Math.floor(value / upperBound) * upperBound + upperBound;
    }

    angular.module('ui.particular.largeGraph', [])
        .directive('largeGraph',
            function(formatter) {
                return {
                    restrict: 'E',
                    scope: {
                        firstDataSeries: '=firstDataSeries',
                        secondDataSeries: '=secondDataSeries',
                        isDurationGraph: '=isDurationGraph',
                        minimumYaxis: '@',
                        width: '=plotWidth',
                        height: '=plotHeight'
                    },
                    template: '<svg></svg>',
                    link: function link(scope, element, attrs) {                       

                        scope.$watch('firstDataSeries', function () {

                            var svg = element.find('svg')[0];

                            d3.select(svg).selectAll('*').remove();

                            var topMargin = 10;
                            var bottomMargin = 5;
                            var leftMargin = 60;

                            var chart = d3.select(svg)
                                .attr('width', scope.width)
                                .attr('height', scope.height);

                            var width = svg.clientWidth;
                            var height = svg.clientHeight;

                            //HINT: This is workaround for Firefox
                            if (width === 0) {
                                var box = svg.getBoundingClientRect();

                                width = box.right - box.left;
                                height = box.bottom - box.top;
                            }

                            var firstSeries = scope.firstDataSeries;
                            var secondSeries = scope.secondDataSeries;

                            var amountOfValues = Math.max(firstSeries.points.length, secondSeries ? secondSeries.points.length : 0) || 10;
                            if (firstSeries.points.length === 0) {
                                firstSeries.points = new Array(amountOfValues).fill(0);
                            }
                            var scaleX = d3.scaleLinear()
                                .domain([0, amountOfValues - 1])
                                .range([leftMargin, width]);

                            chart.append('rect')
                                .attr('width', width - leftMargin)
                                .attr('height', height - topMargin - bottomMargin)
                                .attr('transform', 'translate(' + leftMargin + ',' + topMargin + ')')
                                .attr('fill', '#F2F6F7');

                            var minimumYaxis = !isNaN(scope.minimumYaxis) ? Number(scope.minimumYaxis) : 10;
                            var max = Math.max(firstSeries.average, firstSeries.points.length > 0 ? d3.max(firstSeries.points) : 0, minimumYaxis);

                            if (secondSeries && secondSeries.points.length > 0) {
                                max = Math.max(max, secondSeries.average, d3.max(secondSeries.points));
                            }

                            max = padToWholeValue(max);

                            var scaleY = d3.scaleLinear()
                                .domain([0, max])
                                .range([height - bottomMargin, topMargin]);

                            var yAxis = d3.axisLeft(scaleY) 
                                .tickValues([0, max * 1/4, max * 1/2, max * 3/4, max]);

                            if (scope.isDurationGraph) {
                                yAxis = yAxis.tickFormat(function (v) {
                                    var formattedTime = formatter.formatTime(v);

                                    return formattedTime.value + '  ' + formattedTime.unit;
                                });
                            }

                            chart.append('g')
                                .attr('class', 'y axis')
                                .attr('transform', 'translate(' + leftMargin + ', 0)')
                                .call(function (g) {
                                    g.call(yAxis);
                                    g.select('.domain').remove();
                                    g.selectAll('.tick line').attr('stroke', 'black').attr('stroke-width', '1.75').attr('opacity', 0.1).attr('x', 0).attr('x2', width - leftMargin);
                                    g.selectAll('.tick text').attr('x', -4).attr('fill', '#828282');
                                });

                            var drawSeries = function(data, lineColor, fillColor) {
                                drawDataSeries(chart, data, lineColor, fillColor, scaleX, scaleY);
                            }

                            var drawAverage = function(data, lineColor, fillColor) {
                                return drawAverageLine(chart, data, lineColor, fillColor, scaleX, scaleY);
                            }

                            drawSeries(firstSeries, attrs.firstSeriesColor, attrs.firstSeriesFillColor);

                            if (secondSeries) {
                                drawSeries(secondSeries, attrs.secondSeriesColor,attrs.secondSeriesFillColor);
                            }

                            var firstAverageLine = drawAverage(firstSeries, attrs.firstSeriesColor, attrs.firstSeriesFillColor );

                            chart
                            .on("mouseover", mouseOver(d3,chart,firstAverageLine))
                            //                     //.on("mousemove", function(){return tooltip.style("top", avgLine.node().getBoundingClientRect().y+"px").style("left",avgLine.node().getBoundingClientRect().x+"px");})
                            // .on("mousemove", )
                            //                     .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
                            //                     .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

                            // getBoundingClientRect

                            if (secondSeries && secondSeries.average > 0) {
                                drawAverage(secondSeries, attrs.secondSeriesColor, attrs.secondSeriesFillColor);
                            }
                        });
                    }
                };
            });

            function mouseOut(d3) {
                return function (d, i) {
                    d3.select(this).transition()
                        .duration('50')
                        .attr('opacity', '1');
                };
            }
            
            function mouseOver(d3, chart, firstAverageLine) {
                return function (d, i) {
                    var rect = firstAverageLine.node().getBoundingClientRect();
                    
                    var labelTipWidth = getComputedStyle(firstAverageTooltip[0],':before').width.replace('px','');
                    var labelTipHeight = getComputedStyle(firstAverageTooltip[0],':before').height.replace('px','');
                    var lalbeTipHypotenuce = Math.trunc(Math.hypot(labelTipWidth,labelTipHeight));
                    firstAverageTooltip.css('left','inherit');
                    firstAverageTooltip.css('top',rect.y - firstAverageTooltip.css('height').replace('px', '')/2);
                    firstAverageTooltip.css('right',`calc(100% - ${rect.x}px + ${lalbeTipHypotenuce/2}px)`);
                    
                };
            }

}(window, window.angular, window.d3));


