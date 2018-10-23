//Logic for Line Graph initially sourced from Pranita Ramakrishna - "Simple Line Graph Manipulated Using a Slider"
//Source: http://bl.ocks.org/pranitar/01305d9ad0eba73dbf80
//Accessed: 19th October 2018
//Edited for current usage and implementation by Alessandro Barbosa
var dataGathered = [];
var dps = [];
var metric = '';
var canDisplayGraphs = false;
var graphAlreadyDisplayed = false;
function lineToggle()
{
    //document.getElementById("content").innerHTML='<object type="text/html" data="/cdn/sliderGraph.html" height="100%" width="100%" ></object>';
    if(canDisplayGraphs) {
        document.getElementById("contentLineGraph").style.display = "block";
        document.getElementById("contentSunburstGraph").style.display = "none";
        DisplayGraph();
        graphAlreadyDisplayed = true;
        graph = "lineGraph";
    }
}

function FillGraphData(resp)
{
    dataGathered = resp;
    dps = dataGathered[5][0].dps;
    metric = dataGathered[5][0].metric;
}

function testData()
{
    //console.log(dataGathered);
}

function AllowGraphDisplay()
{
    canDisplayGraphs = true;
}

function DisplayGraph()
{
    if(!graphAlreadyDisplayed) {
        /* implementation heavily influenced by http://bl.ocks.org/1166403 */

        // define dimensions of graph
        testData();
        var m = [80, 80, 80, 80]; // margins
        var w = 1000 - m[1] - m[3]; // width
        var h = 400 - m[0] - m[2]; // height

        // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
        var data = [0];
        //for (var i = 1; i < 1000; i++) {
            //var sign = Math.random() > 0.5 ? +1 : -1;
            //data.push(data[i - 1] + sign * Math.random());
        //}

        for(var i = 0; i < dataGathered[5][0].dps.length; i++)
        {
            data.push(dataGathered[5][0].dps[i][1]);
        }

        // X scale will fit all values from data[] within pixels 0-w
        var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
        // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
        var y = d3.scale.linear().domain([d3.min(data), d3.max(data)]).range([h, 0]);
        // automatically determining max range can work something like this
        // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

        // create a line function that can convert data[] into x and y points
        var line = d3.svg.line().interpolate("monotone")
        // assign the X function to plot our line as we wish
            .x(function (d, i) {
                // verbose logging to show what's actually being done
                // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
                // return the X coordinate where we want to plot this datapoint
                return x(i);
            })
            .y(function (d) {
                // verbose logging to show what's actually being done
                // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
                // return the Y coordinate where we want to plot this datapoint
                return y(d);
            });

        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select("#graph").append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(3);
        // Add the x-axis.
        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);

        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);

        var clip = graph.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("id", "clip-rect")
            .attr("x", "0")
            .attr("y", "0")
            .attr("width", w)
            .attr("height", h);


        // Add the line by appending an svg:path element with the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        var path = graph.append("svg:path")
            .attr("class", "path")
            .attr("clip-path", "url(#clip)")
            .attr("d", line(data));

        function zoom(begin, end) {
            x.domain([begin, end - 1]);

            var t = graph.transition().duration(0);

            var size = end - begin;
            var step = size / 10;
            var ticks = [];
            for (var i = 0; i <= 10; i++) {
                ticks.push(Math.floor(begin + step * i));
            }

            xAxis.tickValues(ticks);

            t.select(".x.axis").call(xAxis);
            t.select('.path').attr("d", line(data));
        }

        $(function () {
            $("#slider-range").slider({
                range: true,
                min: 0,
                max: data.length,
                values: [0, data.length],
                slide: function (event, ui) {
                    var begin = d3.min([ui.values[0], data.length]);
                    var end = d3.max([ui.values[1], 0]);
                    //console.log("begin:", begin, "end:", end);

                    zoom(begin, end);
                }
            });
        });
    }
}

