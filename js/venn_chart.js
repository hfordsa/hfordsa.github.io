

var dataset = [ {sets: ['Wikipedia'], label:'Wikipedia', textLabel:'Wikipedia page only', size: 49117, fill: "#a2d0c1"}, 
             {sets: ['Order of Australia'],  label:'Order of Australia', textLabel:'Order of Aus only',size: 36878, fill: "#f8dc81"},
             // {sets: ['Wikipedia','Order of Australia'],  textLabel:'both Wikipedia and Order of Aus', size: 4452, fill: "#DFD993"}]
             {sets: ['Wikipedia','Order of Australia'],  textLabel:'both', size: 4452}]

          

var chart = venn.VennDiagram()
    // .styled(false);


const div = d3.select("#venn")
  .append("svg")
  .attr("viewBox", "0 0 600 350")


  .datum(dataset)
  .call(chart)

  const tooltip = d3.select("#venn").append('div').attr('class', 'venntooltip');


div
    .selectAll(".venn-circle path")
      .style("fill", d => d.fill)
      .style("fill", d => d.fill)
      .style("fill-opacity",  .8)
      .text("stroke", d => d.fill)



      
div
    .selectAll(".venn-circle text")
      .style("fill", "#214151")
      .style("fill-opacity", 1)




// add listeners to all the groups to display tooltip on mouseenter
div
  .selectAll('g')
  .on('mouseenter', function (d) {
    // sort all the areas relative to the current item
    venn.sortAreas(div, d);

    // Display a tooltip with the current size
    tooltip.transition().duration(400).style('opacity', 1);
    // tooltip.text(d.size + ' people ' + d.label);
    tooltip.text(d.size + ' people with ' + d.textLabel );

    // highlight the current path
    const selection = d3.select(this).transition('venn_tooltip').duration(400);
    selection
      .select('path')
      .style('stroke-width', 3)
      .style('fill-opacity', d.sets.length == 1 ? .4 : 0.1)
      .style('stroke-opacity', 1);
  })

  .on('mousemove', function () {
    tooltip.style('left', d3.event.pageX + 'px').style('top', d3.event.pageY - 28 + 'px');
  })

  .on('mouseleave', function (d) {
    tooltip.transition().duration(400).style('opacity', 0);
    const selection = d3.select(this).transition('tooltip').duration(400);
    selection
      .select('path')
      .style('stroke-width', 0)
      .style('fill-opacity', d.sets.length == 1 ? 0.8 : 0.0)
      .style('stroke-opacity', 0);
  });

  