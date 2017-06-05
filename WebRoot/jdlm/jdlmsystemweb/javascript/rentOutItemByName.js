jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");  
 var startTime;
 var endTime;
 startTime= jetsennet.queryString("startTime");
 endTime= jetsennet.queryString("endTime");
 var textName= jetsennet.queryString("textName");
 var conditions=[];
 if(startTime!=null && startTime!="" && startTime!="undefined" ){
		conditions.push([ "au.OUT_CREATE_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);		
	}
	if(endTime!=null && endTime!="" && endTime!="undefined" ){
		conditions.push(["au.OUT_CREATE_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
	 		
	}
	if(textName!=null && textName!="" && textName!="undefined" ){
		conditions.push(["ob.OBJ_NAME", textName, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String]);
	}
 var joinTables =[["PPN_RENT_OUT", "au", "t.OUT_ID = au.OUT_ID", jetsennet.TableJoinType.Inner], ["PPN_RENT_OBJ", "ob", "ob.OBJ_CODE= t.ITEM_OBJ_CODE", jetsennet.TableJoinType.Inner]];
  //var resultFields="sum(ITEM_OBJ_NUM) a1,sum(ITEM_OBJ_UOM) a2,ob.OBJ_NAME n";
  var groupFields="t.ITEM_OBJ_CODE";


  var jsontotal=SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_OUT_ITEM", "t",joinTables ,conditions, "sum(ITEM_OBJ_NUM) A1,sum(ITEM_OBJ_UOM) A2,OBJ_NAME",null,"ob.OBJ_NAME")
  var total=SYSDAO.queryObjs("commonXmlQuery", "ITEM_ID", "PPN_RENT_OUT_ITEM", "t", joinTables,conditions, "sum(ITEM_OBJ_NUM) A1,sum(ITEM_OBJ_UOM) A2");
  var dataName1=[];
  var dataName2=[];
  var dataOBJ=[];
  var dataOUM=[];
  if(jsontotal){
	  for(var i=0;i<jsontotal.length;i++){
		  var obj={value:1,name:"1"};
		  obj.value=jsontotal[i].A1; 
		  obj.name=jsontotal[i].OBJ_NAME+":  "+jsontotal[i].A1;
		  dataName1.push(obj.name);
		  dataOBJ.push(obj);
	  }
  
  }
  var obj1=new Object();
  obj1.name="设备使用总次数"+":  "+total[0].A1
  obj1.value=total[0].A1;
  //dataOBJ.push(obj1);
  dataName1.push(obj1.name)
 
  if(jsontotal){
	  for(var i=0;i<jsontotal.length;i++){
		  var obj={value:1,name:"1"};
		  obj.value=jsontotal[i].A2;
		  obj.name=jsontotal[i].OBJ_NAME+":  "+jsontotal[i].A2;
		  dataName2.push(obj.name);
		  dataOUM.push(obj);
	  }
  
  }
  var obj2=new Object();
  obj2.name="借出总天数"+":  "+total[0].A2
  obj2.value=total[0].A2;
  //dataOUM.push(obj2);
  dataName2.push(obj2.name)
var gChart1 = document.getElementById('main1');

var gOption1 = {
	    title : {
	        text: '设备使用次数统计',
	        subtext: '不同设备',
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
	  /*  toolbox: {
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
	    },*/
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
	        text: '使用天数统计',
	        subtext: '不同设备',
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
	 /*   toolbox: {
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
	    },*/
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




       