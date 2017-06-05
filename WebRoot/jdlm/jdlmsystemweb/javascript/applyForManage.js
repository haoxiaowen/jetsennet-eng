/**
 * 申请管理
 */
jetsennet.require(["window", "gridlist", "pagebar","datepicker", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
jetsennet.importCss("bootstrap/daterangepicker-bs3");
var ORDDAO = new jetsennet.DefaultDal("PpnRentOrdService");
ORDDAO.dataType = "xml";
var gApplyColumns = [{ fieldName: "ORD_ID", width: 30, align: "center", isCheck: 1, checkName: "chkApply"},
                     { fieldName: "ORD_CODE", sortField: "ORD_CODE", width: 135, align: "left", name: "申请单代码"},
                     { fieldName: "ORD_NAME", sortField: "ORD_NAME", width: 135, align: "left", name: "申请单名称"},
                     { fieldName: "ORD_STATUS", sortField: "ORD_STATUS", width: 135, align: "left", name: "订单状态",format : function(val,vals){
                    	 if(val=='1'){
                    		 return '未提交';
                    	 }else if(val=='2'){
                    		 return '审核中';
                    	 }else if(val=='3'){
                    		 return '已审核';
                    	 }else if(val=='4'){
                    		 return '已取消';
                    	 }
                     }},
                     { fieldName: "ORD_USER_CODE", sortField: "ORD_USER_CODE", width: 135, align: "left", name: "申请人工号"},
                     { fieldName: "ORD_USER_NAME", sortField: "ORD_USER_NAME", width: 135, align: "left", name: "申请人姓名"},
                     { fieldName: "ORD_DESC", sortField: "ORD_DESC", width: 135, align: "left", name: "申请单描述"},
                     { fieldName: "ORD_DEPT_CODE", sortField: "ORD_DEPT_CODE", width: 135, align: "left", name: "部门代码"},
                     { fieldName: "ORD_DEPT_NAME", sortField: "ORD_DEPT_NAME", width: 135, align: "left", name: "部门名称"},
                     { fieldName: "ORD_COLUMN_CODE", sortField: "ORD_COLUMN_CODE", width: 135, align: "left", name: "栏目代码"},
                     { fieldName: "ORD_COLUMN_NAME", sortField: "ORD_COLUMN_NAME", width: 135, align: "left", name: "栏目名称"},
                     { fieldName: "ORD_USE_CITY", sortField: "ORD_USE_CITY", width: 135, align: "left", name: "使用地点"},
                     { fieldName: "ORD_START_TIME", sortField: "ORD_START_TIME", width: 135, align: "left", name: "起借时间"},
                     { fieldName: "ORD_END_TIME", sortField: "ORD_END_TIME", width: 135, align: "left", name: "归还时间"},
                     { fieldName: "ORD_CREATE_TIME", sortField: "ORD_CREATE_TIME", width: 135, align: "left", name: "创建时间"},
                     
                     { fieldName: "ORD_ID", width:  45, align: "center", name: "编辑", format: function(val,vals){
                         return jetsennet.Crud.getEditCell("edit('" + val + "')");
                     }},
                     { fieldName: "ORD_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                         return jetsennet.Crud.getDeleteCell("gCrud.removeordite('" + val + "')");
                     }}];
var size = jetsennet.util.getWindowViewSize();
var width = size.width;
var height = size.height;
var gCrud = $.extend(new jetsennet.Crud("divApplyList", gApplyColumns, "divApplyPage"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_ORD",
    name : "申请单",
    className : "jetsennet.jdlm.beans.PpnRentOrd",
    keyId : "t.ORD_ID",
   // resultFields : "t.WSLOG_ID,t.WSLOG_CODE,t.WSLOG_TARGETSYS",
    checkId : "chkApply",
    cfgId : "divApply",
    addDlgOptions : {size : {width : 800, height : 800}},
	editDlgOptions : {size : {width : 800, height : 800}},
});

function pageInit(){

	gCrud.load();
}

function searchApp(){
	conditions = [];
	var value = jetsennet.util.trim(el('txtApp').value);
	if(value){
   	 conditions.push( ["t.ORD_DEPT_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
   	 conditions.push( ["t.ORD_USER_NAME", value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
   	 conditions.push( ["t.ORD_COLUMN_NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
   }
	var val = jetsennet.util.trim(el('txtStartTime').value);
	if(val){
		conditions.push( ["t.ORD_CREATE_TIME", val, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.ThanEqual, jetsennet.SqlParamType.DateTime ]);
	}
	var vals = jetsennet.util.trim(el('txtEndTime').value);
	if(vals){
		conditions.push( ["t.ORD_CREATE_TIME", vals, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.LessEqual, jetsennet.SqlParamType.DateTime ]);
	}
	gCrud.search(conditions);
}

el("iframeObj").src = "applyIframe.htm";
function add(){
//	var width = 800;
//	var height = size.height;
	el("iframeObj").src = "applyIframe.htm";
	
	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:true,showScroll:true,size:{width:800,height:600},title:"申请单"});
	dialog.controls = ["divChooseObj"];
	dialog.showDialog();
}
gCrud.grid.ondoubleclick = function(item,td){
	edit(item.ORD_ID);
};;
function edit(id){

	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkApply") : jetsennet.Crud.getCheckIds(id,"chkApply");
	if(checkIds.length!=1){
		jetsennet.alert('请选择一条申请单信息！');
		return;
	}

	var condits = [ [ 'ORD_ID', checkIds[0], jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var rese = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",null, condits, 'ORD_STATUS');
	if(!rese){
		jetsennet.alert('请选择未提交的申请！');
		return;
	}
	if(rese[0].ORD_STATUS!="1"){
		jetsennet.alert('请选择未提交的申请！');
		return;
	}
	var condit = [ [ 'ORD_ID', checkIds[0], jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var res = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",null, condit, 'ORD_CODE');
	el("iframeObj").src = "applyIframe.htm?ORD_ID="+checkIds[0]+"&ORD_CODE="+res[0].ORD_CODE;
	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:true,showScroll:true,size:{width:800,height:630},title:"申请单"});
	dialog.controls = ["divChooseObj"];
	dialog.showDialog();
}

/**
 * 申请单删除 同时删除订单
 */
gCrud.removeordite = function(id){
	//var id=null;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkApply") : jetsennet.Crud.getCheckIds(id,"chkApply");
	if(checkIds.length < 1){
		jetsennet.alert("请选择一个借用申请单！");
		return;
	}
	var conditions = [ [ 'ORD_ID', checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ],
	                   [ 'ORD_STATUS', "1", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
	var results = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",null, conditions, 't.*');
	if(results){
		jetsennet.alert("只能删除未提交数据！");
		return;
	}
	jetsennet.confirm("确定删除？", function () {
		
			for(var i = 0; i < checkIds.length; i++ ){
				var params = new HashMap();
			 	   
			 	params.put("className","jetsennet.jdlm.beans.PpnRentOrdItem");
			    params.put("delXml", checkIds[i]);
			    var result = ORDDAO.execute("delSource", params);
			    if(!result.errorCode == '0'){
			    	jetsennet.alert("删除失败！"+result.errorCode);
			    	return;
			    }
			}
	 	   	
		
		gCrud.search();
		return true;
	});
}
/**
 * 提交审核
 * @param id
 */
function suCheck(id){
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkApply") : jetsennet.Crud.getCheckIds(id,"chkApply");
	if(checkIds < 1){
		jetsennet.alert("请选择借用申请！");
		return;
	}
	var conditions = [ [ 'ORD_ID', checkIds, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ],
	                   [ 'ORD_STATUS', "1", jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var results = SYSDAO.queryObjs('commonXmlQuery', 'ORD_ID', 'PPN_RENT_ORD', "t",null, conditions, 't.*');
	if(!results){
		jetsennet.alert("请选择未提交申请！");
		return;
	}
	jetsennet.confirm("确定提交？", function () {
		for(var i = 0 ; i < results.length ; i++){
			
			var tab = {
					//CHECK_ID : '',
					CHECK_TYPE : '0',
					CHECK_OBJ_TYPE : '1',
					CHECK_OBJ_CODE : results[i].ORD_CODE,
					CHECK_STATUS : 0
			};
			var params = new HashMap();
			params.put("className", "jetsennet.jdlm.beans.PpnRentCheck")
			params.put("updateXml", jetsennet.xml.serialize(tab,"TABLE"));
			params.put("isFilterNull", true);
			result = SYSDAO.execute("commonObjInsert", params,{wsMode:"WEBSERVICE"});
			if(!result){
				
				jetsennet.alert('审核提交失败！');
				return;
			}
			
			var obj = {
					ORD_ID : results[i].ORD_ID,
					ORD_STATUS : '2'
			};
			var params = new HashMap();
			params.put("className", "jetsennet.jdlm.beans.PpnRentOrd")
			params.put("updateXml", jetsennet.xml.serialize(obj,"jetsennet.jdlm.beans.PpnRentOrd"));
			params.put("isFilterNull", true);
			result = SYSDAO.execute("commonObjUpdateByPk", params,{wsMode:"WEBSERVICE"});
			if(!result){
				jetsennet.alert('审核提交失败！');
				return;
			}
			
			
		}
		gCrud.load();
		jetsennet.alert('审核提交成功！');
		return true;
	});
}
function atfile(){
	
	
	var id = null;
	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkApply") : jetsennet.Crud.getCheckIds(id,"chkApply");
	if(checkIds.length != 1){
		jetsennet.alert("请选择一条借用申请！");
		return;
	}
	el("iframefile").src = "rentAttaFile.htm?FileStyleVal=1&code="+checkIds[0];
	var dialog = new jetsennet.ui.Window("choose-object");
	dialog = jQuery.extend(dialog, {submitBox:false,cancelBox:true,showScroll:true,size:{width:800,height:630},title:"申请单"});
	dialog.controls = ["divfileObj"];
	dialog.showDialog();
	
}


