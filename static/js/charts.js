function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    // and holds the first sample in the array.
    var results = samples.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(results);
    
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(metadata);

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    // Already done in Deliverable 1: 4

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    // Already done in Deliverable 3: 1

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    var otuIds = results.otu_ids;
    var otuLabels = results.otu_labels;
    var sampleValues = results.sample_values;
            
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(metadata.wfreq);
    console.log(wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.map(otuid => 'OTU ' + otuid).slice(0,10).reverse();
    
    var slicedOtuLabels = otuLabels.slice(0,10).reverse();
    var slicedSampleValues = sampleValues.slice(0,10).reverse();
    
    // Deliverable 1: 8. Create the trace for the bar chart. 
    
    var barData = [{
        x: slicedSampleValues,
        y: yticks,
        text : slicedOtuLabels,
        type : "bar",
        orientation : 'h'
    }];

    
    // Deliverable 1: 9. Create the layout for the bar chart. 
    // Change the background to transparent
    var barLayout = {
          title : "Top 10 Bacteria Cultures Found",
          plot_bgcolor: 'rgba(0,0,0,0)',
          paper_bgcolor: 'rgba(0,0,0,0)'
          
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Deliverable 2: 1. Create the trace for the bubble chart.
    // Use the colorscale 'Earth'
    var trace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    var scatterData = [trace];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var scatterLayout = {
      title : "Bacteria Cultures Per Sample",
      xaxis : {
        title : "OTU ID"},
      hovermode: "closest",
      height: 600,
      width: 1200
    };

    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", scatterData, scatterLayout)
    
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var gaugeTitle = "<b>Belly Button Washing Frequency</b><br>Scrubs per Week";
    var gaugeData = [{
          domain: { x: [0, 10], y: [0, 10] },
          value: wfreq,
          gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
            bar: { color: "black" },
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lightgreen" },
              { range: [8, 10], color: "green" },
               ],
          },
          title: {text : gaugeTitle },
          type: "indicator",
          mode: "gauge+number"

    }];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    // Change the background to transparent

    var gaugelayout = { width: 500, height: 450, margin: { t: 0, b: 0 },
              plot_bgcolor: 'rgba(0,0,0,0)',
              paper_bgcolor: 'rgba(0,0,0,0)'        
  };

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugelayout);

  });
}
