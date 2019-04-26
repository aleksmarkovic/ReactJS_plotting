import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


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
      chartOptions: {
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
        spline: {
            enabled: false
        },
        yAxis: {
            max: 80,
            min:-80
        },
        plotOptions: {
            series: {
                animation: false,
            },            
            line: {
                marker: {
                    enabled: false
                }
            }
          /*series: {
            point: {
              events: {
                mouseOver: this.setHoverData.bind(this)
              }
            }
          }*/
        }
      },
      hoverData: null
    };
   // this.updateSeries = this.updateSeries.bind(this);
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
          dataFile: res.express.split("\r\n"),
          flag: true 
        },
        () => {
          setInterval(() => {  
            const { dataFile, step, data, date } = this.state; 
            const dataArray = [...dataFile.slice(step, step+1).map(obj => {
                return parseInt(obj);
            })];
            const newDate = new Date();
            if (step > 100){
                this.setState({
                    data: data.shift(),
                    //data2: data2.shift(),
                    date: date.shift()
                });  
            }
            //updateSeries = () => {
                // The chart is updated only with new options.
                this.setState({ 
                  chartOptions: {
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
             // }
            /*const {
              dataFile,
              step,
              data,
              data2,
              date
            } = this.state;*/

            /*const newData = [...dataFile.slice(step, step+1)]; 
            const newData2 = [...dataFile.slice(step+10, step+11)];
            const newDate = new Date(); */
            /*if (step > 50){
              this.setState({
                  data: data.shift(),
                  data2: data2.shift(),
                  date: date.shift()
              });  
            }*/


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
    const { chartOptions, hoverData } = this.state; 

    return (
      <div className="App">
        <HighchartsReact
            options={chartOptions}
            highcharts={Highcharts}
            //constructorType={'mapChart'}
            allowChartUpdate={true}
            updateArgs={[true, true, true]}
            containerProps={{className: 'chartContainer'}}
            callback={this.chartCallback}
        />
      </div>
    );
  }
}
export default App;