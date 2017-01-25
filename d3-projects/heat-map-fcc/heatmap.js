// set dimensions and margins of map
var margin = { top: 50, right: 120, bottom: 160, left: 160},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];
//var colors = d3.scaleOrdinal(d3.schemeCategory10);
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

function monthName(monthNum) {
    switch (monthNum) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
    }
}

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(error, data) {
    if(error) throw error;

    var baseTemperature = data.baseTemperature;
    var heatData = data.monthlyVariance;
    heatData.forEach(function(d) {
        d.month = +d.month;
        d.variance = +d.variance;
        d.year = +d.year;
        d.date = new Date(d.year,d.month-1);
        d.monthName = monthName(d.month);
        //console.log(d.monthName);
    });

    var minVariance = d3.min(heatData, function(d) { return d.variance; });
    var maxVariance = d3.max(heatData, function(d) { return d.variance; });

    var x = d3.scaleTime()
        .range([10,width-15])
    var y = d3.scaleLinear().range([height, 40]);
    x.domain([d3.min(heatData, function(d) { return d.date; }), d3.max(heatData, function(d) { return d.date; })]);
    y.domain([d3.min(heatData, function(d) { return d.month; }), d3.max(heatData, function(d) { return d.month; })]);
    
    var colorScale = d3.scaleQuantile()
                .domain([0,9,d3.max(heatData, function(d) { return baseTemperature + d.variance; })])
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
        .attr('fill', function(d) { return colorScale(baseTemperature + d.variance); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.year + " - " + d.monthName + "<br/>" + (baseTemperature + d.variance) + " &deg;C" + "<br/>" + d.variance + " &deg;C")
                .style("left", 900 + "px")
                .style("top", 500 + "px");
            })
            .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
            });

     // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "18px")
        .call(d3.axisBottom(x)
            .ticks(5)
            .tickFormat(d3.timeFormat("%Y"))
            //.tickSize(10,0,0)
            );

    // text label for the x axis
        svg.append("text")             
            .attr("x", 480 )
            .attr("y",  440 )
            .style("text-anchor", "middle")
            .style("font-weight", "600")
            .style("font-size", "18px")
            .text("Year");


     // Add the Y Axis
    svg.append("g")
        .attr("transform", "translate(0," + (cellHeight / 2 * -1) + ")")
        .attr("class", "no-line")
        .style("font-size", "12px")
        .call(d3.axisLeft(y)
            .tickPadding(0)
            .tickSize(0,6,0)
            //.ticks(d3.timeMonths)
            .tickFormat(function(d) { return monthName(d); })
            );

    // Y Axis text
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -100)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("font-size", "24px")
        .style("text-anchor", "middle")
        .text("Month");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .text("Monthly Global Land-Surface Temperature");

    const legend = svg.selectAll(".legend")
        .data([0].concat(colorScale.quantiles()), (d) => d);

    const legend_g = legend.enter().append("g")
        .attr("class", "legend");

    legend_g.append("rect")
        .attr("x", (d, i) => 50 * i)
        .attr("y", height + 90)
        .attr("width", 50)
        .attr("height", 50)
        .style("fill", (d, i) => colors[i]);

    legend_g.append("text")
        .attr("class", "mono")
        .text((d) => Math.round(d) + "°C")
        .attr("x", (d, i) => 50 * i + 10)
        .attr("y", height + 85);

    legend.exit().remove();
});