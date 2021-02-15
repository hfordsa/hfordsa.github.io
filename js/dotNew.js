
var margin  = { top: 20, right: 30, bottom: 20, left:30},

    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;


d3.csv('https://raw.githubusercontent.com/KellyTall/Hellomister_DataBlog/master/comb_dot').then (function( data) {

// 

// nest the data by state
var nest = d3
  .nest()
  .key(d => d.group)
  .entries(data);

  // console.log(data);
  // console.log(nest);

var scaleColor = d3.scaleOrdinal ()
      .range(['#319D89', '#CD9C05', '#3D200F'])  
      .domain(['Colonial Expansion',   'First Fleet', 'Voyage of Endeavour' ]);

 var Tooltip = d3.select("#hist")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("padding", "5px")      
    .style("border-left", "solid")
    .style("border-width", "2px")
    .style("border-color", "#CD9C05")
    .style("font-family", "Source Sans Pro")


var mouseover = function(d) {
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html("Type: " +d.Monument_Type + "<br>" +"Year: " +d.Year)

      .style("right", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }


// select the figure element

var hist = d3.select('#hist');


var group = hist
  .selectAll('.group')
  .data(nest)
  .enter()
  .append('div')
  .attr('class', 'group');
  

// // in each group add the appropriate number of blocks
group.selectAll('.block')
  .data(d => d.values)
  .enter()
  .append('div')
  .attr('class', 'block')
  .style('background-color', d => scaleColor(d.group))
  .on("mouseover", mouseover)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseleave)
    

var label = group
  .append('text')
  .text(d => d.key)
  .attr('class' ,'label')
  .attr("text-anchor", "bottom");
  

  

  })



  


