//jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud","jetsentree", "datepicker", "menu"]);
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);

var ENGDAO = new jetsennet.DefaultDal("PpnEngService");
ENGDAO.dataType = "xml";

var assignIds =  jetsennet.queryString("dev_id");
var assignId = assignIds.split(","); 


var dataCount = 1;
var assignObj = new Object();
var chartCount = 1;//assignId.length;
/**
 * 页面初始化
 */
function pageInit() { 
	createDiv();
	getData();
	setOption();
	addOnclick();
}

/**
 * 创建图表所需要的div容器
 */
function createDiv(){
	if(chartCount == 1){
		//var assignMsg = JSON.stringify(assignObj[0]).replace(/\"/g,"#");
		$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-12"><div id="lineData'+assignId[0]+'" class="mychart-1"></div></div>');
	}else if(chartCount == 2){
		var n = 0;
		while(n < chartCount){
			var dataId = assignId[n];
			//var assignMsg = JSON.stringify(assignObj[n]).replace(/\"/g,"#");
			$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-6"><div id="lineData'+dataId+'" class="mychart-2"></div></div>');
			n++;
		}
	}else{
		var i = 0;
		while(i < chartCount){
			var dataId = assignId[i];
			//var assignMsg = JSON.stringify(assignObj[i]).replace(/\"/g,"#");
			$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-4"><div id="lineData'+dataId+'" class="mychart-3"></div></div>');
			i++;
		}
	}
}

var option = {
		//backgroundColor: '#C1C1C1',
		title: {
	        text: '设备未启用'
	    },
	    grid:{
            x:30,
            y:35,
            x2:35,
            y2:35,
            borderWidth:1
        },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	    	data:['CPU', '内存']
	    },
	    toolbox: {
	    	x : 300,
	    	y : 5,
	        show: true,
	        feature: {
	        	restore:{show: false},
	        	dataView : {show: false, readOnly: true},
	            saveAsImage: {show: false}
	        }
	    },
	    xAxis: [
			       {
			            type : 'category',
			            boundaryGap : false,
			            show:false,
			            data : ['','','','','','','','','','']
			        }
    			],
	    yAxis:[{
		        type: 'value',
		        max: 100,
		        min: 0,
		        scale: true
	    		},
	    		{
	    		type: 'value',
		        max: 100,
		        min: 0,
		        scale: true
	    		}
	    	],
	    series: [{
				    name:'CPU',
				    type:'line',
				    smooth:true,
				    data: [0]
				},
				{
		            name:'内存',
		            type:'line',
		            smooth:true,
		            data:[0]
		        }]
		
    };


require.config({
    paths: {
        echarts: '../../jetsenclient/javascript/echarts/slide/js/dist'
    }
	});


var date = new Array(10);
var dataCPU = new Object();
var dataMEMORY = new Object();
function setOption(){
	require(
			[
			 'echarts',
			 'echarts/chart/line',
			 ],
			 function (ec) {
				for(var n = 0 ; n < chartCount ; n++){
					var charts = document.getElementById('lineData'+assignId[n]);
					var optionLine = ec.init(charts); 
					optionLine.setOption(option);
					optionLine.setOption({
	    				  title: {
	    					  text: '设备'+assignId[n]+'未启用'
	    				  }
	    			  });
				}
				setInterval(function () {
					getData();
					//for(var m = 0 ; m<chartCount ; m++){
						for(var n = 0 ; n<dataCount ; n++){
							//if(assignId[m] == assignObj[n].id){
								var charts = document.getElementById('lineData'+assignObj[n].id);
								var optionLine = ec.init(charts); 
							    optionLine.setOption(option);
								    dataCPU["c"+assignObj[n].id].push(parseInt(assignObj[n].cpu));
								    dataMEMORY["m"+assignObj[n].id].push(parseInt(assignObj[n].memory));
								    if(dataCPU["c"+assignObj[n].id].length > 10){
								    	dataCPU["c"+assignObj[n].id].shift();
								    	dataMEMORY["m"+assignObj[n].id].shift();
								     }
					    			 optionLine.setOption({
					    				  backgroundColor: 'white',
					    				  title: {
					    					  text: '设备'+assignObj[n].id
					    				  },
					    				  xAxis: {
					    					  data: date
					    				  },
					    				  series: [{
					    					  name:'CPU',
					    					  data: dataCPU["c"+assignObj[n].id]
					    				  },{
					    					  name:'内存',
					    					  data: dataMEMORY["m"+assignObj[n].id]
					    				  }]
					    			  });
							//}
						}
					//}
				},5000);
			}
	);   
}



function getData(){
	var params = new HashMap();
    params.put("devCode", assignIds);
    params.put("reqId", 1);
    ENGDAO.execute("getDevInfo", params, 
    	 {success : function(resultVal) {
    		 if(resultVal){
    			 alert("process:"+resultVal);
    			 return;
    			 var colomObj = eval(resultVal); 
    			 alert(colomObj);
 				 //dataCount = colomObj.length;
 				 assignObj = colomObj;
 				 addOnclick();
 				 /*
 				 for(var k = 0;k < chartCount; k++){
 					 for(var j = 0;j < dataCount;j++){
 						 if(assignId[k] == colomObj[j].id){
 							 if(!dataCPU["c"+assignObj[j].id]){
 								 dataCPU["c"+assignObj[j].id] = new Array(10);
 							 }
 							 if(!dataMEMORY["m"+assignObj[j].id]){
 								 dataMEMORY["m"+assignObj[j].id] = new Array(10);
 							 }
 						 }
 					 }
				 }
 				 */
 			}
    	  },
    	  wsMode:"WEBSERVICE"
    	 }
    
    );
   
	/*var params = new HashMap();
    params.put("controlNumber", "CTL20161222201100001");
    params.put("jsonString", "123456");
    PPNDAO.execute("ppnExecuteBusiness", params, 
    		{success : function(resultVal) {
    			if(resultVal){
    				var colomObj = eval(resultVal); 
    				dataCount = colomObj.length;
    				assignObj = colomObj;
    				for(var k = 0;k < chartCount; k++){
						 for(var j = 0;j < dataCount;j++){
							 if(assignId[k] == colomObj[j].id){
								 if(!dataCPU["c"+assignObj[j].id]){
									 dataCPU["c"+assignObj[j].id] = new Array(10);
								 }
								 if(!dataMEMORY["m"+assignObj[j].id]){
									 dataMEMORY["m"+assignObj[j].id] = new Array(10);
								 }
							 }
						 }
   				    }
    			}
    		 },
    		 error : function(ex){
    			 jetsennet.error(ex);
    		 },
    		 wsMode:"WEBSERVICE"
    });*/
}


function addOnclick(){
	for(var k = 0;k < chartCount; k++){
		 for(var j = 0;j < dataCount;j++){
			 if(assignId[k] == assignObj[j].id){
				 var devMsg = JSON.stringify(assignObj[j]).replace(/\"/g,"#");
				 var chartDiv = document.getElementById("lineData"+assignId[k]);
				 chartDiv.onclick = function(){
					 window.open("../../jdlm/jdlmsystemweb/deviceProgress.htm?dev_msg="+devMsg);
				 }
			 }
		 }
	}
}
