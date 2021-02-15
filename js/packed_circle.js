async function drawPackedCircle () {

const dataset_packed = await d3.csv("data/packed_circle.csv", function (d) {return{

	// order: d.order,
	honour: d.award_label,
	value: +d.value,
	// name: d.name

}})

// console.log(dataset_packed)


function responsivefy(svg) {
    
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    
    d3.select(window).on("resize." + container.attr("id"), resize);

    
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}



reduceFn = iterable => d3.sum(iterable, d => d["value"])

// groupingFns = [d => d.order, d => d.honour, d => d.name]
groupingFns = [d => d.honour]

rollupData = d3.rollup(dataset_packed, reduceFn, ...groupingFns);



childrenAccessorFn = ([ key, value ]) => value.size && Array.from(value)

hierarchyData = d3.hierarchy([null, rollupData], childrenAccessorFn)
    .sum(([,value]) => value)
    .sort((a, b) => b.value - a.value)

    // console.log(hierarchyData)



var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


    // var svg = d3.select(".packed_circle")

const svg = d3.select(".packed_circle_wrapper")
	.append("svg")
  	.attr("width", width + margin.left + margin.right)
  	.attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
  	

svg.append("g")
  	.attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
  	




const tooltip = d3.select(".packed_circle_tooltip")

var onMouseEnter = function(d) {

  
  
    tooltip.
      select("#text")
          .html( `
            Honour Level: ${d.data[0]}<br>
            People: ${d.value}`)

           

   
  // tooltip
  //     .style("left", (d3.mouse(this)[1]-90) + "px") 
  //     .style("top", (d3.mouse(this)[0] +200)+ "px")

        tooltip.style("opacity", 1)

        

}

function onMouseLeave() {
    tooltip.style("opacity", 0)
  }


pack = () => d3.pack()
    .size([width,height])
    .padding(1)
  (hierarchyData)



  const root = pack(hierarchyData)

  

format = d3.format(",d")

 svg.append("g")
 	.attr("class", "packed_circle")
      // .attr("fill", "#ccc")
    .selectAll("circle")
    .data(root.leaves())
    .join("circle")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("r", d => d.r)
      .attr("class", "packed_circle")
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)



      // .append("title")
      // .text(d => `${d.ancestors().map(d => d.data[0]).reverse().join("/")}\n${format(d.value)}`);

 



   


}

drawPackedCircle()