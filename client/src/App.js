import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { defaults } from 'react-chartjs-2';


function chartDataFunction(stateData, stateData2, stateDate) {
  return {
    labels: stateDate,
    datasets: [
      {
        label: 'My First dataset',
        /*fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',*/
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: stateData
      },
      {
        label: 'My Second dataset',
        /*fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',*/
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(175,92,92,0.4)',
        borderColor: 'rgba(175, 92,92,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: stateData2,
      },
    ]
  }
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
      yAxes: [{
          ticks: {
            min: -100,
            max: 100
          }
    }]
  },
/*
  scaleShowGridLines: false,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 0,
  scaleShowHorizontalLines: false,
  scaleShowVerticalLines: false,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: false,
  pointDotRadius: 0,
  pointDotStrokeWidth: 0,
  pointHitDetectionRadius: 20,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
*/
}

const styles = {
  graphContainer: {
    border: '1px solid black',
    padding: '15px'
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      date: [],
      data: [],
      data2: [],
      dataFile: [],
      chartData: {},
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
    this.callBackendAPI()
      .then(res => this.setState({ 
          dataFile: res.express.split("\r\n"),
          flag: true 
        },
        () => {
          setInterval(() => {  
            const {
              dataFile,
              step,
              data,
              data2,
              date
            } = this.state;
            const newData = [...dataFile.slice(step, step+1)]; 
            const newData2 = [...dataFile.slice(step+10, step+11)];
            const newDate = new Date(); 
            if (step > 50){
              this.setState({
                  data: data.shift(),
                  data2: data2.shift(),
                  date: date.shift()
              });  
            }

            this.setState({
                  data: [...data, ...newData],
                  data2: [...data2, ...newData2],
                  date: [...date, newDate.getSeconds()],
                  chartData: chartDataFunction(data, data2, date),
                  step: step + 1         
             });     
          }, 100);    
        }
      ))      
      .catch(err => console.log(err));
  }

  componentDidUpdate() { 
  } 
    componentWillUnmount() {
  }  

  render() {   

    return (
      <div className="App">
          <Line             
              data={this.state.chartData}      
              options={options}        
              width={600} height={600}
          />
      </div>
    );
  }
}
export default App;