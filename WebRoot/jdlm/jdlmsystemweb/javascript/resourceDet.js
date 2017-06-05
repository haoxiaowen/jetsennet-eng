/** ===========================================================================
 * 用户管理
 * 20161211，jianghaisheng，新建
 * 20161211，jianghaisheng，修改
 * Copyright (c) Beijing Jetsen Technology Co., Ltd. All Rights Reserved.
 * ============================================================================
 */
jetsennet.require([ "window", "gridlist", "pageframe","datetime", "datepicker", "menu",
		"pagebar", "validate", "ztree/jquery.ztree.all-3.5", "ztree/jztree",
		"bootstrap/bootstrap", "bootstrap/daterangepicker", "crud" ]);jetsennet.importCss("jetsen");
		jetsennet.importCss("bootstrap");
		jetsennet.importCss("jetsenui");

var ASSIGNDAO = new jetsennet.DefaultDal("PpnSourceService");
ASSIGNDAO.dataType = "xml";
		
var gToday;	//当天
var gNum = 1;
var gTableSize = 0;
var objId;
var type;
var outtype;
//页面初始化===================================================================
function pageInit() {
	setReturn();
}
//设置出库单值
function setReturn(){
	gToday = new Date().toDateString() + " " + new Date().toTimeString();
	el('txt_OUT_CREATE_TIME').value = gToday;
	el('txt_OUT_KEEPER').value = jetsennet.Application.userInfo.UserName;
	var timestamp=new Date().getTime();
	$("#txt_OUT_CODE").val(timestamp);
}


//借用部门列表
var selectGroupCode = [
                            { fieldName: "GROUP_CODE", sortField: "GROUP_CODE", width: 135, align: "center", name: "部门编码"},
                            { fieldName: "NAME", sortField: "NAME", width: 135, align: "center", name: "部门名称"},
                            { fieldName: "DESCRIPTION", sortField: "DESCRIPTION", width: 135, align: "center", name: "部门描述"}];
var gGroupCode = new jetsennet.Crud("divSourceCodeList", selectGroupCode, "divSourceCodePage","order by DEPART_ID");
//对象类型ID
var typeId; 
//对象类型Name
var departName;
var parId;
gGroupCode.grid.ondoubleclick = null;

/**
 * 单击获取类型Id和Name
 */
gGroupCode.grid.onrowclick = function(item, td) {
	parId = item.DEPART_ID;
	departName = item.NAME;
}
/**
 * 对象类型的查询方法
 */
