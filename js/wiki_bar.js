async function drawWikiBars () {

  const dataset_bar_wiki = await d3.csv("data/wiki_prop.csv", function(d) { return{
    honour: d.award_label,
    total_honours: +d.total,
    total_wiki: +d.page,
    prop: +d.prop

}

  })

 

const xAccessor = d => d.honour

const yAccessor = d => d.prop 

//set dimensions



//select canvas

const wrapper = d3.select(".wikipedia_bar_wrapper")
    .append("svg")
    .attr("viewBox", "0 0 900 500")


let dimensions = {
    width: 900,
    height: 500,
    margin: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 80,},
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



//create scales
 
const xScale = d3.scaleBand()
  .domain(d3.range(dataset_bar_wiki.length))
  .range([0, dimensions.boundedWidth - dimensions.margin.left])
  .padding([0.1])


const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset_bar_wiki, d => d.prop)]).nice()
  .range([dimensions.boundedHeight, 0])

//create axis


const xAxisGenerator = d3.axisBottom()
  .scale(xScale)
  .tickFormat( i => dataset_bar_wiki[i].honour)



const yAxisGenerator =  d3.axisLeft()
  .scale(yScale)
  .ticks(4, '%')




//call Axis

const yAxis = bounds.append("g")
  .call(yAxisGenerator)
  .attr("class", "yAxis")


const xAxis = bounds.append("g")  
  .call(xAxisGenerator)
  .style("transform", `translateY(${
    dimensions.boundedHeight
  }px)`)
  .attr("class", "xAxis")

//tooltips

const tooltip = d3.select(".wikipedia_bar_tooltip")


var onMouseEnter = function(d) {

  const formatPerecent = d3.format(".0%")
  
  
  
    tooltip.
      select("#text")
          .html( `<div>Of the ${d.total_honours} people honoured with ${d.honour} <br>there are ${d.total_wiki}, or ${(formatPerecent(d.prop))} with a Wikipedia page</div>`)

            //  
            // )
            // .style('visibility', 'visible');

   
  tooltip
      .style("left", (d3.mouse(this)[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]-90)+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }


// draw bars

const bars = bounds

bars.append("g")
    .selectAll("rect")
    .data(dataset_bar_wiki)
    .join("rect")
      .attr("x", (d, i) => xScale(i))
      .attr("y", d => yScale(d.prop))
      .attr("height", d => yScale(0) - yScale(d.prop))
      .attr("width", xScale.bandwidth())
      .attr("class", "wiki_bar_rect")
      .on("mouseenter", onMouseEnter)
            // .on("mousemove", mousemove)
      .on("mouseleave", onMouseLeave)
            




}

drawWikiBars()