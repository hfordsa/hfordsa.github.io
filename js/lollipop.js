async function drawLollipop () {
	
	let dataset_lolli = await d3.csv("data/time_series_diff_full.csv", function (d){return{

			week_diff: +d.week_diff,
 			n: +d.n,
 			// honour: d.award_label

	}}
)

// console.log(dataset_lolli)



    var wrapper = d3.select(".lollipop_wrapper")
  .append("svg")
    .attr("viewBox", "0 0 1000 500")


let dimensions = {
    width: 1000,
    height: 500,
    margin: {
        top: 10,
        right: 30,
        bottom: 90,
        left: 40,},
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

const weeks = Array.from(d3.group(dataset_lolli, d => d.week_diff).keys()).sort(d3.ascending)	
const pages = Array.from(d3.max(dataset_lolli, d => d.n))	

// console.log(weeks)

const xScale = d3.scaleBand()
	.domain(weeks)
	.range([0, dimensions.boundedWidth])
	.paddingInner(0.3)
    .paddingOuter(0.4)
    .align(0.5)
    

const xAxis = d3.axisBottom()
	.scale(xScale)
	  .tickValues([-935, 0, 1020])
      
	
	

bounds
	.append('g')
	.call(xAxis)	
	.attr("transform", "translate(0," + dimensions.boundedHeight + ")")
	.attr("class", "xAxis")


const yScale = d3.scaleLinear()
	.domain([0, (d3.max(dataset_lolli, d => d.n))])
  	.range([ dimensions.boundedHeight, 0]);	

 const yAxis = d3.axisLeft()
 	.scale(yScale) 	

  
bounds.append("g")
  .call(yAxis)
  .attr("class", "yAxis")


const tooltip = d3.select(".lollipop_tooltip")

var onMouseEnter = function(d) {

  
  
    tooltip.
      select("#lollipop_text")
          .html( `
            No. weeks between honour & page<br>
            Week Number:  ${d.week_diff}<br>
            Wikipedia pages created: ${d.n}`)

           

   
  tooltip
      .style("left", (d3.mouse(this)[0]-450) + "px") 
      .style("top", (d3.mouse(this)[1]+45)+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }



bounds.selectAll("myline")
  .data(dataset_lolli)
  .enter()
  .append("line")
    .attr("x1", function(d) { return xScale(d.week_diff); })
    .attr("x2", function(d) { return xScale(d.week_diff); })
    .attr("y1", function(d) { return yScale(d.n); })
    .attr("y2", yScale(0))
    // .attr("stroke", "grey")
    .attr("class", "lollipop_line")



bounds.selectAll("mycircle")
  .data(dataset_lolli)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return xScale(d.week_diff); })
    .attr("cy", function(d) { return yScale(d.n); })
    .attr("r", "4")
    .attr("class", "lollipop_circle")
    // .style("fill", "#69b3a2")
    // .attr("stroke", "black")
    .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)



}
drawLollipop()