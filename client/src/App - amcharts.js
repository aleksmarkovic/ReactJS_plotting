import React, { Component } from 'react';
//import { Line } from 'react-chartjs-2';
//import { defaults } from 'react-chartjs-2';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);


class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      data: [],
      flag: false
    };
    //this.manageData = this.manageData.bind(this);
  }


callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
};

  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ 
          data: res.express.split("\r\n")}))
      .then(()=> {
          let chart = am4core.create("chartdiv", am4charts.XYChart);

          chart.paddingRight = 20;
        
          let dataset = this.state.data;
          let data = [];
          let step = 100;
          for (let i = 0; i < step; i++) {
            data.push({ date: new Date(), name1: "Value1", value1: dataset[i], name2: "Value2", value2: dataset[i+10] });      
          }step = step + 1;
      
          chart.data = data;
      
          let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
          dateAxis.renderer.grid.template.location = 0;
      
          let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
          valueAxis.tooltip.disabled = true;
          valueAxis.renderer.minWidth = 35;
          //let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
          /*valueAxis2.tooltip.disabled = true;
          valueAxis2.renderer.minWidth = 35;*/
          
          let series1 = chart.series.push(new am4charts.LineSeries());
          series1.dataFields.dateX = "date";
          series1.dataFields.name = "name1";
          series1.dataFields.valueY = "value1";
          let series2 = chart.series.push(new am4charts.LineSeries());
          series2.dataFields.dateX = "date";
          series2.dataFields.name = "name2";
          series2.dataFields.valueY = "value2";
      
      
      
          let scrollbarX = new am4charts.XYChartScrollbar();
          scrollbarX.series.push(series1);
          scrollbarX.series.push(series2);
          chart.scrollbarX = scrollbarX;
      
          series1.tooltipText = "{valueY.value}";
          series2.tooltipText = "{valueY.value}";
          chart.cursor = new am4charts.XYCursor();
      
          chart.legend = new am4charts.Legend();
          chart.legend.useDefaultMarker = true;
          series1.legendSettings.valueText = "Value1: {valueY.close}";
          series2.legendSettings.valueText = "Value2: {valueY.close}";
          chart.cursor = new am4charts.XYCursor();
      
          
          this.chart = chart;
      
          setInterval(function(){        
              for (let i = step - 1; i < step; i++) {
                data.shift();
                data.push({ date: new Date(), name1: "Value1", value1: dataset[i], name2: "Value2", value2: dataset[i+10] });
            } step += 1;
            chart.data = data;
      
            chart.validateData();
                
          }, 200);
      })
      .catch(err => console.log(err));

   /* this.timerID = setInterval(
        () => this.chartUpdate(),
        5000
    );*/
  }

  componentDidUpdate() {  
/*
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.paddingRight = 20;
  
    let dataset = this.state.data;
    let data = [];
    let step = 100;
    for (let i = 0; i < step; i++) {
      data.push({ date: new Date(), name1: "Value1", value1: dataset[i], name2: "Value2", value2: dataset[i+10] });      
    }step = step + 1;

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    //let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    /*valueAxis2.tooltip.disabled = true;
    valueAxis2.renderer.minWidth = 35;*/
    /*
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.dateX = "date";
    series1.dataFields.name = "name1";
    series1.dataFields.valueY = "value1";
    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.name = "name2";
    series2.dataFields.valueY = "value2";



    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series1);
    scrollbarX.series.push(series2);
    chart.scrollbarX = scrollbarX;

    series1.tooltipText = "{valueY.value}";
    series2.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    series1.legendSettings.valueText = "Value1: {valueY.close}";
    series2.legendSettings.valueText = "Value2: {valueY.close}";
    chart.cursor = new am4charts.XYCursor();

    
    this.chart = chart;

    setInterval(function(){        
        for (let i = step - 1; i < step; i++) {
          data.shift();
          data.push({ date: new Date(), name1: "Value1", value1: dataset[i], name2: "Value2", value2: dataset[i+10] });
      } step += 1;
      chart.data = data;

      chart.validateData();
          
    }, 350);
*/
  } 

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
        //clearInterval(this.timerID);
  }  

  render() {   
   //console.log(this.state.data);
    /*const chartData = {
      //labels: ["January", "February", "March", "April", "May", "June", "July"],
      //labels: array2,
      datasets: [{
      label: "My First dataset",
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      responsive: "true",      
      data: [0,3,1]
      }]
    }*/
    //console.log(chartData.data);
    /*let i;
    for (i=0; i<this.state.data.length; i++){
      chartData.data[i] = this.state.data[i];
    }*/


    
    return (
      <div className="App">
          <div id="chartdiv" style={{ width: "100%", height: "800px" }}></div>
      </div>
    );
  }
}
//    <Line data={chartData} />
export default App;