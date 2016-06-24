/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var cityIput=document.getElementById("aqi-city-input");
var valueInput=document.getElementById("aqi-value-input");

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city=cityIput.value.trim();
	var aqi=valueInput.value.trim();

	if (!city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)) {
        alert("城市名称必须为中英文字符");
        return;
	}
	if (!aqi.match(/^[0-9]+$/)) {
		 alert("空气质量指数必须为整数");
        return;
	}
    
    aqiData[city]=aqi;

}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {

	var table=document.getElementById("aqi-table");

	
	table.innerHTML="<tr><th>城市</th><th>空气质量</th><th>删除</th></tr>"
	for (var key in aqiData) {
	  table.innerHTML+="<tr><td>"+key+"</td><td>"+aqiData[key]+"</td><td><button data-city='"+key+"' onclick='delBtnHandle(this)'>删除</button></td><tr>";
    }
		
}	

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(th) {
  // do sth.
  var city=th.dataset.city;
  delete aqiData[city];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").onclick = addBtnHandle;

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  
}

init();