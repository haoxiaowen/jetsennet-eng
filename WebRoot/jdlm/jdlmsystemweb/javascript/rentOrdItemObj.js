jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");  
 var startTime;
 var endTime;
 startTime= jetsennet.queryString("startTime");
 endTime= jetsennet.queryString("endTime");
 var conditions=[];
 if(startTime!=null && startTime!="" && startTime!="undefined"){
		conditions.push([ "t.ITEM_START_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);		
	}
	if(endTime!=null && endTime!="" && endTime!="undefined"){
		conditions.push(["t.ITEM_END_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
	 		
	}
  var jsontotal=SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_ORD_ITEM", "t",null ,conditions, "sum(ITEM_OBJ_NUM) a1,sum(ITEM_OBJ_UOM_SUM) a2,ITEM_OBJ_TYPE",null,"t.ITEM_OBJ_TYPE")
 var total=SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_ORD_ITEM", "t", null,conditions, "sum(ITEM_OBJ_NUM) a1,sum(ITEM_OBJ_UOM_SUM) a2");
  var dataName1=[];
  var dataName2=[];
  var dataOBJ=[];
  var dataOUM=[];
  if(jsontotal){
	  for(var i=0;i<jsontotal.length;i++){
		  var obj={value:1,name:"1"};
		  obj.value=jsontotal[i].A1; 
		  var typeOBJ=SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE", "t", null,[["t.OBJ_TYPE_ID", jsontotal[i].ITEM_OBJ_TYPE, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
		 var typeName= typeOBJ[0].OBJ_TYPE_NAME;
		 obj.name=typeName+":  "+jsontotal[i].A1;
		  dataName1.push(obj.name);
		  dataOBJ.push(obj);
	  }
  
  }
  var obj1=new Object();
  obj1.name="申请借用设备总数量"+":  "+total[0].A1
  obj1.value=total[0].A1;
  //dataOBJ.push(obj1);
  dataName1.push(obj1.name)
  if(jsontotal){
	  for(var i=0;i<jsontotal.length;i++){
		  var obj={value:1,name:"1"};
		  obj.value=jsontotal[i].A2;
		  var typeOBJ=SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ_TYPE", "t", null,[["t.OBJ_TYPE_ID", jsontotal[i].ITEM_OBJ_TYPE, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]]);
		  var typeName= typeOBJ[0].OBJ_TYPE_NAME;
		  obj.name=typeName+":  "+jsontotal[i].A2;
		  dataName2.push(obj.name);
		  dataOUM.push(obj);
	  }
  
  }
  var obj2=new Object();
  obj2.name="申请借用单元总数量"+":  "+total[0].A2
  obj2.value=total[0].A2;
  //dataOUM.push(obj2);
  dataName2.push(obj2.name)
var gChart1 = document.getElementById('main1');
var gOption1 = {
	    title : {
	        text: '申请借用设备数量',
	        subtext: '不同类型',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:dataName1
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
	            data:dataOBJ
	        }
	    ]
	};


var gChart2 = document.getElementById('main2');
var gOption2 = {
	    title : {
	        text: '申请借用单元数量',
	        subtext: '不同类型',
	        x:'center'
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    },
	    legend: {
	        orient : 'vertical',
	        x : 'left',
	        data:dataName2
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
	            data:dataOUM
	        }
	    ]
	};

function setOption(){
	
}

//-------------------------------------------------------------------------------------------
// 路径配置
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
             var myChart1 = ec.init(gChart1); 
             // 为echarts对象加载数据 
             myChart1.setOption(gOption1); 
             var myChart2 = ec.init(gChart2); 
             // 为echarts对象加载数据 
             myChart2.setOption(gOption2); 
         }
     );        




       