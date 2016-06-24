/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
var colors = ['#d7f0f8','#99b4ce', '#9ea7bb', '#bec3cb', '#c1b9c2','#edae9e', '#b38e95','#5a4563','#4e4a67', '#393f65', '#24385e',  '#16324a'];

function getJsonLength(json){
     var length=0;
     for(var key in json){
        length++;
     }
     return length;
}

function getWidth(data){
    return (0.98/getJsonLength(data)/2).toFixed(4)*100+'%';
}

function getColor(data){
  var rate=Math.floor(data/50);
  return colors[rate];
}

function renderChart() {
  
  var renderData={};
  if (pageState['nowSelectCity']==-1) {
    renderData=chartData["北京"][pageState["nowGraTime"]];   
  }else{
    renderData=chartData[pageState['nowSelectCity']][pageState["nowGraTime"]];
  }

  var chartWrap=document.getElementsByClassName('aqi-chart-wrap');
  chartWrap[0].innerHTML="<div class='chart-title'>"+(pageState['nowSelectCity']==-1?"北京":pageState['nowSelectCity'])+"空气质量报告</div>";
  var chartDiv=document.createElement("div");
  chartDiv.className="chart-content";
  chartDiv.innerHTML="";
 
  for (var date in renderData) {
      if (chartDiv.innerHTML=="") {
        chartDiv.innerHTML+="<div class='bar' style='width:"+getWidth(renderData)+"; height:"+renderData[date]+"px ;background:"+getColor(renderData[date])+";'title='"+date+"：AQI["+renderData[date]+"]'></div>";
      }else{
        chartDiv.innerHTML+="<div class='bar' style='width:"+getWidth(renderData)+"; height:"+renderData[date]+"px ;margin-left:"+
        getWidth(renderData)+"; background:"+getColor(renderData[date])+";'title='"+date+"：AQI["+renderData[date]+"]'></div>";
      }
  }
  chartWrap[0].appendChild(chartDiv);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  // 确定是否选项发生了变化 
  // 设置对应数据
   if (e.target.value!=pageState['nowGraTime']) {
       pageState["nowGraTime"]=e.target.value;
   }
  // 调用图表渲染函数

  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
  // 确定是否选项发生了变化 
  // 设置对应数据
  if (e.target.value!=pageState['nowSelectCity']) {
       pageState["nowSelectCity"]=e.target.value;
   }
  // 调用图表渲染函数
   renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var dateSelect = document.getElementById("form-gra-time");

  dateSelect.addEventListener("change",graTimeChange);
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {

   var citySelect = document.getElementById("city-select");
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var text="";
   for(var cityName in aqiSourceData){
       text+="<option>"+cityName+"</option>";
   }
   citySelect.innerHTML=text;
   citySelect.addEventListener("change",citySelectChange);
  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // alert(JSON.stringify(aqiSourceData));
  // 将原始的源数据处理成图表需要的数据格式
  for(city in aqiSourceData){
     var aqiOfCity=aqiSourceData[city];
  
     // alert(JSON.stringify(aqiOfCity));
     var month='01', week=1;
     var monthCount=0, weekCount=0;
     var monthData=0, weekData=0;
     var monthArray={}, weekArray={};

    for (var key in aqiOfCity) {
      var array=key.split('-');
      if (array[1]==month) {
        monthCount++;
        monthData+=aqiOfCity[key];
      }else{
        monthArray[array[0]+'-'+month]=(monthData/monthCount).toFixed(2);       
        monthCount=1;
        monthData=aqiOfCity[key];

        if (weekCount!=0) {
          weekArray[array[0]+'-'+month+'月 第'+week+'周']=(weekData/weekCount).toFixed(2);
        }
        
        month=array[1];
        week=1;
        weekCount=0;
        weekData=0;
      }

      var weekDay=new Date(array[0],array[1]-1,array[2]).getDay();
      weekCount++;
      weekData+=aqiOfCity[key];
      
      if (key=='2016-03-31') {

          monthArray[array[0]+'-'+month]=monthData/monthCount;
          weekArray[array[0]+'-'+month+'月 第'+week+'周']=(weekData/weekCount).toFixed(2);
          break;
      }

      if (weekDay==0) {
        weekArray[array[0]+'-'+month+'月 第'+week+'周']=(weekData/weekCount).toFixed(2);
        week++;
        weekCount=0;
        weekData=0;
        
      }

    }
    // 处理好的数据存到 chartData 中

    var aqiOfDate={};
    aqiOfDate['day']=aqiOfCity;
    aqiOfDate['week']=weekArray;
    aqiOfDate['month']=monthArray;
    chartData[city]=aqiOfDate;
  } 
  // alert(JSON.stringify(chartData['上海']['week']));

}

/**
 * 初始化函数
 */
function init() {
  // alert(JSON.stringify(aqiSourceData));
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
  renderChart();
}

init();