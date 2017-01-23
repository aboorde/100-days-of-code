// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 40, left: 70},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%B %Y");

// set the ranges
var x = d3.scaleTime()
    .domain([new Date(1947,0,0), new Date(2015,7,0)])
    .rangeRound([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);

// define the line
var valueline = d3.line()
    .curve(d3.curveLinearClosed)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {
    if (error) throw error;
    var chartData = data.data;

    chartData.forEach(function(d) {
        d[0] = parseTime(d[0]);
        d[1] = +d[1];
    });

    var minDate = d3.min(chartData, function(d) { return d[0]; });
    var maxDate = d3.max(chartData, function(d) { return d[0]; });

    // Scale the range of the data in the y domain
    y.domain([0, d3.max(chartData, function(d) { return d[1]; })]);

    var barWidth = Math.ceil(width / chartData.length);
     svg.selectAll("rect")
      .data(chartData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(new Date(d[0])); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return height - y(d[1]); })
      .attr("width", barWidth)
      .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(formatTime(d[0]) + "<br/>" + "$" + d[1] + " Billion")
         .style("left", (d3.event.pageX) - 20 + "px")
         .style("top", (d3.event.pageY - 60) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // text label for the x axis
    svg.append("text")             
        .attr("x", 480 )
        .attr("y",  475 )
        .style("text-anchor", "middle")
        .text("Quarterly GDP");
    // Y Axis text
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("GDP (in billions of dollars)");
    
    // add a title
    svg.append("text")
        .attr("x", (width / 2))				
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")	
        .style("font-size", "20px") 
        .style("text-decoration", "underline") 	
        .text("Gross Domestic Product of The United States");
        
});