
jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud","jetsentree", "datepicker", "menu"]);
var colomDataCount;
var assignData;
colomDataCount =  jetsennet.queryString("colomData");
assignDataCount = jetsennet.queryString("assignData");

var colomObj = eval(colomDataCount); 
var assignObj = eval(assignDataCount);


var colomData = new Array();
var colomNameData = new Array();
for(var i=0 ;i<colomObj.length;i++){
	colomNameData[i] = colomObj[i].NAME;
	var tempobj= new Object();
	tempobj.value=colomObj[i].VALUE;
	tempobj.name=colomObj[i].NAME;
	colomData[i]=tempobj;	
}

var assignData = new Array();
var assignNameData = new Array();
for(var i=0 ;i<assignObj.length;i++){
	assignNameData[i] = assignObj[i].NAME;
	var tempobj= new Object();
	tempobj.value=assignObj[i].VALUE;
	tempobj.name=assignObj[i].NAME;
	assignData[i]=tempobj;	
}


var colomChart = document.getElementById('colom');
var colomOption = {
	    title : {
	        text: '栏目使用数量统计',
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
	            mark : {show: false},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: false, 
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
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[{value:100, name:'暂无记录'}]
	        }
	    ]
	};
// 路径配置
eval(colomOption).legend.data=colomNameData;
eval(colomOption).series[0].data=colomData;

var assignChart = document.getElementById('assign');
var assignOption = {
	    title : {
	        text: '资源使用信息统计',
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
	            mark : {show: false},
	            dataView : {show: true, readOnly: false},
	            magicType : {
	                show: false, 
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
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[{value:100, name:'暂无记录'}]
	        }
	    ]
	};
eval(assignOption).legend.data=assignNameData;
eval(assignOption).series[0].data=assignData;

function setOption(){
	
}


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
             var colomChartPie = ec.init(colomChart); 
             colomChartPie.setOption(colomOption); 
             
             var assignChartPie = ec.init(assignChart); 
             assignChartPie.setOption(assignOption);
         }
     );        



       