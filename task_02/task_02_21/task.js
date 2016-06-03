var colors = ['#d7f0f8','#99b4ce', '#9ea7bb', '#bec3cb', '#c1b9c2','#edae9e', '#b38e95','#5a4563','#4e4a67'];



  String.prototype.trim=function(){
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
　　 }           
  $ = function (el) { return document.querySelector(el); };
  $$ = function (el) { return document.querySelectorAll(el); };

  var tagArray=[];
  var interestArray=[];

  try{
     
    var tagInput=$('#tag-input')
    var conform=$("button");
    var tagShow=$("#tag-show");
    var interestShow=$("#interest-show");
  }catch(e){
     alert(e.message);
  }
  

  //事件跨浏览器
  var EventUtil={
  	addHandler:function(element,type,handler){
         if (element.addEventListener) {
         	 element.addEventListener(type,handler,false);
         }else if (element.attachEvent) {
         	  element.attachEvent("on"+type,handler);
         }else{
         	 element["on"+type]=handler;
         }
  	},

  	removeHandler:function(element,type,handler){
         if (element.removeEventListener) {
         	  element.removeEventListener(type,handler,false);
         }else if (element.detachEvent) {
         	   element.detachEvent("on"+type,handler);
         }else{
         	   element["on"+type]=null;
         }
  	},

    getEvent:function(event){
      	return event ? event : window.event;
    },

  	getTarget:function(event){
          return event.target||event.srcElement;
  	},

    getCharCode:function(event){
       if (typeof event.charCode == "number" && event.charCode != 0) {//红宝书好像有错，实际上chrome的charCode=0，eventCode是键码
           return event.charCode;
       }else{
          return event.keyCode;
       }
    }
  }
  
  //渲染Tag，tag每次最多建立一个，用push()和shift()即可
   function renderTag(name){ 
      tagArray.push(name);
      tagShow.innerHTML += "<div>" + name + "</div>";
 
      if (tagArray.length > 10) {
         tagArray.shift();
         tagShow.removeChild(tagShow.firstChild);
      }


   }

   // 按下符号键，如，。、；‘【】=和空格键等，并且输入框内容不为空会新建一个标签并清空输入框
   function setTag(event){
     event = EventUtil.getEvent(event);
     var target = EventUtil.getTarget(event);
     if (event.data.match(/[^A-Za-z0-9\u4e00-\u9fa5]/)) {
         if (target.value) {
           renderTag(target.value); 
         }
          
         EventUtil.addHandler(target,"keyup",function(){
            target.value=null;
            EventUtil.removeHandler(target,"keyup",arguments.callee);
          });
     }
   }

  //用keypress事件补充textInput事件无法监听的tab键和enter键
   function specialTag(event){
     event = EventUtil.getEvent(event);
     var target = EventUtil.getTarget(event);
     var code = EventUtil.getCharCode(event);

     if ((code==9||code==13)&&target.value) {
        renderTag(target.value);
        target.value = null;
     }
   }

   //数据提取
  function getValue(value){
     var data=[];
     data=value.split(/[^A-Za-z0-9\u4e00-\u9fa5]+/);
     var l=data.length;
     if (!data[0]) {
      data.shift();
     }
     if (l > 1 && !data[l-1]) {
       data.pop();
     }                                                                  
     return data;
  }

//兴趣的标签渲染
  function setInterest(){
     var interestInut = $('#interest-input');

     var data = getValue(interestInut.value); 
     if (data){

        interestArray = interestArray.concat(data);        
        var str = "";
        for (var i = 0,l = data.length; i < l; i++) {
          str += "<div>" + data[i] + "</div>";
        }        
        interestShow.innerHTML += str;

        var len=interestArray.length;
        if (len > 10) {
            interestArray.splice(0,len-10);
            for (var i = 0; i < l - 10; i++) {
              interestShow.removeChild(firstChild);//由于div上有单独的mouseleavea事件，所以没整体用innerHTML
            }
        }
 
     } 
     interestInut.value="";
                  
  }
 
 //鼠标移动事件，事件委托
 function overSet(event){
    event = EventUtil.getEvent(event);
    var target = EventUtil.getTarget(event);
    if (target.className !== "show") {
       target.style.background = colors[0];
       target.firstChild.insertData("0","点击删除 ");
      
      if (!target.onmouseleave) {//当还没有mouseleave事件时添加
        target.onmouseleave=function(){
           target.style.background = colors[1];
           target.firstChild.deleteData("0",5);  
        }
          
      }      
    }
 }

  //加删除元素事件(整体)
  function deleteEvent(event,numArray){
     return function(event){
        event=EventUtil.getEvent(event);
        var target=EventUtil.getTarget(event);
        var position=getClickIndex(target);
        if (position>-1) {
            numArray.splice(position,1);
            target.parentNode.removeChild(target);
        }   
     }       
  }      

//获取点击元素的位置
  function getClickIndex(node) {
    if (node.className == "show"){
        return -1;
    }else{
      return Array.prototype.indexOf.call(node.parentNode.children, node);
    }
    
  }


  
  EventUtil.addHandler(tagInput,"textInput",setTag);
  EventUtil.addHandler(tagInput,"keydown",specialTag);
  EventUtil.addHandler(tagShow,"click",deleteEvent(event,tagArray));
  EventUtil.addHandler(interestShow,"click",deleteEvent(event,interestArray));
  EventUtil.addHandler(tagShow,"mouseover",overSet);
  EventUtil.addHandler(interestShow,"mouseover",overSet);
  EventUtil.addHandler(conform,"click",setInterest);
