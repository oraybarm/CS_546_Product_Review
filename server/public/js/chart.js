
var chartDom = document.getElementById('chart');
var myChart = echarts.init(chartDom);
var option;

let data =[];
let dataAxis=[];
let yMax = 500;
let dataShadow = [];

$.ajax({
    type : "get",
    async : false,            
    url : "http://localhost:3000/home/getchartdata",    
    data : {},
    dataType : "json",       
    success : function(result) {
        if (result) {
          console
            for (var key in result) {
              dataAxis.push(key);
              data.push(result[key]);
            }
            
            console.log(data);
            console.log(dataAxis);
            for (let i = 0; i < data.length; i++) {
              dataShadow.push(yMax);
            }
            option = {
              title: {
                text: 'Product Quantities',
                subtext: 'Feature:Tags (Click Zoom)'
              },
              xAxis: {
                data: dataAxis,
                axisLabel: {
                  inside: true,
                  color: '#fff'
                },
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false
                },
                z: 10
              },
              yAxis: {
                axisLine: {
                  show: false
                },
                axisTick: {
                  show: false
                },
                axisLabel: {
                  color: '#999'
                }
              },
              dataZoom: [
                {
                  type: 'inside'
                }
              ],
              series: [
                {
                  type: 'bar',
                  showBackground: true,
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#83bff6' },
                      { offset: 0.5, color: '#188df0' },
                      { offset: 1, color: '#188df0' }
                    ])
                  },
                  emphasis: {
                    itemStyle: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#2378f7' },
                        { offset: 0.7, color: '#2378f7' },
                        { offset: 1, color: '#83bff6' }
                      ])
                    }
                  },
                  data: data
                }
              ]
            };
            // Enable data zoom when user click bar.
            const zoomSize = 6;
            myChart.on('click', function (params) {
              console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
              myChart.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue:
                  dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
              });
            });
            
            option && myChart.setOption(option);
            
        }
    
   },
    error : function(errorMsg) {
    alert("Chart fails to load data!");
    myChart.hideLoading();
    }
})

