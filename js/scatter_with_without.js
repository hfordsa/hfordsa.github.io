async function drawScatter2() {


// access data

const dataset2 = await d3.csv("data/all_women_recipients_scatter.csv", function(d) {return {
  word: d.word,
  no: +d.No,
  yes: +d.Yes ,
  jitter_one: +d.jitter_one,
  jitter_two: +d.jitter_two,
  label_type: d.label_class
}

})



const xAccessor = d => d.no
const yAccessor = d => d.yes

const textAccessor = d => d.word

const jitter_y = d => d.jitter_one
const jitter_x = d => d.jitter_two


// console.log(dataset)


 // const width = d3.min([
 //    window.innerWidth * 0.75,
 //    window.innerHeight * 0.75,
 //  ])





const yMax = d3.max(dataset2, yAccessor)
const yMin = d3.min(dataset2, yAccessor) 
// const yMin = 0



const xMax = d3.max(dataset2, xAccessor) 
const xMin = d3.min(dataset2, xAccessor) 



// draw canvas

const wrapper = d3.select(".scatter2_wrapper")
    .append("svg")
    .attr("viewBox", "0 0 600 600")

      .attr("class" ,"wrapper")
      

     
  let dimensions = {
    width: 600,
    height: 600,
    margin: {
        top: 10,
        right: 30,
        bottom: 90,
        left: 40,},
    }


  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
      

const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)
    .attr("class", "bounds")




// // create scales


const xScale = d3.scaleLog()
    .domain(d3.extent(dataset2, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLog()
    .domain(d3.extent(dataset2, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()



// //  // draw data   

// draw reference line

const ref_line = bounds.append('g')

const line = ref_line.append("line")
  // .attr("stroke", "red")
    .attr('x1',xScale((dataset2, xMin)))
    .attr('x2',xScale((dataset2, xMax)))
    .attr('y1',yScale((dataset2, yMin)))
    .attr('y2',yScale((dataset2, yMax)))
    .attr("class", "scatter_ref_line")
    // .style("transform", `translate(${dimensions.margin.bottom}px, ${dimensions.margin.top}px)`)
    .style("transform", `translate(30px, 80px)`)






//draw dots


 const drawDots = (dataset2) => {


    const dots = bounds.selectAll("circle")
      .data(dataset2, d => d[0])

    const newDots = dots.enter().append("circle")

    const allDots = newDots.merge(dots)
      .attr("transform", d => `translate(${xScale(xAccessor(d))+jitter_x(d)},${yScale(yAccessor(d))+jitter_y(d)})`)
        .attr("r", 4)
        .attr("class", "circle2")

    const oldDots = dots.exit()
        .remove()



  }
  drawDots(dataset2)





const labels = bounds.selectAll('text')
    .data(dataset2)
    .enter()
    .append("text")
      .attr("transform", d => `translate(${xScale(xAccessor(d))+jitter_x(d) - jitter_x(d) },${yScale(yAccessor(d))+jitter_y(d)})`)
      .attr("id", "text_label")
        // .attr("opacity", "0")
      .text(d => d.word)     
      .attr("class", function(d) {
        if (d.label_type =="nolabel") {return "nolabel"}
        else {return "label"} 
})


// //draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks(3, "~g")

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("class", "scatter_axis")

  const xAxisLabel = xAxis.append("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .html("All honour holders without Wikipedia page")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(3, "~g")

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)
    .attr("class", "scatter_axis")


  const yAxisLabel = yAxis.append("text")
      .attr("color", "transparent")
      .attr("class", "y-axis-label")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 15)
      .text("All honour holders with Wikipedia page")
      .attr("color", "transparent")




 // draw interactions 
 
 const delaunay = d3.Delaunay.from(
  dataset2,
  // d => `translate(${xScale(xAccessor(d))+jitter_one(d)},${yScale(yAccessor(d))+jitter_two(d)})`,
  d => xScale(xAccessor(d)) + jitter_x(d),
  d => yScale(yAccessor(d)) + jitter_y(d),
)

const voronoi = delaunay.voronoi()
  voronoi.xmax = dimensions.boundedWidth
  voronoi.ymax = dimensions.boundedHeight

bounds.selectAll(".voronoi")
  .data(dataset2)
   .enter()
   .append("path") 
   .attr("class", "voronoi")
    .attr("d", (d,i) => voronoi.renderCell(i))
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)


const tooltip = d3.select("#scatter2_tooltip")
      function onMouseEnter(datum) {

        const dayDot = bounds.append("circle")
      .attr("class", "tooltipDot2")
      .attr("transform", d => `translate(${xScale(xAccessor(datum))+jitter_x(datum)},${yScale(yAccessor(datum))+jitter_y(datum)})`)
      .attr("r", 6)
      .style("pointer-events", "none")


    tooltip.select("#word2")
        .text(datum.word)


       const x = xScale(xAccessor(datum))
      + dimensions.margin.left
      const y = yScale(yAccessor(datum))
      + dimensions.margin.top



     tooltip.style("transform", `translate(`
        + `calc( -50% + ${x}px),`
        + `calc(-100% + ${y}px)`
        + `)`)


      tooltip.style("opacity", 1)
    }


    function onMouseLeave() {
      d3.selectAll(".tooltipDot2")
        .remove()

        tooltip.style("opacity", 0)
    }     

}

drawScatter2()