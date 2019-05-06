import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsStock from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      date: [],
      data: [],
      data2: [],
      signal1: [],
      signal2: [],
      length: 0,
      chartData: {},
      chartOptions1: {
        chart:{
            height: 700,
            animation: false
        },
        xAxis: {
          categories: [],
        },
        series: [
          { data: [],
           }
        ],
        yAxis: {
            max: 100,
            min:-100
        },
        plotOptions: {          
            line: {
                marker: {
                    enabled: false
                }
            }
        }
      },
      chartOptions2: {
          title: {
            text: 'My stock chart'
          },
          series: [{
            data: [1, 2, 3]
          }]
        },
      
      hoverData: null
    };
  }
  //setHoverData = (e) => { 
  //  // The chart is not updated because `chartOptions` has not changed.
  //  this.setState({ hoverData: e.target.category })
  //}
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
          length: res.length 
        },
        () => {
          const draw = setInterval(() => {  
            const { signal1, signal2, step, data, date, length } = this.state; 
            const dataArray = parseInt(signal1[step+1]);
            const newDate = new Date();
            if (step > 50){
                this.setState({
                    data: data.shift(),
                    date: date.shift()
                });  
            }
                this.setState({ 
                  chartOptions1: {
                    series: [
                      { data: data }
                    ],
                    xAxis: {
                        categories: date
                    },
                  },
                  data: [...data, dataArray],
                  step: step + 1,
                  date: [...date, newDate.getSeconds()],
                });
                console.log(this.state.dataArray);       

            if (step >= length-2) clearInterval(draw);
          }, 100);    
        }
      ))      
      .catch(err => console.log(err));
  }

  render() {  
    const { chartOptions1, hoverData } = this.state; 

    return (
      <div className="App" style={{ width: "100%", height: "2000px"}}>
        <div style={{ width: "75%", height: "50%", display: "flex" }}>
          <HighchartsReact
              options={chartOptions1}
              highcharts={Highcharts}
              //constructorType={'mapChart'}
              //allowChartUpdate={true}
              //updateArgs={[true, true, true]}
              containerProps={{className: 'chartContainer'}}
              callback={this.chartCallback}
          />
          <div style={{ width: "25%", height: "200%" }}>        
          
          </div>        
        </div>          
        <div style={{ width: "75%", height: "50%" }}>
          <HighchartsReact
            highcharts={HighchartsStock}
            constructorType={'stockChart'}
            options={chartOptions1}
          />
        </div>       
      </div>
    );
  }
}
export default App;