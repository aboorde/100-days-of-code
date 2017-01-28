// set graph dimensions & margins
var width = 960,
    height = 800;

var x = d3.scaleTime().range([0,width]);
var y = d3.scaleLinear().range([height,0]);


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black")

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.country; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width, height));

d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json", function(error, data) {
    if (error) throw error;

    data.links.forEach(function(el) {
        el.source = data.nodes[el.source].country;
        el.target = data.nodes[el.target].country;
    });
    console.log(data);
    
    // append links
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line")
        .attr("stroke-width", "4");

    //append nodes
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(data.nodes)
        .enter().append("g")
        .attr("class", "node")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
        
    node.append("title")
        .text(function(d) { return d.country; });

    node.append("image")
        .attr("xlink:href", function(d) { return "https://rawgit.com/hjnilsson/country-flags/master/svg/" + d.code + ".svg"})
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", 16)
        .attr("height", 10);

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);
    
    simulation.force("link")
        .links(data.links);

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x / 2; })
            .attr("y1", function(d) { return d.source.y / 2; })
            .attr("x2", function(d) { return d.target.x / 2; })
            .attr("y2", function(d) { return d.target.y / 2; });
            
        node
            .attr("transform", function(d) { return "translate(" + d.x/2 + "," + d.y/2 + ")"; });

    }
    
});


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
