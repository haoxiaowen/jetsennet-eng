/**
 *  事件统计饼图
 *  @author  2016-12-22
 */

jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud"]); 
var startTime = jetsennet.queryString("gStartTime");
var endTime = jetsennet.queryString("gEndTime");
var chartDy = document.getElementById('main');
var chartSb = document.getElementById('main1');
var goptionDy = {
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


var goptionSb = {
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
	setDy();
	setSb();
	generateDy();
	generateSb();
	onloadPie();

}

function setSb(){
	var obj = eval(goptionSb);
	obj.title.text="设备统计事件";
	obj.title.subtext="";
	obj.series[0].name="设备统计";
}

function setDy(){
	var obj = eval(goptionDy);
	obj.title.text="单元统计事件";
	obj.title.subtext="";
	obj.series[0].name="单元统计";
}



function generateDy(){
	var conditions = [];
	console.info(endTime);
	var endTimes=endTime+" 23:59:59";
	if(startTime!=null&&startTime!=""){
    	conditions.push([ "au.RETU_TIME", startTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(endTime!=null&&endTime!=""){
    	conditions.push([ "au.RETU_TIME", endTimes, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
    //  select  count(ITEM_RESULT) SBS from PPN_RENT_IN_ITEM GROUP by ITEM_RESULT
	var jointables =  [["PPN_RENT_RETURN", "au", "t.RETU_ID = au.RETU_ID", jetsennet.TableJoinType.Inner],["PPN_RENT_OBJ_TYPE", "f", "f.OBJ_TYPE_ID = t.ITEM_OBJ_TYPE", jetsennet.TableJoinType.Inner]];
	var resultFields = "sum(ITEM_OBJ_UOM_SUM) DY, f.OBJ_TYPE_NAME";
	var queryDy = SYSDAO.query("commonXmlQuery", null, "PPN_RENT_IN_ITEM", "t", jointables, conditions, resultFields,null,"f.OBJ_TYPE_NAME");
	if (queryDy && queryDy.resultVal) {
		if (jetsennet.xml.deserialize(queryDy.resultVal, "Record") != null) {
			var objDy = null;
			objDy = jetsennet.xml.deserialize(queryDy.resultVal, "Record");
//			var len = objPie.length;
			setOptionDy(objDy);
		}
	}
}



/**
 * 生成统计饼图数据
 */
function generateSb(){
	var conditions = [];
	var endTimes=endTime+" 23:59:59";
	if(startTime!=""&&startTime!=null){
    	conditions.push([ "au.RETU_TIME", startTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(endTime!=""&&endTime!=null){
    	conditions.push([ "au.RETU_TIME", endTimes, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
    //  select  count(ITEM_RESULT) SBS from PPN_RENT_IN_ITEM GROUP by ITEM_RESULT
	var jointables =  [["PPN_RENT_RETURN", "au", "t.RETU_ID = au.RETU_ID", jetsennet.TableJoinType.Inner]];
	var resultFields = "count(ITEM_RESULT) SUM, ITEM_RESULT";
	var queryRes = SYSDAO.query("commonXmlQuery", null, "PPN_RENT_IN_ITEM", "t", jointables, conditions, resultFields,null,"t.ITEM_RESULT");
	if (queryRes && queryRes.resultVal) {
		if (jetsennet.xml.deserialize(queryRes.resultVal, "Record") != null) {
			var objPie = null;
			objPie = jetsennet.xml.deserialize(queryRes.resultVal, "Record");
//			var len = objPie.length;
			setOptionSb(objPie);
		}
	}
}


function setOptionDy(objDy){
	var objDys = eval(goptionDy);
	var len = objDy.length;
	var legenddata= new Array();
	var serdata = new Array();
	for (var i = 0; i < len; i++) {
//		console.debug(objPie[i].TARGET_TYPE_TXT);
//		console.debug(objPie[i].TARGET_TYPE_TXT);
		legenddata[i]=objDy[i].OBJ_TYPE_NAME;
		var tempobj= new Object();
		tempobj.value=objDy[i].DY;
		tempobj.name=objDy[i].OBJ_TYPE_NAME;
		serdata[i]=tempobj;	
	}
	objDys.legend.data=legenddata;
	objDys.series[0].data = serdata;
//	console.debug(obj.series[0].data);
	
}


/**
 * 饼图数据填充
 * @param objPie
 */
function setOptionSb(objPie){
	var objSb = eval(goptionSb);
	var len = objPie.length;
	var legenddata= new Array();
	var serdata = new Array();
	for (var i = 0; i < len; i++) {
//		console.debug(objPie[i].TARGET_TYPE_TXT);
//		console.debug(objPie[i].TARGET_TYPE_TXT);
		var tempobj= new Object();
		tempobj.value=objPie[i].SUM;
		tempobj.name=objPie[i].ITEM_RESULT;
		serdata[i]=tempobj;	
		if(objPie[i].ITEM_RESULT==1){
			legenddata[i]='入库';
			tempobj.name='入库';
		}else if (objPie[i].ITEM_RESULT==0){
			legenddata[i]='待定';
			tempobj.name='待定';
		}else if(objPie[i].ITEM_RESULT==2){
			legenddata[i]='保养';
			tempobj.name='保养';
		}else if (objPie[i].ITEM_RESULT==3){
			legenddata[i]='维修';
			tempobj.name='维修';
			
		}else if (objPie[i].ITEM_RESULT==4){
			legenddata[i]='报废';
			tempobj.name='报废';
			
		}else if (objPie[i].ITEM_RESULT==5){
			legenddata[i]='丢失';
			tempobj.name='丢失';
			
		}
			
		
	}
	objSb.legend.data=legenddata;
	objSb.series[0].data = serdata;
//	console.debug(obj.series[0].data);
	
}


//-------------------------------------------------------------------------------------------
//路径配置
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
          var myChart = ec.init(chartDy); 
          // 为echarts对象加载数据 
          myChart.setOption(goptionDy);
          var myCharts = ec.init(chartSb); 
          // 为echarts对象加载数据 
          myCharts.setOption(goptionSb);
      }
  );        
}

