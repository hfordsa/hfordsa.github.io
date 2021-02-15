

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#stackedBar")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data

  d3.csv("https://raw.githubusercontent.com/KellyTall/Hellomister_DataBlog/master/stream.csv"). then (function(data) {

  // List of subgroups = header of the csv files = historical groups here
  
  var subgroups = data.columns.slice(1)
    // console.log(subgroups);
  
  // List of groups 
  
  var groups = d3.map(data, function(d){return(d.decades)}).keys()

  // Add X axis
  var x_scaleB = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x_scaleB).tickSizeOuter(0));

  // Add Y axis
  var y_scaleB = d3.scaleLinear()
    .domain([0, 110])
    .range([ height, 0 ]);
  svg2.append("g")
    .call(d3.axisLeft(y_scaleB));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    // .range(['#e41a1c','#377eb8','#4daf4a'])
    .range(['#319D89', '#CD9C05', '#3D200F'])

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)


    var tooltip = d3.select("#stackedBar")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border-left", "solid")
    .style("border-width", "2px")
    .style("border-color", "#CD9C05")
    .style("padding", "10px")
    .style("font-family", "Source Sans Pro")

  

    var mouseover = function(d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip
        .html("<strong>Historical Period:</strong> " + subgroupName + "<br>" + "Number of monuments: " + subgroupValue)
        .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+90) + "px") 
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x_scaleB(d.data.decades); })
        .attr("y", function(d) { return y_scaleB(d[1]); })
        .attr("height", function(d) { return y_scaleB(d[0]) - y_scaleB(d[1]); })
        .attr("width",x_scaleB.bandwidth())


.on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  
      
})