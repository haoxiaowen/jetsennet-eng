/**
 *  事件统计饼图
 *  @author  2016-12-22
 */
jetsennet.require([ "gridlist",  "window", "pagebar", "pageframe", "crud"]); 
var startTime = jetsennet.queryString("gStartTime");
var endTime = jetsennet.queryString("gEndTime");
var chartDy = document.getElementById('main');
var chartSb = document.getElementById('main1');
function pageInit(){
	selectAll();
	setDy();
	setSb();
	generateDy();
	generateSb();
	onloadPie();
}
//select count(*) sumTask, sum(task_duration) sumDuration ,sum(TASK_TOTAL_SIZE) sumSize,sum(TASK_AVG_SPEED) sumAvg from ppn_tu_task;
function selectAll(){
	var conditions = [];
	var endTimes=endTime+" 23:59:59";
	if(startTime!=null&&startTime!=""){
    	conditions.push([ "t.TASK_CREATE_TIME", startTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(endTime!=null&&endTime!=""){
    	conditions.push([ "t.TASK_CREATE_TIME", endTimes, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
	var resultFields = "count(*) sumTask, sum(task_duration) sumDuration ,sum(TASK_TOTAL_SIZE) sumSize,sum(TASK_AVG_SPEED) sumAvg";
	var queryDy = SYSDAO.query("commonXmlQuery", null, "PPN_TU_TASK", "t", null, conditions, resultFields,null,null);
	if (queryDy && queryDy.resultVal) {
		var objPie = null;
		objPie = jetsennet.xml.deserialize(queryDy.resultVal, "Record");
		var objPies=eval(objPie);
		
		
		if(objPies[0].SUMDURATION!=null&&objPies[0].SUMDURATION!=""){
			var time = parseInt(objPies[0].SUMDURATION)/90000;
			$("#sumTime").text("共计"+objPies[0].SUMDURATION+"帧 .转换小时为："+time+"  小时.");
		}else{
			$("#sumTime").text("记录为空");
		}
		
		if(objPies[0].SUMTASK!=null&&objPies[0].SUMTASK!=""){
			$("#sumRenWu").text(objPies[0].SUMTASK+" 个.");
		}else{
			$("#sumRenWu").text("记录为空");
		}
		
		
		if(objPies[0].SUMSIZE!=null&&objPies[0].SUMSIZE!=""){
			$("#sumDaXiao").text(objPies[0].SUMSIZE);
		}else{
			$("#sumDaXiao").text("记录为空");
		}
		


		if(objPies[0].SUMTASK!=null&&objPies[0].SUMTASK!=0){
			var ss=parseInt(objPies[0].SUMAVG)/parseInt(objPies[0].SUMTASK);
			$("#sumSuDu").text(ss);
		}else{
			$("#sumSuDu").text("记录为空");
		}
	}
}
//=======================================================================================


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


function setSb(){
	var obj = eval(goptionSb);
	obj.title.text="任务类型统计";
	obj.title.subtext="";
	obj.series[0].name="任务类型统计";
}

function setDy(){
	var obj = eval(goptionDy);
	obj.title.text="任务状态类型统计";
	obj.title.subtext="";
	obj.series[0].name="状态类型统计";
}



function generateDy(){
	var conditions = [];
	console.info(endTime);
	var endTimes=endTime+" 23:59:59";
	if(startTime!=null&&startTime!=""){
    	conditions.push([ "t.TASK_CREATE_TIME", startTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(endTime!=null&&endTime!=""){
    	conditions.push([ "t.TASK_CREATE_TIME", endTimes, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
    //  select  count(ITEM_RESULT) SBS from PPN_RENT_IN_ITEM GROUP by ITEM_RESULT
	//var jointables =  [["PPN_RENT_RETURN", "au", "t.RETU_ID = au.RETU_ID", jetsennet.TableJoinType.Inner],["PPN_RENT_OBJ_TYPE", "f", "f.OBJ_TYPE_ID = t.ITEM_OBJ_TYPE", jetsennet.TableJoinType.Inner]];
    //select count(*) FNAME, TASK_STATUS  FROM ppn_tu_task GROUP BY TASK_STATUS
    
    var resultFields = "count(*) DY, TASK_STATUS OBJ_TYPE_NAME";
	var queryDy = SYSDAO.query("commonXmlQuery", null, "ppn_tu_task", "t", null, conditions, resultFields,null,"t.TASK_STATUS");
	
	
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
    	conditions.push([ "t.TASK_CREATE_TIME", startTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
    }
    if(endTime!=""&&endTime!=null){
    	conditions.push([ "t.TASK_CREATE_TIME", endTimes, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
    }
    //  select  count(ITEM_RESULT) SBS from PPN_RENT_IN_ITEM GROUP by ITEM_RESULT
    //select count(*) FNAME, TASK_TYPE OBJ_TYPE_NAME  FROM ppn_tu_task GROUP BY TASK_TYPE
	//var jointables =  [["PPN_RENT_RETURN", "au", "t.RETU_ID = au.RETU_ID", jetsennet.TableJoinType.Inner]];
    var resultFields = "count(*) SUM, TASK_TYPE ITEM_RESULT";
	var queryRes = SYSDAO.query("commonXmlQuery", null, "ppn_tu_task", "t", null, conditions, resultFields,null,"t.TASK_TYPE");
	
	
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
	
	var objSb = eval(goptionDy);
	var len = objDy.length;
	var legenddata= new Array();
	var serdata = new Array();
	for (var i = 0; i < len; i++) {
//		console.debug(objPie[i].TARGET_TYPE_TXT);
//		console.debug(objPie[i].TARGET_TYPE_TXT);
		var tempobj= new Object();
		tempobj.value=objDy[i].DY;
		tempobj.name=objDy[i].OBJ_TYPE_NAME;
		serdata[i]=tempobj;	
		if(objDy[i].OBJ_TYPE_NAME==1){
			legenddata[i]='待执行';
			tempobj.name='待执行';
		}else if (objDy[i].OBJ_TYPE_NAME==2){
			legenddata[i]='执行中';
			tempobj.name='执行中';
		}else if(objDy[i].OBJ_TYPE_NAME==3){
			legenddata[i]='执行成功';
			tempobj.name='执行成功';
		}else if (objDy[i].OBJ_TYPE_NAME==4){
			legenddata[i]='执行失败';
			tempobj.name='执行失败';
			
		}else if (objDy[i].OBJ_TYPE_NAME==9){
			legenddata[i]='终止';
			tempobj.name='终止';
			
		}

	}
	objSb.legend.data=legenddata;
	objSb.series[0].data = serdata;
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
			legenddata[i]='传输';
			tempobj.name='传输';
		}else if (objPie[i].ITEM_RESULT==2){
			legenddata[i]='转码';
			tempobj.name='转码';
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
//======================================================================