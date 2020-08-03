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
