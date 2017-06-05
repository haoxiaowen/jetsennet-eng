//jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud","jetsentree", "datepicker", "menu"]);
jetsennet.require(["pageframe", "window", "gridlist", "pagebar","timeeditor", "tabpane", "validate","bootstrap/bootstrap", "bootstrap/moment", "bootstrap/daterangepicker", "crud","plugins"]);

var ENGDAO = new jetsennet.DefaultDal("PpnEngService");
ENGDAO.dataType = "xml";

var assignId =  jetsennet.queryString("dev_id");
var assignObj = new Object();
var chartCount = 0;
/**
 * 页面初始化
 */
function pageInit() { 
	getData();
	createDiv();
	setOption();
}

/**
 * 创建图表所需要的div容器
 */
function createDiv(){
	if(chartCount == 1){
		var assignMsg = JSON.stringify(assignObj[0]).replace(/\"/g,"#");
		$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-12"><div id="lineData'+assignObj[0].id+'" class="mychart-1"></div></div>');
	}else if(chartCount == 2){
		var n = 0;
		while(n < chartCount){
			var dataId = assignObj[n].id;
			var assignMsg = JSON.stringify(assignObj[n]).replace(/\"/g,"#");
			$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-6"><div id="lineData'+dataId+'" class="mychart-2"></div></div>');
			n++;
		}
	}else{
		var i = 0;
		while(i < chartCount){
			var dataId = assignObj[i].id;
			var assignMsg = JSON.stringify(assignObj[i]).replace(/\"/g,"#");
			$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-4"><div id="lineData'+dataId+'" class="mychart-3"></div></div>');
			i++;
		}
	}
}

var option = {
		title: {
	        text: '设备信息'
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
				for(var n = 0 ; n<chartCount ; n++){
					var charts = document.getElementById('lineData'+assignObj[n].id);
					var optionLine = ec.init(charts); 
				    optionLine.setOption(option);
				}
				setInterval(function () {
					getData();
					for(var m = 0 ; m<chartCount ; m++){
						var charts = document.getElementById('lineData'+assignObj[m].id);
						var optionLine = ec.init(charts); 
					    optionLine.setOption(option);
						    dataCPU["c"+assignObj[m].id].push(parseInt(assignObj[m].cpu));
						    dataMEMORY["m"+assignObj[m].id].push(parseInt(assignObj[m].memory));
						    if(dataCPU["c"+assignObj[m].id].length > 10){
						    	dataCPU["c"+assignObj[m].id].shift();
						    	dataMEMORY["m"+assignObj[m].id].shift();
						     }
			    			 optionLine.setOption({
			    				  title: {
			    					  text: '设备'+assignObj[m].id
			    				  },
			    				  xAxis: {
			    					  data: date
			    				  },
			    				  series: [{
			    					  name:'CPU',
			    					  data: dataCPU["c"+assignObj[m].id]
			    				  },{
			    					  name:'内存',
			    					  data: dataMEMORY["m"+assignObj[m].id]
			    				  }]
			    			  });
					}
				},5000);
			}
	);   
}



function getData(){
	var params = new HashMap();
    params.put("para", "{\"CtlCode\":\"00003\"}");
    ENGDAO.execute("executeCommand", params, 
    	 {success : function(resultVal) {
    		 if(resultVal){
    			 var colomObj = eval(resultVal); 
 				chartCount = colomObj.length;
 				assignObj = colomObj;
 				for(var k = 0;k < chartCount; k++){
					if(!dataCPU["c"+assignObj[k].id]){
						dataCPU["c"+assignObj[k].id] = new Array(10);
					}
					if(!dataMEMORY["m"+assignObj[k].id]){
						dataMEMORY["m"+assignObj[k].id] = new Array(10);
					}
				}
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
    				chartCount = colomObj.length;
    				assignObj = colomObj;
    				
    				for(var k = 0;k < chartCount; k++){
    					if(!dataCPU["c"+assignObj[k].id]){
    						dataCPU["c"+assignObj[k].id] = new Array(10);
    					}
    					if(!dataMEMORY["m"+assignObj[k].id]){
    						dataMEMORY["m"+assignObj[k].id] = new Array(10);
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
