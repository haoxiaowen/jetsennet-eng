jetsennet.require(["window", "gridlist", "pagebar", "jetsentree","datepicker", "validate", "bootstrap/bootstrap", "crud","bootstrap/moment","bootstrap/daterangepicker", "jquery/jquery.md5"]);
jetsennet.importCss(["ztree/zTreeStyle"]);
var CHANDAO = new jetsennet.DefaultDal("ChnanalService");
var gFuncColumns = [
                    { fieldName: "PGM_NAME", sortField: "FILE_NAME", width: 230, align: "center", name: "目标节目名称"},
                    { fieldName: "PGM_CODE", sortField: "TASK_NAME", width: 130, align: "center", name: "目标节目代码"},
                    { fieldName: "GROUP_NAME", sortField: "GROUP_NAME", width: 100, align: "center", name: "源素材名称"},
                    { fieldName: "GROUP_SOURCE", sortField: "GROUP_SOURCE", width: 100, align: "center", name: "源系统"},
                    { fieldName: "GROUP_DURATION", sortField: "GROUP_TIME", width: 100, align: "center", name: "时长" ,format: function(val, vals){
                    	return jetsennet.util.convertLongToTime(val, 25,false);
                    }},
                    { fieldName: "GROUP_MEDIA_TYPE_TXT", sortField: "GROUP_MEDIA_TYPE_TXT", width: 160, align: "center", name: "文件类型"},
                    { fieldName: "USER_NAME", sortField: "USER_NAME", width: 100, align: "center", name: "操作人"},
                    { fieldName: "CREATE_TIME", sortField: "CREATE_TIME", width: 160, align: "center", name: "操作时间"},
                  
              
                   
                   ];
var gCrud = $.extend(new jetsennet.Crud("divContent", gFuncColumns,"divPage", "order by t.GROUP_CREATE_TIME  desc "), {
    dao : SYSDAO,
    tableName : "PPN_TASK_FILEGROUP",
    name : "文件管理",
    className : "jetsennet.jue2.beans.PpnTaskFilegroup",
    cfgId : "divFunction",
    checkId : "chkfile",
       
 });

/**
 * 页面初始化
 */
var gResGridzj = gCrud.grid;
gResGridzj.ondoubleclick = null; 
var type_id=jetsennet.queryString("type_id");
function pageInit() {
	 el('divNavigation').innerHTML = " :: 文件管理";
	 gCrud. joinTables= [ ["PPN_TASK_2_FILE_GROUP","ptfg"," t.GROUP_ID=ptfg.GROUP_ID",jetsennet.TableJoinType.Inner],["PPN_TASK","pt"," pt.TASK_ID=ptfg.TASK_ID",jetsennet.TableJoinType.Inner],["PPN_PGM_PROGRAM","pgm"," pgm.PGM_ID=pt.PGM_ID",jetsennet.TableJoinType.Inner],["UUM_USER","u"," u.ID=t.GROUP_CREATE_USER",jetsennet.TableJoinType.Left]];
   
	 //gCrud.resultFields = "t.*,pgm.*,u.USER_NAME,to_char(t.GROUP_CREATE_TIME,'YYYY-MM-DD hh:mm:ss')  CREATE_TIME,get_control_word_name('PPN_TASK_FILEGROUP','GROUP_MEDIA_TYPE',t.GROUP_MEDIA_TYPE) as GROUP_MEDIA_TYPE_TXT ";
	 gCrud.resultFields = "t.*,pgm.*,u.USER_NAME,date_format(t.GROUP_CREATE_TIME,'%Y-%m-%d %T')  CREATE_TIME,get_control_word_name('PPN_TASK_FILEGROUP','GROUP_MEDIA_TYPE',t.GROUP_MEDIA_TYPE) as GROUP_MEDIA_TYPE_TXT ";
	 var conditions=[];
     conditions.push(["t.GROUP_TYPE",type_id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
     gCrud.search(conditions);
     el("txt_GROUP_TYPE").value=type_id;
     
     
   
}
var ResourceInfo = new Object();
//查询成品文件
function searchfile() {
	var conditions =[];
	 
	    gCrud. joinTables= [ ["PPN_TASK_2_FILE_GROUP","ptfg"," t.GROUP_ID=ptfg.GROUP_ID",jetsennet.TableJoinType.Inner],["PPN_TASK","pt"," pt.TASK_ID=ptfg.TASK_ID",jetsennet.TableJoinType.Inner],["PPN_PGM_PROGRAM","pgm"," pgm.PGM_ID=pt.PGM_ID",jetsennet.TableJoinType.Inner],["UUM_USER","u"," u.ID=t.GROUP_CREATE_USER",jetsennet.TableJoinType.Left]];
	    gCrud.resultFields = "t.*,pgm.*,u.USER_NAME ,to_char(t.GROUP_CREATE_TIME,'YYYY-MM-DD hh:mm:ss')  CREATE_TIME ";
	    if(el('txt_GROUP_TYPE').value!=null&&el('txt_GROUP_TYPE').value!=""){
			 conditions.push(["t.GROUP_TYPE", el('txt_GROUP_TYPE').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
		 }
	    
//	    if(el('txt_GROUP_SOURCE').value!=null&&el('txt_GROUP_SOURCE').value!=""){
//			 conditions.push(["t.GROUP_SOURCE",0, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
//	    }
	    
	    if(el('txtStartDate').value!=null&&el('txtStartDate').value!=""){
			 conditions.push(["t.GROUP_CREATE_TIME", el('txtStartDate').value+' 00:00:00', jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime]);
		 }
		 if(el('txtEndDate').value!=null&&el('txtEndDate').value!=""){
			 conditions.push(["t.GROUP_CREATE_TIME", el('txtEndDate').value+' 00:00:00', jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime]);
		 }
    gCrud.search(conditions);
}

var AttrColumns = [
                    { fieldName: "GROUP_TJNAME", sortField: "GROUP_TJNAME", width: 90, align: "center", name: "统计类型"},
                    { fieldName: "GROUP_DURATION", sortField: "GROUP_DURATION", width: 120, align: "center", name: "总时长",format: function(val, vals){
                        	return jetsennet.util.convertLongToTime(val, 25,false);
                        }},
                   
                  
                 ];
//任务属性列表
var AttrCrud = $.createGridlist ("divAttrList", AttrColumns, null, null);

function tjExcel() {
	   var gDialog;
		var size = jetsennet.util.getWindowViewSize();
		var width = 1100;
		var height = 600;
		var url = "TjFile.htm?";
		url += "GROUP_TYPE="+el('txt_GROUP_TYPE').value+"&txtStartDate="+el('txtStartDate').value+"&txtEndDate="+el('txtEndDate').value+"";
		el("iframePopWin").src = url;
		gDialog = new jetsennet.ui.Window("show-divshow");
		jQuery.extend(gDialog, {
			size : {
				width : width,
				height : height
			},
			title : '统计',
			enableMove : false,
			showScroll : false,
			cancelBox : false,
			maximizeBox : false,
			minimizeBox : false
		});
		gDialog.controls = [ "divshow" ];
		gDialog.show();
	}


 

function exportExcel() {
    if(gCrud.pageBar && gCrud.pageBar.rowCount==0) {
        jetsennet.message("当前条件下，暂无数据需要导出!");
    } else {
    	gCrud.exportData(true);
    }
};


var titarray ;

var sersorce="";



