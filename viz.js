var width = 800;
var height = 440;

var cityId = 0;
var inputSexo = "all";
var inputParto = "all";
var inputPesoMin = 0;
var inputPesoMax = 5000;
var inputData = "all";
var inputMae = "all";


var viz = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//Creates the map projection and sets the center
{
var projection = d3.geoMercator()
.center([-43.1729, -22.9068]) // centro em RJ
.scale(7500)
.translate([width / 2, height / 2+110]);

var data = d3.map();

var path = d3.geoPath()
  .projection(projection);
}

//Sets the color scale
var colorScale = d3.scaleLinear()
.domain([0, 10])
.domain([0, 10])
.range(["white", "#5E50D9"]);

//Sets default year and the listener for the year update
{
  var selectedYear = 2020;
  
  d3.select("#year-value").text(selectedYear);
  
  d3.select("#year") // listen for changes to the year dropdown menu
  .on("input", function() { 
      selectedYear = this.value;
      getData(selectedYear);
      d3.select("#year-value").text(selectedYear);
      inputData = "all";
  
    })
    .on("change", function() {
      draw_histogram(selectedYear);
    });
  
  d3.select("#play-button")
  .on("click", function() {
    //turns on if off and vice versa
    var button = d3.select(this);
    if (button.text() == "Play") {
      button.text("Stop");
      interval = setInterval(step, 1000);
    } else {
      button.text("Play");
      clearInterval(interval);
    }
  
    //adds 1 to selected year
    function step() {
      if (selectedYear == 2020) {
        selectedYear = 1997;
      }
      selectedYear = parseInt(selectedYear) + 1;
      d3.select("#year")
      .property("value", selectedYear);
      getData(selectedYear);
      draw_histogram(selectedYear);
      if (selectedYear == 2020) {
        clearInterval(interval);
        button.text("Play");
      }
      d3.select("#year-value").text(selectedYear);
    }
  });
  }

// set continuous legend for color scale from 0 to 10
{var legend = viz.append("g")
.attr("transform", "translate(0,0)")
.attr("id", "legend");

var legenditem = legend.selectAll(".legenditem")
.data(d3.range(10))
.enter()
.append("g")
.attr("class", "legenditem")
.attr("transform", function(d, i) { return "translate(" + i * 31 + ",10)"; });

legenditem.append("rect")
.attr("x", width - 350)
.attr("y", height - 50)
.attr("width", 30)
.attr("height", 10)
.attr("class", "rect")
.style("fill", function(d, i) { return colorScale(d); });

legenditem.append("text")
.attr("x", width - 350)
.attr("y", height - 60)
.style("text-anchor", "middle")
.style("fill", "white")
.style("font-size", "10px")
.text(function(d, i) { return i * 1; });

legend.append("text")
.attr("x", width - 40)
.attr("y", height -50)
.style("text-anchor", "middle")
.style("fill", "white")
.style("font-size", "10px")
.text("10");

legend.append("text")
.attr("x", width - 200)
.attr("y", height -10)
.style("text-anchor", "middle")
.style("fill", "white")
.style("font-size", "15px")
.text("Média do Apgar 1 por município");

// legend for na values
legend.append("rect")
.attr("x", width - 70)
.attr("y", height - 80)
.attr("width", 30)
.attr("height", 10)
.attr("class", "rect")
.style("fill", "#6B6066")

legend.append("text")
.attr("x", width - 55)
.attr("y", height - 85)
.style("text-anchor", "middle")
.style("fill", "white")
.style("font-size", "10px")
.text("NA");

}

//Draws the map
function draw_map(error,d){
    console.log(d);
    viz.selectAll("path").remove();
    viz.selectAll("path")
        .data(d.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", function(d) {
            var dataPoints = data.get(d.properties.id_municipio);
            return dataPoints ? colorScale(dataPoints.apgar1) : "#6B6066";
        })

        .attr("stroke", "transparent")
        .attr("stroke-width", "2px")
        .on("mouseover", function(d) {
            //select all the paths and set their opacity to 0.5
            d3.selectAll("path").style("opacity", 0.5);
            //select the current path and set its opacity to 1
            d3.select(this).style("opacity", 1);
        })
        .on("mouseout", function(d) {
            //select all the paths and set their opacity to 1
            d3.selectAll("path").style("opacity", 1);
        })
        .on("click", function(d) {
          //sets the cityId to the selected city
          d3.selectAll("path").attr("stroke", "transparent");
          d3.select(this).attr("stroke", "red");
          d3.select(this).attr("stroke-width", "2px");
          cityId = d.properties.id_municipio;
          draw_histogram(selectedYear);
          d3.select(".dark-article").node().scrollIntoView({block: "start" ,behavior: "smooth"});
          console.log(cityId);
        })
    .append("svg:title")
    .style("fill", "red")
    .text(function(d) {
      var cityData = data.get(d.properties.id_municipio);
      return (cityData && cityData.nome_municipio) ? (cityData.nome_municipio + ": " + cityData.apgar1) : "N/A";
    });
}

function getData(givenYear){
  console.log(givenYear)
  d3.queue(givenYear)
  .defer(d3.json, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/cidades.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/mean/apgar1Mean" + givenYear + ".csv", function(d) {
	data.set(d.id_municipio.replace("$", ""),
	{apgar1: d.meanApgar1,
    nome_municipio: d.nome_municipio,
	  year: d.ano
	  });
  })
  .await(draw_map);
}

