/**
 *  事件统计饼图
 *  @author yyf 2016-12-22
 */

jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud"]); 
var gStartTime = jetsennet.queryString("startTime");
var gEndTime = jetsennet.queryString("endTime"); 
var gChart = document.getElementById('main');
var gOption = {
	    title : {
	        text: '某站点用户访问来源',
	        subtext: '纯属虚构',
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
	            radius : '55%',
	            center: ['50%', '60%'],
	            data:[
	                
	                {value:100, name:'暂无记录'}
	            ]
	        }
	    ]
	};

/**
 * 页面初始化
 */
function pageInit(){
	
	setPieTitle();
	generatePieData();
	onloadPie();
}


function setPieTitle(){
	var obj = eval(gOption);
	obj.title.text="推送事件统计";
	obj.title.subtext="";
	obj.series[0].name="推送事件";
	obj.toolbox.show=false;
}

/**
 * 生成统计饼图数据
 */
function generatePieData(){
	var conditions = [];
	if(gStartTime){
    	conditions.push([ "t.TASK_CREATE_TIME", gStartTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(gEndTime){
    	conditions.push([ "t.TASK_CREATE_TIME", gEndTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
    conditions.push([ "t.TARGET_TYPE", "", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.IsNotNull, jetsennet.SqlParamType.String ]);
	var jointables =  [];
	groupFields = "t.target_type";
	var resultFields = "count(*) T_NUM ,nvl(get_control_word_name('PPN_TSB_TASK','TARGET_TYPE',TARGET_TYPE),'其他') TARGET_TYPE_TXT ";
	var queryRes = SYSDAO.query("commonXmlQuery", "TASK_ID", "PPN_TSB_TASK", "t", jointables, conditions, resultFields,null,groupFields);
	if (queryRes && queryRes.resultVal) {
		if (jetsennet.xml.deserialize(queryRes.resultVal, "Record") != null) {
			var objPie = null;
			objPie = jetsennet.xml.deserialize(queryRes.resultVal, "Record");
//			var len = objPie.length;
			setOption(objPie);
		}
	}
}

/**
 * 饼图数据填充
 * @param objPie
 */
function setOption(objPie){
	var obj = eval(gOption);
	var len = objPie.length;
	var legenddata= new Array();
	var serdata = new Array();
	for (var i = 0; i < len; i++) {
//		console.debug(objPie[i].TARGET_TYPE_TXT);
//		console.debug(objPie[i].TARGET_TYPE_TXT);
		legenddata[i]=objPie[i].TARGET_TYPE_TXT;
		var tempobj= new Object();
		tempobj.value=objPie[i].T_NUM;
		tempobj.name=objPie[i].TARGET_TYPE_TXT;
		serdata[i]=tempobj;	
			
		
	}
	obj.legend.data=legenddata;
	obj.series[0].data = serdata;
//	console.debug(obj.series[0].data);
	
}

//-------------------------------------------------------------------------------------------
// 
function onloadPie(){
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





       