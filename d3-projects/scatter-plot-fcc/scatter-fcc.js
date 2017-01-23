// set the dimensions and margins of the graph
var margin = {top: 20, right: 80, bottom: 40, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// parse the date / time
var formatTime = d3.timeFormat("%H:%M");
var formatSeconds = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// setup fill color
var cValue = function(d) { return (d.Doping !== "" ? "Guilty of Doping" : "No Doping Allegations");},
    color = d3.scaleOrdinal(d3.schemeCategory10);

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
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, data) {
    if (error) throw error;
    console.log(data);
    // format the data
    data.forEach(function(d) {
        d.Seconds = +d.Seconds;
        d.Year = +d.Year;
        d.Place = +d.Place;
        d.Diff = d.Seconds - 2210;
    });
    x.domain([d3.max(data, function(d) { return d.Seconds; })-2210, 0]);
    //x.domain(d3.extent(data, function(d) { return d.Seconds; }));
    y.domain([d3.max(data, function(d) { return d.Place; }) + 1, 1]);

    // add the dots with tooltips
    var dots = svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.Diff); })
        .attr("cy", function(d) { return y(d.Place); })
        .style("fill", function(d) { return color(cValue(d));})
        .on("click", function(d) {
            window.open(d.URL);
        })
        .on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", 0.9);
        div.html(d.Name + ", " + d.Nationality + "<br/>Year: " + d.Year + ", Time: " + d.Time + "<br/>" + (d.Doping !== "" ? d.Doping : "No Doping Allegations!"))
            .style("left", 550 + "px")
            .style("top", 350 + "px");
        })
        .on("mouseout", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 0);
       });
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) { return d.Name; })
        .attr("x", function(d) { return x(d.Diff) + 10; })
        .attr("y", function(d) { return y(d.Place) + 5; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "crimson");
       /*
       dots.append("text").text(function(d) {
           return d.Name;
       })
        .style("text-anchor", "middle")
        .attr('dy', -10);
        */
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(formatSeconds));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

        // text label for the x axis
    svg.append("text")             
        .attr("x", 480 )
        .attr("y",  475 )
        .style("text-anchor", "middle")
        .text("Time behind leader (in Minutes:Seconds)");
    // Y Axis text
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Ranking");

    // add a title
    svg.append("text")
        .attr("x", (width / 2))				
        .attr("y", 10 - (margin.top / 2))
        .attr("text-anchor", "middle")	
        .style("font-size", "20px") 
        .style("text-decoration", "underline") 	
        .text("35 Fastest times up Alpe d'Huez");
    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("y", 92)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 100)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-weight", "600")
        .text(function(d) { return d;});


/*
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.close; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // add the dots with tooltips
  svg.selectAll("dot")
     .data(data)
   .enter().append("circle")
     .attr("r", 5)
     .attr("cx", function(d) { return x(d.date); })
     .attr("cy", function(d) { return y(d.close); })
     .on("mouseover", function(d) {
       div.transition()
         .duration(200)
         .style("opacity", .9);
       div.html(formatTime(d.date) + "<br/>" + d.close)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Value");
    */
});