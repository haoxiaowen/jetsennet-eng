jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");  
 
 var startTime;
 var endTime;
 startTime= jetsennet.queryString("startTime");
 endTime= jetsennet.queryString("endTime");
var  textName=jetsennet.queryString("textName");
 var conditions=[];
 	if(startTime!=null && startTime!="" && startTime!="undefined" ){
		conditions.push([ "au.OUT_CREATE_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);		
		conditions.push([ "m.MAINT_REQ_TIME",startTime , jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);
 	}
	if(endTime!=null && endTime!="" && endTime!="undefined" ){
		conditions.push(["au.OUT_CREATE_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
		conditions.push(["m.MAINT_END_TIME", endTime, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);	
	}
	if(textName){
   		conditions.push(["ob.OBJ_NAME", textName, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String]);
   	}
	var joinTables =[
                  ["PPN_RENT_OUT_ITEM", "t", "ob.OBJ_ASS_UID = t.ITEM_OBJ_CODE", jetsennet.TableJoinType.Left],
                  ["PPN_RENT_OUT", "au", "t.OUT_ID = au.OUT_ID", jetsennet.TableJoinType.Left],
                  ["PPN_RENT_MAINT_2_OBJ", "mo", "mo.OBJ_ID = ob.OBJ_ID", jetsennet.TableJoinType.Left],
                  ["PPN_DEV_MAINT", "m", "m.MAINT_ID = mo.MAINT_ID", jetsennet.TableJoinType.Left]]
                  
   
	var resultFields="ob.*,t.*,ob.OBJ_NAME a,au.OUT_CREATE_TIME c,m.*,round(to_number(m.MAINT_END_TIME -m.MAINT_REQ_TIME)) s"




  var total=SYSDAO.queryObjs("commonXmlQuery", null, "PPN_RENT_OBJ", "ob", joinTables,conditions, "sum(ITEM_OBJ_UOM) a1,sum(round(to_number(m.MAINT_END_TIME -m.MAINT_REQ_TIME))) a2");
  var dataName1=[];
  var dataName2=[];
  var dataOBJ=[];
  var dataOUM=[];
  
  var obj1=new Object();
  if(total[0].A1=="" || total[0].A1==null){
	  total[0].A1=0;
  }
  obj1.name="设备使用天数"+":  "+total[0].A1;
  obj1.value=total[0].A1;
  dataName1.push(obj1.name)
  dataOBJ.push(obj1);
  
  var obj2=new Object();
  if(total[0].A2=="" || total[0].A2==null){
	  total[0].A2=0;
  }
  obj2.name="设备维保天数"+":  "+total[0].A2;
  obj2.value=total[0].A2;
  dataName1.push(obj2.name)
  dataOBJ.push(obj2);
  
  var obj3=new Object();
 obj3.name="设备总计天数"+":  "+(parseInt(total[0].A1)+parseInt(total[0].A2));
 /*obj3.value=parseInt(total[0].A1)+parseInt(total[0].A2);
  dataOBJ.push(obj3);*/
  dataName1.push(obj3.name)
 
 
var gChart1 = document.getElementById('main1');

var gOption1 = {
	    title : {
	        text: '设备天数统计',
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
           
         }
     );        




       