function searchName(){
	typeId = ""; 
	departName = "";
	//var conditions = [["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
	var conditions = [];
	var value = jetsennet.util.trim(el('name').value);
	if(value){
		conditions.push(["NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gGroupCode.search(conditions);
}

//借用部门
function sourceDepart(){
	var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
	jQuery.extend(_dialog, {
		size : {
			width : 450,
			height : 450
		},
		title : "选择借用部门",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "divPageFrame1" ]
		
	});
	gGroupCode = $.extend(gGroupCode, {
	    dao : SYSDAO,
	    tableName : "UUM_DEPARTMENT",
	    name : "借用部门",
	    keyId : "t.DEPART_ID",
	    //conditions :[["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
	    checkId : "chkDepart"});
	_dialog.show();
	gGroupCode.load();

	_dialog.onsubmit = function() {
		typeId = parId;
		if(typeId){
			_dialog.close();
			el("txt_OUT_DEPT_CODE").value = departName;
			if(el('name').value != '' &&el('name').value != null){
				el('name').value = ''
			}
		}else{
			jetsennet.alert("请选择一个对象类型！");
			return;
		}
		
	}
	_dialog.showDialog()
}


//借用栏目列表
	var selectColumn = [
	                            { fieldName: "COL_CODE", sortField: "COL_CODE", width: 135, align: "center", name: "栏目代码"},
	                            { fieldName: "COL_NAME", sortField: "COL_NAME", width: 135, align: "center", name: "栏目名称"},
	                            { fieldName: "COL_COMMENT", sortField: "COL_COMMENT", width: 135, align: "center", name: "栏目介绍"}];
	var gColumn = new jetsennet.Crud("divSourceColumnList", selectColumn, "divSourceColumnPage","order by COL_ID");
	//对象类型ID
	var typeId; 
	//对象类型Name
	var columnName;
	var parId;
	gColumn.grid.ondoubleclick = null;
	
	/**
	 * 单击获取类型Id和Name
	 */
	gColumn.grid.onrowclick = function(item, td) {
		parId = item.COL_ID;
		columnName = item.COL_NAME;
	}
	
	/**
	 * 对象类型的查询方法
	 */
	function searchcolumn(){
		typeId = ""; 
		columnName = "";
		//var conditions = [["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
		var conditions = [];
		var value = jetsennet.util.trim(el('colname').value);
		if(value){
			conditions.push(["COL_NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		}
		gColumn.search(conditions);
	}

function SelectColumn(){
		var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
		jQuery.extend(_dialog, {
			size : {
				width : 450,
				height : 450
			},
			title : "选择借用栏目",
			submitBox : true,
			cancelBox : true,
			maximizeBox : false,
			minimizeBox : false,
			controls : [ "divPageFrame2" ]
			
		});
		gColumn = $.extend(gColumn, {
		    dao : SYSDAO,
		    tableName : "PPN_CDM_COLUMN",
		    name : "借用栏目",
		    keyId : "t.COL_ID",
		    //conditions :[["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
		    checkId : "chkColumn"});
		_dialog.show();
		gColumn.load();

		_dialog.onsubmit = function() {
			typeId = parId;
			if(typeId){
				_dialog.close();
				el("txt_OUT_COLN_CODE").value = columnName;
				if(el('colname').value != '' &&el('colname').value != null){
					el('colname').value = ''
				}
			}else{
				jetsennet.alert("请选择一个对象类型！");
				return;
			}
			
		}
		_dialog.showDialog()
	}

//跟机人列表
var selectFollowPers = [
                            { fieldName: "LOGIN_NAME", sortField: "LOGIN_NAME", width: 135, align: "center", name: "登录代码"},
                            { fieldName: "USER_NAME", sortField: "USER_NAME", width: 135, align: "center", name: "用户名"}];
var gFollowPers = new jetsennet.Crud("divSourceuserList", selectFollowPers, "divSourceuserPage","order by ID");
//对象类型ID
//对象类型Name
var userName;
var loginname;
var userid;
gFollowPers.grid.ondoubleclick = null;

/**
 * 单击获取类型Id和Name
 */
gFollowPers.grid.onrowclick = function(item, td) {
	userid = item.ID;
	loginname = item.LOGIN_NAME;
	userName = item.USER_NAME;
}

/**
 * 对象类型的查询方法
 */
function searchuser(){
	userName = "";
	//var conditions = [["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
	var conditions = [];
	var value = jetsennet.util.trim(el('user').value);
	if(value){
		conditions.push(["USER_NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
	}
	gFollowPers.search(conditions);
}

function SelectPerson(obj){
	var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
	jQuery.extend(_dialog, {
		size : {
			width : 450,
			height : 450
		},
		title : "用户",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "divPageFrame4" ]
		
	});
	gFollowPers = $.extend(gFollowPers, {
	    dao : SYSDAO,
	    tableName : "UUM_USER",
	    name : "用户名",
	    keyId : "t.ID",
	    //conditions :[["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
	    checkId : "chkUser"});
	_dialog.show();
	gFollowPers.load();

	_dialog.onsubmit = function() {
		if(userid != null){
			_dialog.close();
			if(obj == '1'){
				el('txt_OUT_USER').value=loginname;
				el('txt_OUT_USER_NAME').value=userName;
			}else{
				el('txt_OUT_CHECK_USER').value=userName;
			}
			if(el('user').value != '' &&el('user').value != null){
				el('user').value = ''
			}
		}else{
			jetsennet.alert("请选择一个对象类型！");
			return;
		}
		
	}
	_dialog.showDialog()
}

function SelectPer(index){
	var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
	jQuery.extend(_dialog, {
		size : {
			width : 700,
			height : 450
		},
		title : "用户",
		submitBox : true,
		cancelBox : true,
		maximizeBox : false,
		minimizeBox : false,
		controls : [ "divPageFrame4" ]
		
	});
	gFollowPers = $.extend(gFollowPers, {
	    dao : SYSDAO,
	    tableName : "UUM_USER",
	    name : "用户名",
	    keyId : "t.ID",
	    //conditions :[["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
	    checkId : "chkUser"});
	_dialog.show();
	gFollowPers.load();

	_dialog.onsubmit = function() {
		if(userid != null){
			_dialog.close();
				el('txt_ITEM_FOLLOW_PERSON'+index).value=userName;
			if(el('user').value != '' &&el('user').value != null){
				el('user').value = ''
			}
		}else{
			jetsennet.alert("请选择一个对象类型！");
			return;
		}
		
	}
	_dialog.showDialog()
}


$(function(){ 
	objId = jetsennet.queryString("objId");
	type = jetsennet.queryString("type");
	if(type==1){
		var result = SYSDAO.query("commonXmlQuery", "p.obj_id", "ppn_rent_obj", "p", 
				[["Ppn_Rent_Obj_Type", "t", "p.obj_type_id = t.obj_type_id", jetsennet.TableJoinType.Left]],
		  		[["p.OBJ_ID",objId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In,jetsennet.SqlParamType.String]],	
		  		"p.*");
		  var obj = jetsennet.xml.deserialize(result.resultVal, "Record");
		  var resobj ={};
		  $('#divdetail').find("table[class='table-info']").each(function(i){
				var tableNum = $(this).attr("id").substring(7);
				$("#restable" + tableNum).remove();
			});
		  if(obj){
			  $('#txt_OUT_TYPE').val('新建');
			  gToday = new Date().toDateString() + " " + new Date().toTimeString();
			  el('txt_OUT_START_TIME').value = gToday;
			   var parsdate = parserDate(gToday);
				var enddate = AddDays(parsdate,6);
				var outendtime = formatDateTime(enddate);
				$('#txt_OUT_END_TIME').val(outendtime);
			  for(var i = 0;i<obj.length;i++){
				  resobj.OBJ_CODE=obj[i].OBJ_CODE;
				  resobj.OBJ_NAME=obj[i].OBJ_NAME;
				  resobj.OBJ_ASS_UID=obj[i].OBJ_ASS_UID;
				  resobj.OBJ_TYPE_ID=obj[i].OBJ_TYPE_ID;
				  resobj.ITEM_OBJ_NUM=1;
				  var date1=new Date($('#txt_OUT_START_TIME').val());    //开始时间
				  var date2=new Date($('#txt_OUT_END_TIME').val());    //结束时间
				  var date3=date2.getTime()-date1.getTime(); //时间差秒
				  //计算出相差天数
				  var days=Math.floor(date3/(24*3600*1000));
				  resobj.ITEM_OBJ_UOM=days;
				  
				  resobj.ITEM_MATH_CODE=Math.random().toString(36).substr(2);
				  generateTableFormRes(resobj,false);
			  }
			  
		  }
	}else if(type == 2){
		//查询资源对象
		var conditions = [ [ 'obj_id', objId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
		var res = SYSDAO.queryObjs('commonXmlQuery', 'obj_id', 'ppn_rent_obj', "t",null, conditions, 't.OBJ_CODE');
		var objcode="";
		if(res){
			for(var i = 0;i<res.length;i++){
				objcode+=(res[i].OBJ_CODE)+",";
			}
		}
		var ocode = objcode.substring(0, objcode.length-1);
		//查询出库项
		var conditions = [ [ 'item_code', ocode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
		var result = SYSDAO.queryObjs('commonXmlQuery', 'item_id', 'ppn_rent_out_item', "t",null, conditions, 't.OUT_ID');
	    var outid = "";
	    if(result){
	    	for(var j = 0;j<result.length;j++){
	    		outid+=(result[j].OUT_ID)+",";
	    	}
	    }
	    var outId = outid.substring(0,outid.length-1);
	    //查询出库单
	    var results = SYSDAO.query("commonXmlQuery", "p.out_id", "ppn_rent_out", "p", 
				[["ppn_rent_out_item", "t", "p.out_id = t.out_id", jetsennet.TableJoinType.Left]],
		  		[["p.out_id",outId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In,jetsennet.SqlParamType.String]],	
		  		"p.OUT_ID");
	    var obj = jetsennet.xml.deserialize(results.resultVal, "Record");
	    var outId="";
	    if(obj){
	    	for(var k = 0; k<obj.length;k++){
	    		outId+=(obj[k].OUT_ID)+",";
	    	}
	    }
	    var outid = outId.substring(0,outId.length-1);
	    //查询出库单
	    var condition = [['OUT_ID', outid, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]];
		var objs = SYSDAO.queryObjs('commonXmlQuery', 'OUT_ID', 'PPN_RENT_OUT', "t", null, condition, '*', "order by OUT_END_TIME DESC" );
		var outids = "";
		if(objs){
			outids = objs[0].OUT_ID;
		}
		var rest = SYSDAO.query("commonXmlQuery", "p.obj_id", "PPN_RENT_OUT", "p", 
				[["PPN_RENT_OUT_ITEM", "t", "p.out_id = t.out_id", jetsennet.TableJoinType.Left]],
		  		[["p.out_id",outids, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],	
		  		"p.*,t.*");
		 var objs = jetsennet.xml.deserialize(rest.resultVal, "Record");
		 var resobj ={};
		 if(objs){
			 $('#txt_OUT_TYPE').val('续借');
			 el('txt_OUT_USER').value = objs[0].OUT_USER;
			 el('txt_OUT_USER_NAME').value = objs[0].OUT_USER_NAME;
			 el('txt_OUT_DEPT_CODE').value = objs[0].OUT_DEPT_CODE;
			 el('txt_OUT_COLN_CODE').value = objs[0].OUT_COLN_CODE;
			 el('txt_OUT_NAME').value = objs[0].OUT_NAME;
			 el('txt_OUT_START_TIME').value = objs[0].OUT_START_TIME;
			 el('txt_OUT_END_TIME').value = objs[0].OUT_END_TIME;
			 el('txt_OUT_DESC').value = objs[0].OUT_DESC;
			 for(var l=0;l<objs.length;l++){
				  resobj.OBJ_CODE=objs[l].ITEM_CODE;
				  resobj.OBJ_NAME=objs[l].ITEM_NAME;
				  resobj.OBJ_ASS_UID=objs[l].ITEM_OBJ_CODE;
				  resobj.OBJ_TYPE_ID=objs[l].ITEM_OBJ_TYPE;
				  resobj.ITEM_OBJ_NUM=objs[l].ITEM_OBJ_NUM;
				  resobj.ITEM_OBJ_UOM=objs[l].ITEM_OBJ_UOM;
				  resobj.ITEM_MATH_CODE=objs[l].ITEM_MATH_CODE;
				  generateTableFormRes(resobj,false);
			 }
		 }
	}
	
	  
}); 


/**
 * 根据资源填写资源出库项
 * @param objout
 * @param type 
 */
function generateTableFormRes(objout,type) {
	var bodydiv = jQuery("#divdetail");//动态添加table所在div
	// 构造出库项详情table--------开始------------
	var restable = document.createElement("table");
	jQuery(restable).addClass("table-info");// 设置tableclass
	restable.id = 'tableres' + gNum;// 设置tableid
	if(type){
		jQuery(restable).css("visibility", "hidden");
	}else{
		jQuery(restable).css("visibility", "visible");
	}
	var restbody = jQuery("#resdemo");
	var restblBody = document.createElement("tbody");
	jQuery(restblBody).addClass("divchukudan");
	jQuery(restblBody).html(restbody.html());
	jQuery(restable).append(restblBody);
	bodydiv.append(restable);
	
	jQuery(restblBody).find("tbody").find("tr input[type='text']").each(
			function(i) {
			if ($(this).attr('name') == 'txt_ITEM_CODE') {
				$(this).val(objout.OBJ_CODE);
				$(this).attr('id','txt_ITEM_CODE' + gNum);
			}
			if ($(this).attr('name') == 'txt_ITEM_NAME') {
				$(this).val(objout.OBJ_NAME);
				$(this).attr('id','txt_ITEM_NAME' + gNum);
			}
			if ($(this).attr('name') == 'txt_ITEM_OBJ_CODE') {
				$(this).val(objout.OBJ_ASS_UID);
				$(this).attr('id','txt_ITEM_OBJ_CODE' + gNum);
			}
			if ($(this).attr('name') == 'txt_OBJ_TYPE_NAME') {
				$(this).val(objout.OBJ_TYPE_ID);
				$(this).attr('id','txt_OBJ_TYPE_NAME' + gNum);
			}
			if ($(this).attr('name') == 'txt_ITEM_OBJ_NUM') {
				$(this).val(objout.ITEM_OBJ_NUM);
				$(this).attr('id','txt_ITEM_OBJ_NUM' + gNum);
			}
			if ($(this).attr('name') == 'txt_ITEM_OBJ_UOM') {
				$(this).val(objout.ITEM_OBJ_UOM);
				$(this).attr('id','txt_ITEM_OBJ_UOM' + gNum);
			}
			if ($(this).attr('name') == 'txt_ITEM_MATH_CODE') {
				$(this).val(objout.ITEM_MATH_CODE);
				$(this).attr('id','txt_ITEM_MATH_CODE' + gNum);
			}

			});
	gNum++;
}

function goParent(){
	var flag = true;
	if(!($("#txt_OUT_DEPT_CODE").prop("value"))){
		jetsennet.warn("借用部门不能为空!");
		return;
	}
	if(!($("#txt_OUT_COLN_CODE").prop("value"))){
		jetsennet.warn("借用栏目不能为空!");
		return;
	}
	if(!($("#txt_OUT_NAME").prop("value"))){
		jetsennet.warn("出库单名称不能为空!");
		return;
	}
	if(!($("#txt_OUT_START_TIME").prop("value"))){
		jetsennet.warn("起借时间不能为空!");
		return;
	}
	if(!($("#txt_OUT_END_TIME").prop("value"))){
		jetsennet.warn("归还时间不能为空!");
		return;
	}
	if(!($("#txt_OUT_DESC").prop("value"))){
		jetsennet.warn("出库说明不能为空!");
		return;
	}
	if(!($("#txt_OUT_USER").prop("value"))){
		jetsennet.warn("领取人工号不能为空!");
		return;
	}
	if($("#txt_OUT_TYPE").prop("value")=='新建'){
		outtype = 1;
	}else if($("#txt_OUT_TYPE").prop("value")=='续借'){
		outtype = 2;
	}
	var xml=" <TABLES>";
	xml+="<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentOut'>"
		+ "<OUT_CODE>" + el("txt_OUT_CODE").value + "</OUT_CODE>"//出库单号
		+ "<OUT_DEPT_CODE>" + el("txt_OUT_DEPT_CODE").value + "</OUT_DEPT_CODE>"//借用部门
		+ "<OUT_COLN_CODE>" + el("txt_OUT_COLN_CODE").value + "</OUT_COLN_CODE>"//借用栏目
		+ "<OUT_NAME>" + el("txt_OUT_NAME").value + "</OUT_NAME>"//出库单名称
		+ "<OUT_DESC>" + el("txt_OUT_DESC").value + "</OUT_DESC>"//出库说明
		+ "<OUT_KEEPER>" + el("txt_OUT_KEEPER").value + "</OUT_KEEPER>"//库管人员
		+ "<OUT_CREATE_TIME>" + el("txt_OUT_CREATE_TIME").value + "</OUT_CREATE_TIME>"//出库时间
		+ "<OUT_START_TIME>" + formatStrToDate(el("txt_OUT_START_TIME").value) + "</OUT_START_TIME>"//起借时间
		+ "<OUT_END_TIME>" + formatStrToDate(el("txt_OUT_END_TIME").value) + "</OUT_END_TIME>"//归还时间
		+ "<OUT_USER>" + el("txt_OUT_USER").value + "</OUT_USER>"//领取人工号
		+ "<OUT_USER_NAME>" + el("txt_OUT_USER_NAME").value +"</OUT_USER_NAME>"//领取人姓名
		+ "<OUT_STATUS>2</OUT_STATUS>"//状态
		+ "<OUT_TYPE>" + outtype +"</OUT_TYPE>"//出库类型
		+"</TABLE>";
	 gResObj = new Array();
		$('#divdetail').find("table[class='table-info']").each(function(i){
			var tableNum = $(this).attr("id").substring(8);
			if(!($("#txt_ITEM_OBJ_UOM"+tableNum).prop("value"))){
				jetsennet.warn("单元数量不能为空!");
				flag = false;
				return;
			}
			if(!($("#txt_ITEM_MATH_CODE"+tableNum).prop("value"))){
				jetsennet.warn("验证码不能为空!");
				flag = false;
				return;
			}
			 xml+="<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentOutItem'>";
			 xml+="<OUT_ID ref-field='jetsennet.jdlm.beans.PpnRentOut.OUT_ID'></OUT_ID>";//出库单ID
			 xml+="<ITEM_CODE>"+  $("#txt_ITEM_CODE"+tableNum).prop("value") +"</ITEM_CODE>";//资源代码
			 xml+="<ITEM_NAME>"+ $("#txt_ITEM_NAME"+tableNum).prop("value") +"</ITEM_NAME>";//名称
			 xml+="<ITEM_OBJ_CODE>"+ $("#txt_ITEM_OBJ_CODE"+tableNum).prop("value") +"</ITEM_OBJ_CODE>";//序列号
			 xml+="<ITEM_OBJ_TYPE>"+$("#txt_OBJ_TYPE_NAME"+tableNum).prop("value")+"</ITEM_OBJ_TYPE>";//资源类型
			 xml+="<ITEM_OBJ_NUM>"+ $("#txt_ITEM_OBJ_NUM"+tableNum).prop("value") +"</ITEM_OBJ_NUM>";//资源数量
			 xml+="<ITEM_OBJ_UOM>"+ $("#txt_ITEM_OBJ_UOM"+tableNum).prop("value") +"</ITEM_OBJ_UOM>";//单元数量
			 xml+="<ITEM_MATH_CODE>"+ $("#txt_ITEM_MATH_CODE"+tableNum).prop("value") +"</ITEM_MATH_CODE>";//验证码
			xml+="</TABLE>";
		});
		    xml+="</TABLES>";
		    if(flag){
		    	var params = new HashMap();
		    	params.put("saveXml", xml);
		    	jetsennet.confirm("确定保存出库单？", function() {
		    		SYSDAO.execute("commonObjsInsert", params, {
		    			success : function(resultVal) {
		    				jetsennet.alert("success!");
		    				if(outtype==1){
		    					var txtoutcode = $("#txt_OUT_CODE").val();
			    				var txtstatus = 0;
			    				submitexe(txtoutcode,txtstatus);
		    				}else{
		    					parent.location.reload();
		    				}
		    			},
		    			wsMode : "WEBSERVICE"
		    		}
		    		);
		    		return true;
		    	});
		    }
}
function submitexe(outCode,outStatus){
	var params = new HashMap();
	 params.put("OUT_CODE", outCode);
	 params.put("OUT_STATUS", outStatus);
		 ASSIGNDAO.execute("submitSour", params, {
		 	    success: function(result) {
		 	    	jetsennet.alert("保存成功!");
		 	    	//location.href="resource.htm";
		 	    	parent.location.reload();
		 	    	//window.parent.searchRetu();
		 	       // window.parent.jetsennet.ui.Windows.close("add-divSourceWindows");
		 			return true;
		 	    },
		 	   error: function(errCode,errStr) {
			    	jetsennet.error("保存失败");
			    	//location.href="resource.htm";
			    	parent.location.reload();
			    	//window.parent.searchRetu();
			       // window.parent.jetsennet.ui.Windows.close("add-divSourceWindows");
					return true;
			    },
		 	});
}
//时间字符串格式化
function formatStrToDate(dateStr){
	var formatStr = "";
	if(dateStr){
		var year = dateStr.substring(0,4);
		var month = dateStr.substring(5,7);
		var day = dateStr.substring(8,10);
		var hour = dateStr.substring(11,13);
		var min = dateStr.substring(14,16);
		var sec = dateStr.substring(17,19);
		formatStr = new Date(year,month-1,day,hour,min,sec).toDateTimeString();
	}
	return formatStr;
}
function checkTime(dateStr){
	var objNum = $('#txt_OUT_START_TIME').val();
	var parsdate = parserDate(objNum);
	var enddate = AddDays(parsdate,6);
	var outendtime = formatDateTime(enddate);
	$('#txt_OUT_END_TIME').val(outendtime);
}
function AddDays(date, value) {
    date.setDate(date.getDate() + value);
    return date;
}
function parserDate(date){
	 var t = Date.parse(date);  
	    if (!isNaN(t)) {  
	        return new Date(Date.parse(date.replace(/-/g, "/")));  
	    } else {  
	        return new Date();  
	    } 
}
function formatDateTime(date) {  
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();  
    var minute = date.getMinutes(); 
    minute = minute < 10 ? ('0' + minute) : minute;
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? ('0' + seconds) : seconds;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+seconds;  
};  
function checkDate(val){
	objId = jetsennet.queryString("objId");
	type = jetsennet.queryString("type");
	if(type==1){
		var result = SYSDAO.query("commonXmlQuery", "p.obj_id", "ppn_rent_obj", "p", 
				[["Ppn_Rent_Obj_Type", "t", "p.obj_type_id = t.obj_type_id", jetsennet.TableJoinType.Left]],
		  		[["p.OBJ_ID",objId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In,jetsennet.SqlParamType.String]],	
		  		"p.*");
		  var obj = jetsennet.xml.deserialize(result.resultVal, "Record");
		  var resobj ={};
		  $('#divdetail').find("table[class='table-info']").each(function(i){
				var tableNum = $(this).attr("id").substring(8);
				$("#tableres" + tableNum).remove();
			});
		  if(obj){
			  for(var i = 0;i<obj.length;i++){
				  resobj.OBJ_CODE=obj[i].OBJ_CODE;
				  resobj.OBJ_NAME=obj[i].OBJ_NAME;
				  resobj.OBJ_ASS_UID=obj[i].OBJ_ASS_UID;
				  resobj.OBJ_TYPE_ID=obj[i].OBJ_TYPE_ID;
				  resobj.ITEM_OBJ_NUM=1;
				  var date1=new Date($('#txt_OUT_START_TIME').val());    //开始时间
				  var date2=new Date($('#txt_OUT_END_TIME').val());    //结束时间
				  var date3=date2.getTime()-date1.getTime(); //时间差秒
				  //计算出相差天数
				  var days=Math.floor(date3/(24*3600*1000));
				  resobj.ITEM_OBJ_UOM=days;
				  resobj.ITEM_MATH_CODE=Math.random().toString(36).substr(2);
				  generateTableFormRes(resobj,false);
			  }
			  
		  }
	}else if(type == 2){
		//查询资源对象
		var conditions = [ [ 'obj_id', objId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
		var res = SYSDAO.queryObjs('commonXmlQuery', 'obj_id', 'ppn_rent_obj', "t",null, conditions, 't.OBJ_CODE');
		var objcode="";
		if(res){
			for(var i = 0;i<res.length;i++){
				objcode+=(res[i].OBJ_CODE)+",";
			}
		}
		var ocode = objcode.substring(0, objcode.length-1);
		//查询出库项
		var conditions = [ [ 'item_code', ocode, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ]];
		var result = SYSDAO.queryObjs('commonXmlQuery', 'item_id', 'ppn_rent_out_item', "t",null, conditions, 't.OUT_ID');
	    var outid = "";
	    if(result){
	    	for(var j = 0;j<result.length;j++){
	    		outid+=(result[j].OUT_ID)+",";
	    	}
	    }
	    var outId = outid.substring(0,outid.length-1);
	    //查询出库单
	    var results = SYSDAO.query("commonXmlQuery", "p.out_id", "ppn_rent_out", "p", 
				[["ppn_rent_out_item", "t", "p.out_id = t.out_id", jetsennet.TableJoinType.Left]],
		  		[["p.out_id",outId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.In,jetsennet.SqlParamType.String]],	
		  		"p.OUT_ID");
	    var obj = jetsennet.xml.deserialize(results.resultVal, "Record");
	    var outId="";
	    if(obj){
	    	for(var k = 0; k<obj.length;k++){
	    		outId+=(obj[k].OUT_ID)+",";
	    	}
	    }
	    var outid = outId.substring(0,outId.length-1);
	    //查询出库单
	    var condition = [['OUT_ID', outid, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]];
		var objs = SYSDAO.queryObjs('commonXmlQuery', 'OUT_ID', 'PPN_RENT_OUT', "t", null, condition, '*', "order by OUT_END_TIME DESC" );
		var outids = "";
		if(objs){
			outids = objs[0].OUT_ID;
		}
		var rest = SYSDAO.query("commonXmlQuery", "p.obj_id", "PPN_RENT_OUT", "p", 
				[["PPN_RENT_OUT_ITEM", "t", "p.out_id = t.out_id", jetsennet.TableJoinType.Left]],
		  		[["p.out_id",outids, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],	
		  		"p.*,t.*");
		 var objs = jetsennet.xml.deserialize(rest.resultVal, "Record");
		 $('#divdetail').find("table[class='table-info']").each(function(i){
				var tableNum = $(this).attr("id").substring(8);
				$("#tableres" + tableNum).remove();
			});
		 var resobj ={};
		 if(objs){
			 for(var l=0;l<objs.length;l++){
				  resobj.OBJ_CODE=objs[l].ITEM_CODE;
				  resobj.OBJ_NAME=objs[l].ITEM_NAME;
				  resobj.OBJ_ASS_UID=objs[l].ITEM_OBJ_CODE;
				  resobj.OBJ_TYPE_ID=objs[l].ITEM_OBJ_TYPE;
				  resobj.ITEM_OBJ_NUM=objs[l].ITEM_OBJ_NUM;
				  var date1=new Date($('#txt_OUT_START_TIME').val());    //开始时间
				  var date2=new Date($('#txt_OUT_END_TIME').val());    //结束时间
				  var date3=date2.getTime()-date1.getTime(); //时间差秒
				  //计算出相差天数
				  var days=Math.floor(date3/(24*3600*1000));
				  resobj.ITEM_OBJ_UOM=days;
				  resobj.ITEM_MATH_CODE=objs[l].ITEM_MATH_CODE;
				  generateTableFormRes(resobj,false);
			 }
		 }
	}
}
