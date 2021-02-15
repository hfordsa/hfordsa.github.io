async function drawHeatmap() {

 let dataset = await d3.csv("data/time_series_diff.csv", function (d) {return{

 	week_diff: +d.week_diff,
 	n: +d.n,
 	honour: d.award_label

 }
})

// console.log(dataset)


 //set dimensions

 



  //draw canvas

  const wrapper = d3.select(".heatmap_wrapper")
      .append("svg")
    	.attr("viewBox", "0 0 1000 450")


let dimensions = {
    width: 1000,
    height: 450,
    margin: {
        top: 30,
        right: 100,
        bottom: 30,
        left: 150,},
    }



dimensions.boundedWidth = dimensions.width
     - dimensions.margin.left
     - dimensions.margin.right
   dimensions.boundedHeight = dimensions.height
     - dimensions.margin.top
     - dimensions.margin.bottom


  const bounds = wrapper.append("g")
        .style("transform", `translate(${
          dimensions.margin.left
          }px, ${
            dimensions.margin.top
          }px)`)


var margin = {top: 30, right: 100, bottom: 30, left: 150},
  width = 1000 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// array of honour levels
const honour_level = Array.from(d3.group(dataset, d => d.honour).keys())	

// array of weeks
const weeks = Array.from(d3.group(dataset, d => d.week_diff).keys()).sort(d3.ascending)	



// console.log(weeks)
// console.log(honour_level)


// Build X scales and axis:

const xScale = d3.scaleBand()
		  .domain(weeks)
      .range([ 0, width ])
		  .paddingInner(0.3)
      .paddingOuter(0.4)
      .align(0.5)



const xAxis = d3.axisBottom()
  .scale(xScale)
  .tickValues([-52, -25, 0, 25, 52]);

  bounds
    .append("g")
     .call(xAxis) 
      .attr("transform", "translate(0," + height + ")")
            .attr("class", "xAxis")



// svg.append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x))




const yScale = d3.scaleBand()
  .domain(honour_level)
  .range([ height, 0 ])
  .padding(0.01)


const yAxis = d3.axisLeft()
  .scale(yScale)

  bounds
    .append("g")
      .call(yAxis)
      .attr("class", "yAxis")



const max_page = d => d.n

const myColor = d3.scaleLinear()
  .domain(d3.extent(dataset, max_page))
  .range(["#d6dec8","#214151"])


//tooltip


const tooltip = d3.select(".heatmap_tooltip")

var onMouseEnter = function(d) {

  
  
    tooltip.
      select("#heatmap_text")
          .html( `
            No. weeks between honour & page<br>
            Week Number:  ${d.week_diff}<br>
            Honour Level: ${d.honour}<br>
            Wikipedia pages created: ${d.n}`)

           

   
  tooltip
      .style("left", (d3.mouse(this)[0] + 45) + "px") 
      .style("top", (d3.mouse(this)[1] + 90)+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }


//draw heatmap
  

bounds.selectAll()
      .data(dataset, function(d) {return d.honour+':'+d.week_diff;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return xScale(d.week_diff) })
      .attr("y", function(d) { return yScale(d.honour) })
      .attr("width", xScale.bandwidth() )
      .attr("height", yScale.bandwidth() )
      .style("fill", function(d) { return myColor(d.n)} )
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)


//legend

// TO DO

}

drawHeatmap()