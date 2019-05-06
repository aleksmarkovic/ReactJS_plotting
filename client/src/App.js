import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

function chartDataFunction(stateData, stateData2, stateDate) {
  return {
    labels: stateDate,
    datasets: [
      {
        label: 'Signal 1',
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
        label: 'Signal 2',
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
      }
    ]
  }
}

function singleChartDataFunction(stateData, stateData2, stateDate) {
  return {
    labels: [],
    datasets: [
      {
        label: 'Signal 1',
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
        data: [stateData]
      },
      {
        label: 'Signal 2',
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
        data: [stateData2],
      }
    ]
  }
}

const options = {  
  animation: false,
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
      data1: [],
      data2: [],
      signal1: [],
      signal2: [],
      lineChart: {},
      barChart: {},
      singleBarChart: {},
      length: 0
    };
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
          signal1: res.signal1,
          signal2: res.signal2,
          length: res.length 
        },
        () => {
          const draw = setInterval(() => {  
            const {
              signal1,
              signal2,
              step,
              data1,
              data2,
              date,
              length
            } = this.state;
            const newData1 = signal1[step+1].toString(); 
            const newData2 = signal2[step+1].toString();
            const newDate = new Date(); 
            if (step > 50){
              this.setState({
                  data1: data1.shift(),
                  data2: data2.shift(),
                  date: date.shift()
              });  
            }
            
            this.setState({
                  data1: [...data1, newData1],
                  data2: [...data2, newData2],
                  date: [...date, newDate.getSeconds()],
                  singleBarChart: singleChartDataFunction(newData1, newData2, date),
                  barChart: chartDataFunction(data1, data2, date),
                  lineChart: chartDataFunction(data1, data2, date),
                  step: step + 1         
             });    
       
             if (step >= length-2) clearInterval(draw);
          }, 100);    
        }
      ))      
      .catch(err => console.log(err));
  }

  render() {   

    return (
      <div className="App" style={{ width: "100%", height: "1000px"}}>
        <div style={{ width: "75%", height: "50%", display: "flex" }}>
          <Line             
              data={this.state.lineChart}      
              options={options}        
          />    
          <div style={{ width: "25%", height: "200%" }}>        
          <Bar            
              data={this.state.singleBarChart}      
              options={options}        
            />
          </div>        
        </div>          
        <div style={{ width: "75%", height: "50%" }}>
          <Bar            
              data={this.state.barChart}      
              options={options}        
          />
        </div>       
      </div>
    );
  }
}
export default App;