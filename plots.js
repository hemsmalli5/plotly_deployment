window.onload = function(){
   // alert("hi..");
    init();
    optionChanged(940);
}

function init(){
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) =>{
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
    })}
   
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildBubbleCharts(newSample);
    buildGuageCharts(newSample)
  }

function buildMetadata(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
       
        PANEL.append("h6").text("ID : " + result.id);
        PANEL.append("h6").text("Ehnicity : " + result.ethnicity);
        PANEL.append("h6").text("Gender : " + result.gender);
        PANEL.append("h6").text("Age : " + result.age);
        PANEL.append("h6").text("Location : " + result.location);
        PANEL.append("h6").text("Bbtype : " + result.bbtype);
        PANEL.append("h6").text("Wfreq : " + result.wfreq);
    });
}

function buildCharts(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // add text
        var xData = result.sample_values;
        var yData = result.otu_ids;
        var data = [{
            x: xData.slice(0, 10).reverse(),
            y: yData.slice(0, 10).map(id => "otu" +id).reverse(),
            type:"bar",
            orientation: "h"

        }]

        var layout = {
            title: "Top 10 bacterial species (OTUs)",
            xaxis: {title: "OTU Labels"},
            yaxis: {title: "OTU ID"}
        }

        Plotly.newPlot("bar", data, layout);
});
}

function buildBubbleCharts(sample){
    d3.json("samples.json").then((data) => {
        var bubble_samples = data.samples;
        var resultArray = bubble_samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var xData = result.otu_ids;
        var yData = result.sample_values;
        
         // Enter a speed between 0 and 180
         var level = 90;

         // Trig to calc meter point
         var degrees = 180 - level,
        var bubble_chart_data = [{
            x: xData.slice(0, 10),
            y: yData.slice(0, 10).reverse(),
            text: ['A<br>size: 40', 'B<br>size: 60', 'C<br>size: 80', 'D<br>size: 100'],
            mode: 'markers',
            marker: {
                color: xData,
                size: yData,
                colorscale: 'Earth'
              },
            gridLineWidth: 0

        }]
        var bubble_chart_layout = {
            // title: 'Bubble Chart Size Scaling',
            xaxis: {title: "OTU ID"},
            showlegend: false,
            height: 600,
            width: 1200,
            minorgridLineWidth: 0
        }

        Plotly.newPlot("bubble", bubble_chart_data, bubble_chart_layout);
});
}

function buildGuageCharts(wfreq){
    d3.json("samples.json").then((data) => {
        var guage_samples = data.samples;
        var resultArray = guage_samples.filter(sampleObj => sampleObj.wfreq == wfreq);
        var result = resultArray[0];
        var gauge_metadata = data.metadata;
        var meta_resultArray = gauge_metadata.filter(sampleObj => sampleObj.wfreq == wfreq);
        var result = resultArray[0];
        
        // Enter a speed between 0 and 180
        var level = 90;

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        // Path: may have to change to create a better triangle
        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{
            type: "scatter",
            x: [0],
            y: [0],
            marker: {size:14, color:'850000'},
            showlegend: false,
            name: 'Freq',
            text: 'level',
            hoverinfo: 'text+name',
            },
            { 
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
            textinfo: 'text',
            textposition:'inside',
            marker: {
                colors:[
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
                ]
              },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: 'label',
            hole: .5,
            type: 'pie',
            showlegend: false
            }
          ];
        var layout = {
            shapes:[{
                type: 'path',
                path: path,
                fillcolor: '850000',
                line: {
                  color: '850000'
                }
              }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            height: 400,
            width: 400,
            xaxis: {
              zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]
            },
            yaxis: {
              zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]
            }
          };
        
        Plotly.newPlot("gauge", data, layout);
    });
}