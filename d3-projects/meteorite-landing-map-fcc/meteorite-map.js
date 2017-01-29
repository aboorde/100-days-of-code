var margin = {top: 20, right: 80, bottom: 40, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var projection = d3.geoEquirectangular()
    //.scale(height / Math.PI)
    //.translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection)
    .pointRadius(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
    .call(d3.zoom().on("zoom", function () {
            svg.attr("transform", d3.event.transform)
        }));

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.queue()
    .defer(d3.json, "world-50m.json")
    .defer(d3.json, "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
    .await(ready);

function ready(err, world, meteorite) {
    if (err) throw err;
    console.log(d3.max( meteorite.features, function(d) { return +d.properties.mass; } ));

    var meteoriteScale = d3.scaleLinear()
                .domain([d3.min( meteorite.features, function(d) { return +d.properties.mass; } ),d3.max( meteorite.features, function(d) { return +d.properties.mass; } )])
                .range([2,20]);

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("d", path);

    svg.append("path")
        .attr("class", "country-borders")
        .attr("d", path(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; })));

    svg.append("g")
        .selectAll("path")
        .data(meteorite.features).enter()
        .append("circle")
        .attr('cx', function(d) {  
            return projection([d.properties.reclong,d.properties.reclat])[0]; 
        })
        .attr('cy', function(d) { 
            return projection([d.properties.reclong,d.properties.reclat])[1]; 
        })
        .attr("r", function(d) { 
            var mass = +d.properties.mass;
            return meteoriteScale(mass); 
        })
        .attr('stroke-width', 0.5)
        .attr('stroke', '#868686')
        .style('opacity','.5')
        .attr("fill", "red")
        .on("mouseover", function(d) {
            d3.select(this)
                .attr('d', path)
                .style('fill', 'blue');
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html("Name: " + d.properties.name + "<br/>" + "Mass: " + d.properties.mass + "<br/>" + "Class: " + d.properties.recclass)
                .style("left", 1010 + "px")
                .style("top", 25 + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr('d', path)
                .style('fill', 'red');
            div.transition()
                .duration(500)
                .style("opacity", 0);
       });
}