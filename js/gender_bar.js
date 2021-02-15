
async function drawBars () {


//accessing data and specifying each variable and the format

const dataset_bar = await d3.csv("data/gender_bar.csv", function(d) { return {
	date: +d.honours_year, 
	key: d.gender, 
	value: +d.number,
	
}
})





// console.log(dataset_bar)


//get keys for male / female - the values that split the stack along the Y axis - creates an aray of "Women" / "Men" 

keys = Array.from(d3.group(dataset_bar, d => d.key).keys())

years = Array.from(d3.group(dataset_bar, d => d.date).keys())

values=Array.from(d3.rollup(dataset_bar, ([d]) => d.value, d => +d.date, d => d.key))

group = Array.from(d3.group(dataset_bar, d => +d.date, d => d.key))




//stack data - gets the height of each of the keys stacked on top of one and other based on the values of the data

stacked_data = d3.stack()
    .keys(keys)
    .value(([, values], key) => values.get(key))
  (values)

// console.log(stacked_data)


// //set dimensions of chart

const wrapper = d3.select("#gender_bar_wrapper")
		.append("svg")
		.attr("viewBox", "0 0 1200 400")

let dimensions = {
		width: 1200,
		height: 400,
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




//creating scales



const yScale = d3.scaleLinear()
	.domain([0, d3.max(stacked_data, d => d3.max(d, d => d[1]))]).nice()
	.range([dimensions.boundedHeight, 0])
	


const xScale = d3.scaleBand()
	.domain(years)
	.range([0, dimensions.boundedWidth])
	.padding([0.1])


	

//colour scale

color_scale = d3.scaleOrdinal()
        .domain(keys)
        .range(['#214151','#f8dc81'])




       
//generate Axis



const yAxisGenerator = 	d3.axisLeft()
	.scale(yScale)


const xAxisGenerator = d3.axisBottom()
	.scale(xScale)
	// .ticks("%y")


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




//tooltip



const tooltip = d3.select(".gender_tooltip")

	

var onMouseEnter = function(d) {

	var subgroupName = d3.select(this.parentNode).datum().key
    
    var subgroupYear = d.data[0]

    var subgroupValue = d[1] - d[0]


	tooltip.select("#date")
		.text(subgroupYear)
    

	tooltip.select("#key")
		.text(subgroupName)

	tooltip.select("#count")
		.text(subgroupValue)
   
 	tooltip
      .style("left", (d3.mouse(this)[0]) + "px") 
      .style("top", (d3.mouse(this)[1]-90)+ "px")

        tooltip.style("opacity", 1)

}


  var onMouseLeave = function(d) {
    tooltip
      .style("opacity", 0)
  }



//draw chart



const bars = bounds
		.append("g")
		.attr("class", "rects")
     	.selectAll("g.rects")

     bars	
    	.data(stacked_data)
    	.enter()	
    	.append("g")
    	
		     .attr("fill", d => color_scale(d.key))
		      .selectAll("rect")
		      .data(d => d)
		      .enter()
		      .append("rect")
		        .attr("x", (d, i) => xScale(d.data[0]))
		        .attr("y", d => yScale(d[1]))
		        .attr("height", d => yScale(d[0]) - yScale(d[1]))
		        .attr("width", xScale.bandwidth())
		        .on("mouseenter", onMouseEnter)
      			// .on("mousemove", mousemove)
      			.on("mouseleave", onMouseLeave)
		        


}


drawBars()
