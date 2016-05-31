/***
   数据存放在数组
   每次增加元素或删除元素，都会根据numArray全部重新渲染；
   元素的背景颜色每次渲染都会重新改变改变   
**/
var colors = ['#d7f0f8','#99b4ce', '#9ea7bb', '#bec3cb', '#c1b9c2','#edae9e', '#b38e95','#5a4563','#4e4a67', '#393f65', '#24385e',  '#16324a'];

    var numArray=[];

    String.prototype.trim=function(){
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
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
    	}
    }

    //按钮事件监听，处理数据并渲染
    function handler(event){
         event=EventUtil.getEvent(event);
         var target=EventUtil.getTarget(event);
         // alert(target);
         var inputValue=document.getElementById("num-input").value.trim();

         switch(target.id){
         	case "leftIn":
	         	if (vertify(inputValue)) {
	         		numArray.unshift(inputValue);	
	         		render();                            		
	         	}                
                break;
         	case "rightIn":
         	if (vertify(inputValue)) {
	         		numArray.push(inputValue);
	         		render();
	         	} 
                break;
         	case "leftOut":         	
                numArray.shift();
                render();
                break;
         	case "rightOut":
                numArray.pop();
                render();             
                break;
         	default:
         	   break;

         }                        
    }


//渲染列表,整体重新渲染
    function render(){
       var show=document.getElementById("show");
       var str="";
       var colorLen=colors.length;
   

   //移除点击事件
      for (var i = 0,ln=show.childNodes.length;i<ln; i++) {
      	(function(position){
      		var childDiv=show.childNodes[position];
      		if (childDiv.nodeType==1) {
      			EventUtil.removeHandler(show.childNodes[position],"click",deleteNum(position));
      		}
			
      	})(i);
      	 
      }

//渲染
       for (var i = 0,l=numArray.length; i < l; i++) {
       	 str+="<div style='background:"+colors[i%colorLen]+"'>"+numArray[i]+"</div>";
       }
       show.innerHTML=str;
       str="";
       addDeleteEvent(show);
    }

    //数据验证
    function vertify(value){
       if (value=="") {
       	 alert("输入不能为空");
       	 return false;
       }else if (!value.match(/^[0-9]*$/)) {
       	 alert("输入必须为数字");
       	 return false;
       }
       return true;
    }

    //加删除元素事件(整体)
    function addDeleteEvent(show){   	
    	for (var i = 0,l=show.childNodes.length; i < l; i++) {

    		(function(position){
    			EventUtil.addHandler(show.childNodes[position],"click",deleteNum(position));
    		})(i);
    		
    	}      
    }
    function deleteNum(position){
    	return function(){
           numArray.splice(position,1);
           render();
		}
	}
    var operate=document.getElementById("operate");
    EventUtil.addHandler(operate,"click",handler);