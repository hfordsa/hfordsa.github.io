

async function drawWikiBars () {



	const formatPerecent = d3.format(".0%")


	const dataset_bar_wiki_gender = await d3.csv("data/wiki_prop_gender.csv", function(d) { return{
		honour: d.award_label,
		total_honour: +d.total,
		total_gender: +d.gender_total,
		prop_gender: +d.prop,
		gender: d.gender,
		page: +d.page

}

	})

	


	
	const yAccessor = Array.from(d3.extent(dataset_bar_wiki_gender, d => d.prop_gender))


  	const xAccessor = Array.from(d3.extent(dataset_bar_wiki_gender, d => d.gender))

  	
  	const honour_level = Array.from(d3.extent(dataset_bar_wiki_gender, d => d.honour))

  	const yHeight = d => d.length


  
//nesting data into groups for small charts / creating a key based on honour level 

  	const nestData = d3.nest()
  		.key(d =>  d.honour)
  		.entries(dataset_bar_wiki_gender)

  	// console.log(nestData)	

//getting key for headers  		

  	const key = nestData.map(d => d.key)




	let dimensions = {
		width: 300,
		height: 250,
		margin: {
				top: 40,
				right: 10,
				bottom: 10,
				left: 40,},
		}



dimensions.boundedWidth = dimensions.width
     - dimensions.margin.left
     - dimensions.margin.right
   dimensions.boundedHeight = dimensions.height
     - dimensions.margin.top
     - dimensions.margin.bottom



	 const svg = d3.select(".wikipedia_bar_gender_wrapper")
		  	.selectAll("smallChart")
		  	.data(nestData)
		  		.enter()
		  		.append("svg")
		  		.attr("width",dimensions.boundedWidth +  dimensions.margin.left + dimensions.margin.right)
		  		.attr("height",dimensions.boundedHeight+ dimensions.margin.top + dimensions.margin.bottom)
		  		// .call(responsivefy)


			

// //scales
  	
const xScale = d3.scaleBand	()
	.domain(xAccessor)
	 .range([dimensions.margin.left, dimensions.boundedWidth - dimensions.margin.right])
	 .padding([0.2])
	


const yScale = d3.scaleLinear()
	.domain([0,1])
	.range([dimensions.boundedHeight,dimensions.margin.top])
	



//Draw Axis

const xAxis = d3.axisBottom()
            .scale(xScale)
            .tickPadding(3)	
            
			
 
            svg	
            .append("g")
            .call(xAxis)
            .attr("class", "xAxis_small")
            .attr("transform", `translate(0,${dimensions.boundedHeight})`) 


const yAxis = d3.axisLeft()
			.scale(yScale)
			.ticks(4, "%")
			
	svg
          .append("g")
          .attr("class", "yAxis_small")
          .attr("transform", `translate(${dimensions.margin.left},0)`)   
          .call(yAxis)	


//tooltip


const tooltip = d3.select(".wikipedia_bar_gender_tooltip")

var onMouseEnter = function(d) {

	const formatPerecent = d3.format(".0%")
	
	
	
    tooltip.
    	select("#text2")
          .html( `<div>Of the ${d.total_gender} ${d.gender} honoured with ${d.honour}, <br>${d.page}, or ${(formatPerecent(d.prop_gender))} has a Wikipedia page</div>`)
            .style('visibility', 'visible')

   
 	tooltip
      .style("left", (d3.mouse(this)[0]) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1])+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }


           

// draw rects and labels

	svg
		.selectAll(".bar")
		.data(d => d.values)
		.enter()
		.append("rect")
		.attr("x", d => xScale(d.gender))
		.attr("y", d => yScale(d.prop_gender))
		.attr("width", xScale.bandwidth())
		.attr("height", d => dimensions.boundedHeight - yScale(d.prop_gender))
		.attr("class", "gender_wiki_bar")
		.on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)
	



    svg
      .append("text")
      .attr("text-anchor", "start")
      .attr("x", dimensions.margin.left)
  		.attr("y",  dimensions.margin.top - 5)
  		.attr("class", "heading")
      .text(d => d.key)       


}

drawWikiBars()