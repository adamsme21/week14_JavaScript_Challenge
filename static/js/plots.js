$(document).ready(function() {
    init();
});

// Initialize 
function init() {
    d3.json("static/data/samples.json").then((data)=>{
        console.log(data);
        var display = d3.select("#selDataset");
        var sample_names = data.names;
        sample_names.forEach((data_sample)=>{
            display.append("option")
            .text(data_sample)
            .property("value", data_sample);
        })
        var sample= sample_names[0];
        getData(sample);
        getPlot(sample);
        plotBar(sample);
        getGauge(sample)
    })
}

// Demographics table
function getData(sample_id) {
    d3.json("static/data/samples.json").then((data)=>{
        var meta_data= data.metadata;
        var filter_data = meta_data.filter(x=>x.id == sample_id);
        var filtered = filter_data[0]
        var demographics = d3.select("#sample-metadata");
        // recommended by tutor
        demographics.html("");
        Object.entries(filtered).forEach(([key, value])=>{
            demographics.append("h6").text(`${key}:${value}`);
        })
    })
}

// change demographic info with selection-- tutor suggestion
function optionChanged(new_sample) {
    getData(new_sample);
    getPlot(new_sample);
    plotBar(new_sample);
    getGauge(new_sample)
}

// Bar chart
function plotBar(sample_id) {
    d3.json("static/data/samples.json").then((data)=>{
        let info = data.samples.filter(x => x.id == sample_id)[0];
        var otu_id = info.otu_ids;
        var top_ten = otu_id.slice(0, 10).reverse();
        var sample_value = info.sample_values.slice(0, 10).reverse()
        var trace2 = [{
            type: 'bar',
            x: sample_value,
            y: top_ten,
            text: info.otu_labels.slice(0, 10).reverse(),
            orientation: 'h',
            marker: {
                color: 'darkblue'
            },
            width: 100
        }];
        var layout = {
            title: {
            text:'Top 10 OTUs found in individual',
            font: {
                family: 'Courier New, monospace',
                size: 14
            },
            xref: 'paper',
            x: 0.05,
            },
            xaxis: {
                title: {
                text: 'Sample Values',
                font: {
                    family: 'Courier New, monospace',
                    size: 12,
                    color: '#7f7f7f'
                }
                },
            },
            yaxis: {
                title: {
                text: 'OTU IDs',
                font: {
                    family: 'Courier New, monospace',
                    size: 12,
                    color: '#7f7f7f'
                }
                    }
            }
        }  
        Plotly.newPlot("bar", trace2, layout);
    });
}

// Gauge plot
function getGauge(sample_id) {
    d3.json("static/data/samples.json").then((data)=>{
        let info = data.samples.filter(x => x.id == sample_id)[0];
        var otu_id = info.otu_ids;
        var demographics = data.metadata;
        var wash_amount = demographics.wfreq;
        var gaugeData = [
            {
                name: otu_id,
                value: wash_amount,
                title: { text: "Weekly Washing Amounts" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9]}}
            }
        ];
        var layout = { 
            width: 400, 
            height: 300, 
            margin: { t: 0, b: 0 }, 
            font: { color: "darkblue", family: "Arial" } 
        };
        Plotly.newPlot("gauge", gaugeData, layout);
    })
}

// Bubble plot
function getPlot(sample_id) {
    d3.json("static/data/samples.json").then((data)=>{
        var sample_data= data.samples;
        var filter_data = sample_data.filter(x=>x.id == sample_id);
        var filtered = filter_data[0];
        var otu_id = filtered.otu_ids;
        var otu_label = filtered.otu_labels
        var sample_value = filtered.sample_values;
        var bubbleData = [{
            x: otu_id,
            y: sample_value,
            text: otu_label,
            mode: "markers",
            marker: {
                size: sample_value,
                color: otu_id,
                colorscale: "Bluered"
            }
        }]
        var layout = {
            title: {
            text:'Biodiversity Samples in Belly Buttons',
            font: {
                family: 'Courier New, monospace',
                size: 24
            },
            xref: 'paper',
            x: 0.05,
            },
            xaxis: {
                title: {
                text: 'OTU IDs',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
                },
            },
            yaxis: {
                title: {
                text: 'Sample Values',
                font: {
                    family: 'Courier New, monospace',
                    size: 18,
                    color: '#7f7f7f'
                }
                  }
            }
        }
        Plotly.newPlot("bubble", bubbleData, layout);
    })
}

