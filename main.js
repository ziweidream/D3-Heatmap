function getData(getDataCallBack) {
  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(data) {
    dataset = data.monthlyVariance;
    getDataCallBack(dataset);
  });
}

f = function(dataset) {
  var baseT = 8.66;
  var margin = {
    top: 90,
    right: 0,
    bottom: 100,
    left: 100
  };
  // width and height
  var w = 1000;
  var h = 600;
  // set the color domain and scale for the heatmap
  var colorDomain = d3.extent(dataset.map(function(each) {
    return each.variance + baseT;
  }));
  var colors = [
    "#00001a",
    "blue",
    "#3333ff",
    " #9999ff",
    "#ffb833",
    "orange",
    " #b37400",
    " #ff9999",
    " #ff3333",
    "red",
    "#990000"
  ];
  var colorScale = d3.scaleQuantile().domain(colorDomain).range(colors);
  // create the dataset containing the color domain and scale
  var data2 = [
    {
      T: 0,
      Color: "#00001a"
    }
  ];
  var total = 1.7;
  for (let i = 1; i < colors.length; i++) {
    var item = {};
    total += 1.1;
    item.T = total.toFixed(1);
    item.Color = colors[i];
    data2.push(item);
  }

  // size of each grid in heatmap
  var gridW = Math.floor(w / (dataset.length / 12));
  var gridH = Math.floor(h / 13);
  var convertM = function(num) {
    switch (num) {
      case 1:
        return "January";
        break;
      case 2:
        return "February";
        break;
      case 3:
        return "March";
        break;
      case 4:
        return "April";
        break;
      case 5:
        return "May";
        break;
      case 6:
        return "June";
        break;
      case 7:
        return "July";
        break;
      case 8:
        return "August";
        break;
      case 9:
        return "September";
        break;
      case 10:
        return "October";
        break;
      case 11:
        return "November";
        break;
      case 12:
        return "December";
        break;
    }
  }
  //x scale and y scale
  var xScale = d3.scaleLinear().domain([
    d3.min(dataset, function(d) {
      return d.year;
    }),
    d3.max(dataset, function(d) {
      return d.year;
    })
  ]).range([
    0, gridW * (dataset.length / 12)
  ]);

  var yScale = d3.scaleLinear().domain([
    d3.min(dataset, function(d) {
      return d.month;
    }),
    d3.max(dataset, function(d) {
      return d.month;
    })
  ]).range([margin.top, h]);
  //create SVG element
  var svg = d3.select("#root").append("svg").attr("class", "heatmap").attr("width", w).attr("height", h + margin.bottom);
  d3.select("#root").attr("align", "center");
  svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "white").attr("opacity", "1");
  //create color legend
  svg.selectAll(".legend").data(data2).enter().append("rect").attr("x", function(x, i) {
    return i * 40 + margin.left;
  }).attr("y", h + 50).attr("width", 40).attr("height", 20).attr("fill", function(x) {
    return x.Color;
  });

  svg.selectAll("text").data(data2).enter().append("text").text(function(x) {
    return x.T;
  }).attr("x", function(x, i) {
    return i * 40 + margin.left + 12;
  }).attr("y", h + 85).attr("font-family", "sans-serif").attr("font-size", "11px").attr("fill", "black");

  svg.append("text").attr("x", w - 180).attr("y", h + 95).attr("text-anchor", "middle").style("font-size", "11px").text("Temperatures in Celsius");
  //create tooltip
  var tool_tip = d3.tip().attr("class", "d3-tip").offset([-8, 0]).html(function(d) {
    return d.year + " " + convertM(d.month) + "<br>" + (
    d.variance + baseT).toFixed(2) + "<br>" + d.variance
  });
  svg.call(tool_tip);
  //create heatmap
  var rectangles = svg.selectAll("rect").data(dataset).enter().append("rect");
  rectangles.attr("x", function(d) {
    return (d.year - 1753) * gridW + margin.left;
  }).attr("y", function(d) {
    return d.month * gridH;
  }).attr("width", gridW).attr("height", gridH).style("fill", function(d) {
    return colorScale(d.variance + baseT);
  }).on("mouseover", tool_tip.show).on("mouseout", tool_tip.hide);

  // x axis
  var xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg.append("g").style("font", "14px").attr("class", "axisX").attr("transform", "translate(" + margin.left + "," + (
  gridH * 13) + ")").call(xAxis);

  //y axis
  var yAxis = d3.axisLeft(yScale).tickFormat(function(d, i) {
    switch (d) {
      case 1:
        return "January";
        break;
      case 2:
        return "February";
        break;
      case 3:
        return "March";
        break;
      case 4:
        return "April";
        break;
      case 5:
        return "May";
        break;
      case 6:
        return "June";
        break;
      case 7:
        return "July";
        break;
      case 8:
        return "August";
        break;
      case 9:
        return "September";
        break;
      case 10:
        return "October";
        break;
      case 11:
        return "November";
        break;
      case 12:
        return "December";
        break;
    }
  })
  svg.append("g").style("font", "14px").attr("class", "axisY").attr("transform", "translate(" + margin.left + "," + (
  0 - gridH / 2) + ")").call(yAxis);
  //title - top
  svg.append("text").attr("x", (w / 2)).attr("y", 30).attr("text-anchor", "middle").style("font-size", "22px").text("Monthly Global Land-Surface Temperature(1753-2015)");
}

getData(f);
