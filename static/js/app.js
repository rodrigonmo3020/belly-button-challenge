// Get the samples endpoint
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Display the default apps
function init(){

    // fetch the json data set and console log it
    d3.json(url).then(function(data){
      console.log(data);

      // Use D3 to select the dropdown menu
      let dropdownMenu = d3.select("#selDataset");

      // extracting the names id from json dataset
      let names = data.names;

      // iterating in names to add then to dropdown menu
      names.forEach(function(id){
          dropdownMenu.append("option").text(id).property("value");
      });
     
      // for each selection ID then call the functions to update charts and demographic panel
      chartvalues(names[0]);
      metadata(names[0]);
  });
};
// On change to the DOM, then call function to select reset charts and demographic panel
function optionChanged(selectedid) {

  chartvalues(selectedid);
  metadata(selectedid);
};

// Extracting the values from the json dataset and asignin variables for the Charts
function chartvalues(selectedid){
  
  d3.json(url).then((data) => {
    console.log(data);

    let samples = data.samples;

    let nameId = samples.filter(item => item.id == selectedid);

    let sampleValues = nameId[0].sample_values;
    let otuIds = nameId[0].otu_ids;
    let otuLabels = nameId[0].otu_labels;

    charts(sampleValues, otuIds, otuLabels);

  });
  
};

// calling the function to show the bar and bubble charts
function charts(sampleValues, otuIds, otuLabels){


  // fetch the json data set and console log it
  d3.json(url).then((data) => {
    console.log(data);
              
      // data for bar chart
      let barChart = [{
          type: 'bar',
          x: sampleValues.slice(0,10).reverse(),
          y: otuIds.slice(0,10).map(nameId => `OTU ${nameId}`).reverse(),
          text: otuLabels,
          orientation: 'h'
      }];

      // data for bubble chart
      let bubbleChart = [{
          x: otuIds,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker:{
              color: otuIds,
              colorscale: 'Electric',
              size: sampleValues
          }
      }];
  
      // layout for bar chart
      let barLayout = {
          height: 500,
          width: 400            
      };    

      // layout for bubble chart
      let bubbleLayout = {
        xaxis: {
          title: 'OTU ID'},
        height: 550,
        width: 1000 
      };

      // display bar chart and bubble chart
      Plotly.newPlot("bar", barChart , barLayout);
      Plotly.newPlot("bubble", bubbleChart, bubbleLayout);

  });


};

function metadata(selectedid){

  // From the json data set
  d3.json(url).then(function(data){

    // extracting the metadata values from json dataset
    let samples = data.metadata;

    // filter data from metadata
    let id = samples.filter(item => item.id == selectedid);

    // Use D3 to select the demographic panel
    let sample_metadata = d3.select("#sample-metadata").html("");

    // iterate through the values using Object on an array
    Object.entries(id[0]).forEach(([key, value]) => {
        
        // display information in demographic panel
        sample_metadata.append("h5").text(`${key}: ${value}`);
      });
  });
};

init();
