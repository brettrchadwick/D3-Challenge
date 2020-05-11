var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "age";
var chosenYAxis="smokes"

function yScale(newsData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(newsData, d => d[chosenYAxis]) ,
      d3.max(newsData, d => d[chosenYAxis]) 
    ])
    .range([height, 0]);

  return yLinearScale;

}

function xScale(newsData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(newsData, d => d[chosenXAxis]) ,
        d3.max(newsData, d => d[chosenXAxis]) 
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
  function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderCircleX(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  function renderCircleY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "age") {
      label = "Age(Median):";
    }
    else if(chosenXAxis === "poverty") {
      label = "In Poverty (%):";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Age:${d.age}<br>Smokes: ${d.smokes}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }

  d3.csv("data.csv").then(function(newsData, err){
      if (err) throw err;

      newsData.forEach(function(data){
          data.smokes= +data.smokes;
          data.poverty= +data.poverty;
          data.age= +data.age;
          data.income= +data.income;
          data.healthcare= +data.healthcare;
          data.obesity= +data.obesity;
          stateAbbr=data.abbr;
      });
      var xLinearScale=d3.scaleLinear()
          .domain(d3.extent(newsData, d=>d.age))
          .range([0, width]);
      var yLinearScale=d3.scaleLinear()
          .domain(d3.extent(newsData, d=>d.smokes))
          .range([height, 0]);
      var bottomAxis=d3.axisBottom(xLinearScale);
      var leftAxis=d3.axisLeft(yLinearScale);
      chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
      chartGroup.append("g")
          .call(leftAxis);
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .text("Age (Median)");
      chartGroup.append("text")
        .attr("transform", `translate(-50, ${height/2}) rotate(-90)`)
        .text("Smokes (%)");
      
        
      var circlesGroup=chartGroup.selectAll("circle")
          .data(newsData)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d.age))
          .attr("cy", d => yLinearScale(d.smokes))
          .attr("r", 20)
          .attr("fill", "lightblue")
          .attr("opacity", ".5")

     
      
          
      var circlesGroup=updateToolTip(chosenXAxis, circlesGroup);

    

    }).catch(function(error) {
  console.log(error);
});
  