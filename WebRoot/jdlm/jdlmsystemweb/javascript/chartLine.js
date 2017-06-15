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
	//var assignMsg = JSON.stringify(assignObj).replace(/\"/g,"#");
	$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-12"><div id="lineData'+assignId+'" class="mychart-1"></div></div>');
	/*if(chartCount == 1){
		var assignMsg = JSON.stringify(assignObj[0]).replace(/\"/g,"#");
		$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-12"><div id="lineData'+assignObj[0].id+'" class="mychart-1" onclick="showLineDataMsg(\''+assignMsg+'\')"></div></div>');
	}else if(chartCount == 2){
		var n = 0;
		while(n < chartCount){
			var dataId = assignObj[n].id;
			var assignMsg = JSON.stringify(assignObj[n]).replace(/\"/g,"#");
			$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-6"><div id="lineData'+dataId+'" class="mychart-2" onclick="showLineDataMsg(\''+assignMsg+'\')"></div></div>');
			n++;
		}
	}else{
		var i = 0;
		while(i < chartCount){
			var dataId = assignObj[i].id;
			var assignMsg = JSON.stringify(assignObj[i]).replace(/\"/g,"#");
			$('#chartsFather').html($('#chartsFather').html()+'<div class="col-lg-4"><div id="lineData'+dataId+'" class="mychart-3" onclick="showLineDataMsg(\''+assignMsg+'\')"></div></div>');
			i++;
		}
	}*/
}

var option = {
		title: {
	        text: '设备'+assignId
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
var dataCPU = new Array(10);
var dataMEMORY = new Array(10);
function setOption(){
	require(
			[
			 'echarts',
			 'echarts/chart/line',
			 ],
			 function (ec) {
				//createDataObj();
				//setInterval(function () {
					
					//for(var m = 0 ; m<chartCount ; m++){
						//var charts = document.getElementById('lineData'+assignObj[m].id);
						var charts = document.getElementById('lineData'+assignId);
						var optionLine = ec.init(charts); 
					    optionLine.setOption(option);
					    setInterval(function () {
					    getData();
					    //dataCPU.push(parseInt(assignObj[m].cpu));
					    //dataMEMORY.push(parseInt(assignObj[m].memory));
					    dataCPU.push(parseInt(assignObj.cpu));
					    dataMEMORY.push(parseInt(assignObj.mem));
					    //console.log(dataCPU.length+"-----------"+m);
					    if(dataCPU.length > 10){
					    	dataCPU.shift();
					    	dataMEMORY.shift();
					     }
		    			 optionLine.setOption({
		    				  title: {
		    					  text: '设备'+assignId
		    					  //text: '设备'+assignObj[m].id
		    				  },
		    				  xAxis: {
		    					  data: date
		    				  },
		    				  series: [{
		    					  name:'CPU',
		    					  data: dataCPU
		    				  },{
		    					  name:'内存',
		    					  data: dataMEMORY 
		    				  }]
		    			  });
					    },5000);
					//}
				//},5000);
			}
	);   
}



function getData(){
	var params = new HashMap();
    params.put("devCode", assignId);
    params.put("reqId", 1);
    ENGDAO.execute("getDevInfo", params, 
    	 {success : function(resultVal) {
    		 if(resultVal){
    			 //alert("process:"+resultVal);
    			 var colomObj = eval("(" + resultVal + ")");
    			 //alert(colomObj);
 				 assignObj = colomObj;
 				 //alert(assignObj.mem);
 			}
    	  },
    	  wsMode:"WEBSERVICE"
    	 }
    
    );
}



function showLineDataMsg(obj){
	el("iframeAssignMsg").src="../../jdlm/jdlmsystemweb/EquipmentControl.htm?assignMsg="+obj;
    var dialog = jQuery.extend(new jetsennet.ui.Window("assignMsg"),{title:"设备监控信息",submitBox:true,cancelBox:false,size:{width:1200,height:600},maximizeBox:false,minimizeBox:false});    
    dialog.controls =["divAssignMsg"];
    dialog.showDialog();
}