getData(selectedYear);


// Listeners to other inputs
{
  // listener peso
  d3.select("#inputPesoMax1")
    .on("change", function() {
    inputPesoMax = this.value;
    draw_histogram(selectedYear);
  });
  d3.select("#inputPesoMax2")
    .on("change", function() {
    inputPesoMax = this.value;
    draw_histogram(selectedYear);
  });

  d3.select("#inputPesoMin1")
    .on("change", function() {
    inputPesoMin = this.value;
    draw_histogram(selectedYear);
  });
  d3.select("#inputPesoMin2")
  .on("change", function() {
  inputPesoMin = this.value;
  draw_histogram(selectedYear);
});



  // listener sexo
  d3.select("#inputSexo")
    .on("change", function() {
      inputSexo = this.value;
      draw_histogram(selectedYear);
  });

  // listener parto
  d3.select("#inputParto")
    .on("change", function() {
      inputParto = this.value;
      draw_histogram(selectedYear);
  });

  // listener data
  d3.select("#inputData")
    .on("change", function() {
      inputData = this.value.toString();
      selectedYear = inputData.substring(0,4);
      d3.select("#year-value").text(selectedYear);
      d3.select("#year").property("value", selectedYear);
      console.log(inputData);
      document.getElementById("data-value").textContent = inputData;
      draw_histogram(selectedYear);
      getData(selectedYear);
});

// listener mother age
  // listener parto
  d3.select("#inputMae")
    .on("change", function() {
      inputMae = this.value;
      draw_histogram(selectedYear);
  });


}
//End of viz1 code

//Start of viz2 code

var width2 = 400
var height2 = 400

var viz2 = d3.select("#viz2")
    .append("svg")
    .attr("width", 470)
    .attr("height", 500)
    .append("g")
    .attr("transform", "translate(" + 60 + "," + 10 + ")");

function draw_histogram(selectedYear) {
  // clear the previous graph
  d3.csv("https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/general/general" + selectedYear + ".csv", function(data) {
  viz2.selectAll("*").remove();
  // filter data to match cityId
  data = data.filter(function(d) {
    if (cityId == 0) {
      return true;
    }
    return d.id_municipio == cityId;
  });
  data = data.filter(function(d) {
    return parseInt(d.peso) >= parseInt(inputPesoMin) && parseInt(d.peso) <= parseInt(inputPesoMax);
  });
  data = data.filter(function(d) {
    if (inputSexo == "all") {
      return true;
    }
    return d.sexo == inputSexo;
  });
  data = data.filter(function(d) {
    if (inputParto == "all") {
      return true;
    }
    return d.tipo_parto == inputParto;
  });

  data = data.filter(function(d) {
    if (inputData == "all") {
      return true;
    }
    return d.data_nascimento.toString() == inputData;
  });
  data = data.filter(function(d) {
    if (inputMae == "all") {
      return true;
    }
    return parseInt(d.idade_mae) == parseInt(inputMae);
  });

  //if the data is empty, show a message



  var x = d3.scaleLinear()
      .domain([0, 11])
      .range([0, width2]);

    viz2.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .style("fill", "white")
        .style("font-size", "12px")
        .attr("dx", "2em");


    var histogram = d3.histogram()
      .value(function(d) { return d.apgar1; })
      .domain(x.domain())
      .thresholds(x.ticks(10));

    var bins = histogram(data);
    var y = d3.scaleLinear()
      .range([height2, 30]);
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);
    //y label
    viz2.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - 50)
      .attr("x",0 - (height2 / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "12px");

    viz2.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

    viz2.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height2 - y(d.length); })
        .style("fill", "#965BF0")
    
    viz2.append("text")
      .attr("x", (width2 / 2))
      .attr("y", 1)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "15px")
      .text("Histograma do Apgar 1 em "+ selectedYear);

    city_showing = cityId == 0 ? "Todos os municípios" : data[0].nome_municipio;
    viz2.append("text")
      .attr("x", (width2 / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "15px")
      .text(city_showing);

    viz2.append("text")
      .attr("x", (width2 / 2))
      .attr("y", 440)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "13px")
      .text("Apgar 1");
    
    viz2.append("text")
      .attr("x", -200)
      .attr("y", (height2 / 2)-250)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "13px")
      .text("Número de nascidos vivos");

    //wait .1 seconds to show the message
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
    sleep(250).then(() => {
    
    if (data.length == 0) {
      alert("Poxa, não há nenhum bebê na base de dados com essa seleção de filtros :( Tente verificar seus dados!");
    }
    if (data.length == 1) {
      alert("Você se encontrou! Com os filtros selecionados, restou apenas um bebê possível, e se você estava inserindo seus dados, esse deve ser você! Seu Apgar1 é de: " + data[0].apgar1);
    }
    });


  });

}

window.addEventListener("scroll",function() { 
  if(window.scrollY > 500) {
    var infoButton = document.getElementById('infoButton');
    infoButton.dataset.target = "#infoModal2";
  }
  else {
    var infoButton = document.getElementById('infoButton');
    infoButton.dataset.target = "#infoModal1";
  }
},false);

draw_histogram(selectedYear);
