
async function drawWaffle() {


const dataset_waffle = await d3.csv("data/waffle.csv", function (d) {return{

	// order: d.order,
	honour: d.honour,
	value: +d.value,
	total: d.total,
	percent: d.percent,
	label: d.label
	// name: d.name

}})

// console.log(dataset_waffle)

scaleColor = d3.scaleOrdinal()
.range(['#f8dc81','#D1A3A3',  '#A3B3D1', '#a2d0c1', '#C9D1A3'])
.domain(['KD', 'AC', 'AO', 'AM', 'OAM'])



const tooltip = d3.select(".waffle_tooltip")

var onMouseEnter = function(d) {

  
  
    tooltip.
      select("#waffle_text")
          .html( `${d.label} <br>
            Number: ${d.total}<br>
            Proporation: ${d.percent}`)

           

   
  tooltip
      .style("left", (d3.mouse(this)[0] + 45) + "px") 
      .style("top", (d3.mouse(this)[1] + 90)+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }


const waffle = d3.select(".waffle_wrapper")

// const numbers = d3.range(100)

waffle
	.selectAll ('.block')
	.data(dataset_waffle)
	.enter()
	.append()
	.attr('class', 'block')
	.style('background-color', d => scaleColor(d.honour))
	.on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

	




}


	drawWaffle()