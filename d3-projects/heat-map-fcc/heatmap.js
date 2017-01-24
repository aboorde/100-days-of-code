// set dimensions and margins of map
var margin = { top: 40, right: 20, bottom: 40, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];

//set the ranges
//var x = d3.scaleLinear().range([0, width]),
//    y = d3.scaleLinear().range([height,0]);

var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

var formatYear = function(d) { console.log(d); return d; };
//var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border","1px solid black")
    .style("margin-top", "10px")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
    if(error) throw error;

    var baseTemperature = data.baseTemperature;
    var heatData = data.monthlyVariance;
    heatData.forEach(function(d) {
        d.month = +d.month;
        d.variance = +d.variance;
        console.log(d.variance*100);
        d.year = +d.year;
        d.date = new Date(d.year,d.month-1);
    });

    var minVariance = d3.min(heatData, function(d) { return d.variance; });
    var maxVariance = d3.max(heatData, function(d) { return d.variance; });

    var x = d3.scaleTime()
        .range([10,width-15])
    var y = d3.scaleLinear().range([height, 40]);
    x.domain([d3.min(heatData, function(d) { return d.date; }), d3.max(heatData, function(d) { return d.date; })]);
    y.domain([d3.min(heatData, function(d) { return d.month; }), d3.max(heatData, function(d) { return d.month; })]);
    
    var colorScale = d3.scaleQuantile()
                .domain([0,8,d3.max(heatData, function(d) { return d.variance * 100; })])
                .range(colors);

    var cellWidth = Math.floor(width/(d3.max(heatData, function(d) { return d.year; }) - d3.min(heatData, function(d) { return d.year; })));
    var cellHeight = Math.floor((height) / 12) ; 
    // Create heatmap
    var heatMap = svg.selectAll('rect')
        .data(heatData)
        .enter()
        .append('rect')
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.date); })
        .attr("value", function(d) { return d.variance*100; })
        .attr("y", function(d) { return y(d.month) - cellHeight; })
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr('fill', function(d) { return colorScale(d.variance * 100); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.variance + "<br/>" + d.month + ", " + d.year)
                .style("left", 550 + "px")
                .style("top", 350 + "px");
            })
            .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            });

     // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(5)
            .tickFormat(d3.timeFormat("%Y"))
            );

     // Add the Y Axis
    svg.append("g")
        .attr("transform", "translate(0," + (cellHeight / 2 * -1) + ")")
        .attr("class", "no-line")
        .call(d3.axisLeft(y)
            .tickPadding(0)
            .tickSize(0,6,0)
            );
});