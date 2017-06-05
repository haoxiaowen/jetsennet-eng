jetsennet.require(["pageframe", "window", "gridlist", "pagebar","datepicker", "tabpane", "validate", "crud","bootstrap/moment","bootstrap/daterangepicker","plugins"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var CHANDAO = new jetsennet.DefaultDal("ChnanalService");

var GROUP_TYPE=unescape(jetsennet.queryString("GROUP_TYPE"));
var txtStartDate=unescape(jetsennet.queryString("txtStartDate"));
var txtEndDate=unescape(jetsennet.queryString("txtEndDate"));
function pageInit(){
	tjExcedate();
	tjExcedateSource();
	setOptionshow();
	setSOptionshow();
	
}
var source = document.getElementById('source');      
var gChart = document.getElementById('main');
var gOption = {
	    title : {
	        text: '时长统计',
	        subtext: '',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['暂无记录']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 1548
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '45%',
	            center: ['50%', '60%'],
	            data:[
	                
	                {value:100, name:'暂无记录'}
	            ]
	        }
	    ]
	};


function setOption(objPie){
	var obj = eval(gOption);
	var len = objPie.length;
	var legenddata= new Array();
	var serdata = new Array();
	if(objPie!=null&&objPie!=""){
	for (var i = 0; i < len; i++) {
        legenddata[i]=objPie[i].GROUP_TJNAME+":"+jetsennet.util.convertLongToTime(objPie[i].GROUP_DURATION, 25,false);
		var tempobj= new Object();
		tempobj.value=objPie[i].GROUP_DURATION;
		tempobj.name=objPie[i].GROUP_TJNAME+":"+jetsennet.util.convertLongToTime(objPie[i].GROUP_DURATION, 25,false);
		serdata[i]=tempobj;	
	}}
	obj.legend.data=legenddata;
	obj.series[0].data = serdata;
//	console.debug(obj.series[0].data);
	
}

function setOptionshow(){
	require.config({
        paths: {
            echarts: '../../jetsenclient/javascript/echarts/slide/js/dist'
        }
		});

require(
      [
          'echarts',
          'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
      ],
      function (ec) {
     	
          // 基于准备好的dom，初始化echarts图表
          var myChart = ec.init(gChart); 
          // 为echarts对象加载数据 
          myChart.setOption(gOption); 
      }
  );        
}


function tjExcedate(){
    var params = new HashMap();
    params.put("GROUP_TYPE", GROUP_TYPE);	
    params.put("txtStartDate", txtStartDate);	
    params.put("txtEndDate", txtEndDate);	
	  CHANDAO.execute("selectTj", params, 
   		{success : function(result) {
   			setOption(jetsennet.xml.toObject(result, "Record"));
   			
   		 },
   		 error : function(ex){
   			 jetsennet.error(ex);
   		 },
   		 wsMode:"WEBSERVICE"
   });
    
}
/*****************************************************************来源********************************************/

var SourcegOption = {
	    title : {
	        text: '来源系统统计',
	        subtext: '',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:['暂无记录']
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: true, 
	                type: ['pie', 'funnel'],
	                option: {
	                    funnel: {
	                        x: '25%',
	                        width: '50%',
	                        funnelAlign: 'left',
	                        max: 1548
	                    }
	                }
	            },
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : true,
	    series : [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius : '45%',
	            center: ['50%', '60%'],
	            data:[
	                
	                {value:100, name:'暂无记录'}
	            ]
	        }
	    ]
	};


function setSOption(objPie){
	var obj = eval(SourcegOption);
	var len = objPie.length;
	var legenddata= new Array();
	var serdata = new Array();
 if (objPie!=null&&objPie!=""){
	for (var i = 0; i < len; i++) {
        legenddata[i]=objPie[i].GROUP_TJNAME+":"+jetsennet.util.convertLongToTime(objPie[i].GROUP_DURATION, 25,false);
		var tempobj= new Object();
		tempobj.value=objPie[i].GROUP_DURATION;
		tempobj.name=objPie[i].GROUP_TJNAME+":"+jetsennet.util.convertLongToTime(objPie[i].GROUP_DURATION, 25,false);
		serdata[i]=tempobj;	
	}
 }
	obj.legend.data=legenddata;
	obj.series[0].data = serdata;
//	console.debug(obj.series[0].data);
	
}

function setSOptionshow(){
	require.config({
        paths: {
            echarts: '../../jetsenclient/javascript/echarts/slide/js/dist'
        }
		});

require(
      [
          'echarts',
          'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
      ],
      function (ec) {
     	
          // 基于准备好的dom，初始化echarts图表
          var myChart = ec.init(source); 
          // 为echarts对象加载数据 
          myChart.setOption(SourcegOption); 
      }
  );        
}


function tjExcedateSource(){
    var params = new HashMap();
    params.put("GROUP_TYPE", GROUP_TYPE);	
    params.put("txtStartDate", txtStartDate);	
    params.put("txtEndDate", txtEndDate);	
	  CHANDAO.execute("selectTjSource", params, 
   		{success : function(result) {
   			setSOption(jetsennet.xml.toObject(result, "Record"));
   			
   		 },
   		 error : function(ex){
   			 jetsennet.error(ex);
   		 },
   		 wsMode:"WEBSERVICE"
   });
    
}




       