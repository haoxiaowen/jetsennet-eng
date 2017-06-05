/**
 * 入库资源申请
 * 
 * @author yyf 2016-12-13
 */
jetsennet.require([ "window", "gridlist", "pageframe","datetime", "datepicker", "menu",
		"pagebar", "validate", "ztree/jquery.ztree.all-3.5", "ztree/jztree",
		"bootstrap/bootstrap", "bootstrap/daterangepicker", "crud" ]);
var gOutResCrud ;
var gResObj;
function pageInit() { 
	
	setReturn();
}


//设置出库单值
function setReturn(){
	//入库单信息

	var timestamp=new Date().getTime();
	$("#RETU_CODE").val(timestamp);
	$("#RETU_TIME").val(new Date().toDateTimeString());
//	$("#RETU_COLUMN_CODE").val("001");
//	$("#RETU_MANAGE_USER").val("张三");
//	$("#RETU_DEPT_CODE").val("001");
	//复核人员
	$("#RETU_CHECK_USER").val(jetsennet.Application.userInfo.LoginId);
	$("#RETU_CHECK_TIME").val(new Date().toDateTimeString());
	
}




/**
 * 从出库单生成入库单
 */
function generateRetuFormOut(id){
	var conditions = [];
	conditions.push([ "o.OUT_ID", id, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
	/*var jointables =  [["ppn_rent_out_item", "item", "o.out_id=item.out_id ", jetsennet.TableJoinType.Inner],["ppn_rent_obj", "obj", "obj.obj_code=item.item_obj_code ", jetsennet.TableJoinType.Inner],
	                   ["ppn_cdm_column", "col", "col.COL_NAME=o.out_coln_code", jetsennet.TableJoinType.Left],["uum_user", "u", "u.user_code = o.out_user_name ", jetsennet.TableJoinType.Left],
	                   ["uum_department", "dept", "trim(dept.NAME) = o.out_dept_code", jetsennet.TableJoinType.Left]
	                   ];*/
	var jointables =  [["ppn_rent_out_item", "item", "o.out_id=item.out_id ", jetsennet.TableJoinType.Inner],["ppn_rent_obj", "obj", "obj.obj_code=item.item_obj_code ", jetsennet.TableJoinType.Inner],
	                   ["ppn_cdm_column", "col", "col.col_code=o.out_coln_code", jetsennet.TableJoinType.Left],["uum_user", "u", "u.user_code = o.out_user ", jetsennet.TableJoinType.Left],
	                   ["uum_department", "dept", "trim(dept.depart_no) = trim(o.out_dept_code)", jetsennet.TableJoinType.Left]
	                   ];
	var resultFields = "o.OUT_DEPT_CODE,dept.NAME,o.OUT_COLN_CODE,col.COL_NAME,o.OUT_USER,u.USER_NAME,item.ITEM_OBJ_CODE,obj.obj_name ,item.item_obj_num,o.OUT_KEEPER,o.OUT_CREATE_TIME,item.ITEM_OBJ_DESC,item.ITEM_OBJ_SPECS,item.item_obj_type,item.item_obj_uom,item.item_obj_uom_sum,item.item_obj_price,item.item_obj_currency";
	var queryRes = SYSDAO.query("commonXmlQuery", "OUT_ID", "PPN_RENT_OUT",	"o", jointables, conditions, resultFields);
	if (queryRes && queryRes.resultVal) {
		if (jetsennet.xml.deserialize(queryRes.resultVal, "Record") != null) {
			var objout = null;
			objout = jetsennet.xml.deserialize(queryRes.resultVal, "Record");
			var len = objout.length;
			if(len>0){
				$("#RETU_COLUMN_CODE").val(objout[0].COL_NAME);
				$("#RETU_MANAGE_USER").val(objout[0].USER_NAME);
				$("#RETU_DEPT_CODE").val(objout[0].NAME);
				$("#hid_RETU_COLUMN_CODE").val(objout[0].OUT_COLN_CODE);
				$("#hid_RETU_MANAGE_USER").val(objout[0].OUT_USER);
				$("#hid_RETU_DEPT_CODE").val(objout[0].OUT_DEPT_CODE);
			}
			$('#divdetail').find("table[class='tg']").each(function(i){
				var tableNum = $(this).attr("id").substring(5);
				$("#table" + tableNum).remove();
				$("#tableres" + tableNum).remove();
			});
			for (var i = 0; i < len; i++) {
				generateTableFormRes(objout[i],false);
			}
		}
	}
}
/**
 * 保存入库申请单
 */
function saveReturnlist(){
	var flag = true;
	var areaElements = jetsennet.form.getElements('divContent');
	if (jetsennet.validate(areaElements, true)) {//必填验证}
		if(!($("#RETU_MANAGE_USER").prop("value"))){
			jetsennet.warn("入库人员不能为空!");
			return;
		}
		if(!($("#RETU_COLUMN_CODE").prop("value"))){
			jetsennet.warn("入库栏目不能为空!");
			return;
		}
		if(!($("#RETU_DEPT_CODE").prop("value"))){
			jetsennet.warn("入库部门不能为空!");
			return;
		}
		var returnName=$("#RETU_COLUMN_CODE").prop("value")+"-入库单-"+$("#RETU_CODE").prop("value");
		var xml=" <TABLES>";
		xml+="<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentReturn'>"
				+"<RETU_CODE>"+ $("#RETU_CODE").prop("value")+"</RETU_CODE>"
				+"<RETU_NAME>"+ returnName +"</RETU_NAME>"
				+"<RETU_STATUS>2</RETU_STATUS>"
				+"<RETU_USER>"+ jetsennet.Application.userInfo.LoginId +"</RETU_USER>"
				+"<RETU_MANAGE_USER>"+ $("#RETU_MANAGE_USER").prop("value") +"</RETU_MANAGE_USER>"
				+"<RETU_COLUMN_CODE>"+ $("#RETU_COLUMN_CODE").prop("value") +"</RETU_COLUMN_CODE>"
				+"<RETU_DEPT_CODE>"+ $("#RETU_DEPT_CODE").prop("value") +"</RETU_DEPT_CODE>"
				+"<RETU_TIME>"+ $("#RETU_TIME").prop("value")  +"</RETU_TIME>"
				+"<RETU_CHECK_USER>"+ $("#RETU_CHECK_USER").prop("value") +"</RETU_CHECK_USER>"
				+"<RETU_CHECK_TIME>"+ $("#RETU_CHECK_TIME").prop("value") +"</RETU_CHECK_TIME>"
				+"</TABLE>";
		 gResObj = new Array();
		$('#divdetail').find("table[class='tg']").each(function(i){
			var tableNum = $(this).attr("id").substring(5);
			if(!($("#ITEM_OBJ_NUM"+tableNum).prop("value"))){
				jetsennet.warn("资源数量不能为空!");
				flag = false;
				return;
			}
			gResObj[i]=$("#resno"+tableNum).prop("value");
			 xml+="<TABLE CLASS_NAME='jetsennet.jdlm.beans.PpnRentInItem'>"
					+"<RETU_ID ref-field='jetsennet.jdlm.beans.PpnRentReturn.RETU_ID'></RETU_ID>"
					+"<ITEM_OBJ_TYPE>"+  $("#hid_ITEM_OBJ_TYPE"+tableNum).prop("value") +"</ITEM_OBJ_TYPE>"
					+"<ITEM_OBJ_CODE>"+ $("#resno"+tableNum).prop("value") +"</ITEM_OBJ_CODE>"
					+"<ITEM_OBJ_NUM>"+ $("#ITEM_OBJ_NUM"+tableNum).prop("value") +"</ITEM_OBJ_NUM>"
					+"<ITEM_OBJ_UOM>"+ $("#hid_ITEM_OBJ_UOM"+tableNum).prop("value") +"</ITEM_OBJ_UOM>"
					+"<ITEM_OBJ_UOM_SUM>"+ $("#hid_ITEM_OBJ_UOM_SUM"+tableNum).prop("value") +"</ITEM_OBJ_UOM_SUM>"
					+"<ITEM_OBJ_PRICE>"+ $("#hid_ITEM_OBJ_PRICE"+tableNum).prop("value") +"</ITEM_OBJ_PRICE>"
					+"<ITEM_OBJ_DESC>"+ $("#hid_ITEM_OBJ_DESC"+tableNum).prop("value") +"</ITEM_OBJ_DESC>"
					+"<ITEM_OBJ_CURRENCY>"+ $("#hid_ITEM_OBJ_CURRENCY"+tableNum).prop("value") +"</ITEM_OBJ_CURRENCY>"
					+"<ITEM_CHECK_REMARK_WG>"+ $("#outresdepict"+tableNum).prop("value") +"</ITEM_CHECK_REMARK_WG>"
					+"<ITEM_CHECK_REMARK_JS>"+ $("#inresdepict"+tableNum).prop("value") +"</ITEM_CHECK_REMARK_JS>"
					+"<ITEM_DESC>"+ $("#backdepict"+tableNum).prop("value") +"</ITEM_DESC>";
					
//			console.debug($("#resno"+tableNum).prop("value"));
//			console.debug($("#resname"+tableNum).prop("value"));
//			console.debug($("#outresdepict"+tableNum).prop("value"));
//			console.debug($("#inresdepict"+tableNum).prop("value"));
//			console.debug($("#backdepict"+tableNum).prop("value"));
			$(this).find("tbody").find("tr input[type='radio']").each(function(i) {
				if (($(this).attr('name') == 'outcompare'+tableNum)) {
//					console.debug(this.checked);
				}
				if (($(this).attr('name') == 'outcompare'+tableNum)&&(this.checked==true)) {
//					console.debug($(this).attr('value'));
					xml+="<ITEM_CHECK_BEFORE_WG>"+ $(this).attr('value') +"</ITEM_CHECK_BEFORE_WG>";
				}
				if (($(this).attr('name') == 'outchekresult'+tableNum)&&(this.checked==true)) {
//					console.debug($(this).attr('value'));
					xml+="<ITEM_CHECK_RESULT_WG>"+ $(this).attr('value') +"</ITEM_CHECK_RESULT_WG>";
				}
				if (($(this).attr('name') == 'incompare'+tableNum)&&(this.checked==true)) {
//					console.debug($(this).attr('value'));
					xml+="<ITEM_CHECK_BEFORE_JS>"+ $(this).attr('value') +"</ITEM_CHECK_BEFORE_JS>";
				}
				if (($(this).attr('name') == 'inchekresult'+tableNum)&&(this.checked==true)) {
//					console.debug($(this).attr('value'));
					xml+="<ITEM_CHECK_RESULT_JS>"+ $(this).attr('value') +"</ITEM_CHECK_RESULT_JS>";
				}
				if (($(this).attr('name') == 'backresult'+tableNum)&&(this.checked==true)) {
//					console.debug($(this).attr('value'));
					xml+="<ITEM_RESULT>"+ $(this).attr('value') +"</ITEM_RESULT>";
				}
			});
			xml+="</TABLE>";
		});
		
		    xml+="</TABLES>";
		    
//		    console.debug(xml);
		    if(flag){
		    	var params = new HashMap();
		    	params.put("saveXml", xml);
		    	jetsennet.confirm("确定提交入库？", function() {
		    		SYSDAO.execute("commonObjsInsert", params, {
		    			success : function(resultVal) {
		    				updateRes();
		    				jetsennet.alert("成功!");
		    				/*var obj = new Object();
		    				obj.ID = "9001";
		    				obj.NAME = "入库";
		    				obj.URL = "../../jdlm/rent/rentReturn.htm";
		    				parent.MyApp.showIframe(obj,false);
		    				parent.MyApp.closeIframe('12121212');*/
		    				window.parent.searchRetu();
		    		        window.parent.jetsennet.ui.Windows.close("add-divPopWin");
		    			},
		    			wsMode : "WEBSERVICE"
		    		}

		    		);
		    		return true;
		    	});
		    }
	}
	//	var returnName="入库单"+$("#RETU_CODE").prop("value");
	
	    
}


function updateRes(){
	var objXml="<TABLES>";
//	console.debug(gResObj);
	for(var i=0;i<gResObj.length;i++){
		objXml+="<TABLE TABLE_NAME='PPN_RENT_OBJ'>" +
		"<MODEL>" +
		"<OBJ_STATUS ParamType='Numeric'>1</OBJ_STATUS>" +
		"</MODEL>" +
		"<SqlWhereInfo>" +
		"<OBJ_CODE ParamType='String' RelationType='Equal' LogicType='And'>"+gResObj[i]+"</OBJ_CODE>" +
		"</SqlWhereInfo>" +
		"</TABLE>" +
		"";
	}
	objXml+="</TABLES>";
//	console.debug(objXml);
	var params = new HashMap();
	params.put("updateXml", objXml);
	SYSDAO.execute("commonObjsUpdateByCondition", params, {
		success : function(resultVal) {
		},
		wsMode : "WEBSERVICE"
	}

	);
}

/**
 * 返回
 */
function goParent(){
	jetsennet.confirm("确定不提交保存后返回？", function() {
		/*var obj = new Object();
		obj.ID = "9001";
		obj.NAME = "入库";
		obj.URL = "../../jdlm/rent/rentReturn.htm";
		parent.MyApp.showIframe(obj,false);
		parent.MyApp.closeIframe('12121212');*/
		window.parent.searchRetu();
        window.parent.jetsennet.ui.Windows.close("add-divPopWin");
		return true;
	});
	
	
}

//-------------------------------------------------------------------------
//select res
var gResObjCrud = $.extend(new jetsennet.Crud("divSelectResObjList", gSelectResObjColumns), {
	dao : SYSDAO,
	tableName : "PPN_RENT_OBJ",
    name : "出库对象",
    checkId : "chk_SelectResObj"
});
// select rentout
gOutResCrud = $.extend(new jetsennet.Crud("divSelectOutResList", gSelectOutResColumns), {
	dao : SYSDAO,
	tableName : "PPN_RENT_OUT",
    name : "出库单",
    checkId : "chkOUT"
});
gOutResCrud.grid.ondoubleclick = null;
//select user
Layoutit("#divSelectUser", {vLayout: [50, "auto", 35]});
var gUserCrud = $.extend(new jetsennet.Crud("divSelectUserList", gSelectUserColumns, "divSelectUserPage", "order by t.ID"), {
    dao : SYSDAO,
    tableName : "UUM_USER",
    name : "用户",
    checkId : "chk_SelectUser"
});
gUserCrud.grid.ondoubleclick = null;
//select column
Layoutit("#divSelectColumn", {vLayout: [50, "auto", 35]});
var gColumnCrud = $.extend(new jetsennet.Crud("divSelectColumnList", gSelectColColumns, "divSelectColumnPage", "order by t.COL_ID"), {
    dao : SYSDAO,
    tableName : "PPN_CDM_COLUMN",
    name : "栏目",
    checkId : "chk_SelectCol"
});
gColumnCrud.grid.ondoubleclick = null;

//select dept
Layoutit("#divSelectDept", {vLayout: [50, "auto", 35]});
var gDeptCrud = $.extend(new jetsennet.Crud("divSelectDeptList", gSelectDeptColumns, "divSelectDeptPage", "order by t.DEPART_ID"), {
    dao : SYSDAO,
    tableName : "UUM_DEPARTMENT",
    name : "部门",
    checkId : "chk_SelectDept"
});
gDeptCrud.grid.ondoubleclick = null;

/**
 * 查询用户
 */
function searchSelectUserData() {
    var conditions = [];
    el('txtUserName').value = jetsennet.util.trim(el('txtUserName').value);
    el('txtLoginName').value = jetsennet.util.trim(el('txtLoginName').value);
    if (el('txtUserName').value != "") {
        conditions.push([ "t.USER_NAME", el('txtUserName').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    if (el('txtLoginName').value != "") {
        conditions.push([ "t.LOGIN_NAME", el('txtLoginName').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gUserCrud.search(conditions);
}

/**
 * 查询部门
 */
function searchSelectDeptData() {
    var conditions = [];
    el('txtDeptName').value = jetsennet.util.trim(el('txtDeptName').value);
    if (el('txtDeptName').value != "") {
        conditions.push([ "t.DEPART_NO", el('txtDeptName').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "t.NAME", el('txtDeptName').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gDeptCrud.search(conditions);
}

/**
 * 查询栏目
 */
function searchSelectColumnData() {
    var conditions = [];
    el('txtColumnName').value = jetsennet.util.trim(el('txtColumnName').value);
    if (el('txtColumnName').value != "") {
        conditions.push([ "t.COL_CODE", el('txtColumnName').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
        conditions.push([ "t.COL_NAME", el('txtColumnName').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gColumnCrud.search(conditions);
}
//---------------------------------------
/**
 * 显示选择对话框，并处理其中的逻辑
 * 
 * @param {String}
 *            contentId 内容id
 * @param {String}
 *            selectId 选择对话框外的列表框id
 * @param {Object}
 *            options 对话框选项
 */
jetsennet.Crud.prototype.showNormallSelectDlg = function(contentId, selectId,options,obj) {
	jetsennet.Crud.showNormallSelectDlg("选择" + this.name, contentId,this.checkId, selectId, options,obj);
	this.load();
};

/**
 * 显示选择对话框，并处理其中的逻辑
 * 
 * @param {String}
 *            title 标题
 * @param {String}
 *            controlId 内容id
 * @param {String}
 *            checkName 选择对话框内的check控件name属性
 * @param {String}
 *            selectId 选择对话框外的列表框id
 * @param {Object}
 *            options 对话框选项
 */
jetsennet.Crud.showNormallSelectDlg = function(title, controlId, checkName,	selectId, options,paramObj) {
	var dialog = new jetsennet.ui.Window(title);
	jQuery.extend(dialog, {
		title : title,
		size : {
			width : 500,
			height : 370
		},
		submitBox : true,
		cancelBox : true,
		showScroll : false,
		controls : [ controlId ],
	}, options);
	dialog.onsubmit = function() {
		var obj = null;
		if ("chkOUT" == checkName) {
			if (gOutResCrud.grid.selectedRows[0] == null|| typeof (gOutResCrud.grid.selectedRows[0]) == undefined) {
				jetsennet.alert("请选择项！");
				return;
			}
			obj = getSelectedRow("divSelectOutResList",gOutResCrud.grid.selectedRows[0]).split("\,");
		}else if("chk_SelectUser" == checkName){
			if (gUserCrud.grid.selectedRows[0] == null|| typeof (gUserCrud.grid.selectedRows[0]) == undefined) {
				jetsennet.alert("请选择项！");
				return;
			}
			obj = getSelectedRow("divSelectUserList",gUserCrud.grid.selectedRows[0]).split("\,");
		}else if("chk_SelectCol" == checkName){
			if (gColumnCrud.grid.selectedRows[0] == null|| typeof (gColumnCrud.grid.selectedRows[0]) == undefined) {
				jetsennet.alert("请选择项！");
				return;
			}
			obj = getSelectedRow("divSelectColumnList",gColumnCrud.grid.selectedRows[0]).split("\,");
		}else if("chk_SelectDept" == checkName){
			if (gDeptCrud.grid.selectedRows[0] == null|| typeof (gDeptCrud.grid.selectedRows[0]) == undefined) {
				jetsennet.alert("请选择项！");
				return;
			}
			obj = getSelectedRow("divSelectDeptList",gDeptCrud.grid.selectedRows[0]).split("\,");
		}
		else if("chk_SelectResObj" == checkName){
			if (gResObjCrud.grid.selectedRows[0] == null|| typeof (gResObjCrud.grid.selectedRows[0]) == undefined) {
				jetsennet.alert("请选择项！");
				return;
			}
			obj = getSelectedRow("divSelectResObjList",gResObjCrud.grid.selectedRows[0]).split("\,");
		}
		
		if (selectId == "selectOutRes") {
			generateRetuFormOut(obj[0]);
		}else if(selectId == "selectResObj"){
			var resobj ={};
			resobj.ITEM_OBJ_CODE=obj[1];
			resobj.OBJ_NAME=obj[2];
			resobj.ITEM_OBJ_DESC=obj[3];
			resobj.ITEM_OBJ_SPECS=obj[4];
			resobj.ITEM_OBJ_TYPE=obj[5];
//			console.debug(resobj);
//			console.debug(resobj.OBJ_NAME);
			generateTableFormRes(resobj,true);
		}else if(selectId == "selMember"){
//			console.debug($(paramObj).attr("id"));
			$(paramObj).val(obj[1]);
//			console.debug($(paramObj).prop("value"));
		}else if(selectId == "selectColumn"){
			$(paramObj).val(obj[2]);
			$("#hid_RETU_COLUMN_CODE").val(obj[1]);
//			console.debug($(paramObj).prop("value"));
		}else if(selectId == "selectDept"){
			$(paramObj).val(obj[2]);
			$("#hid_RETU_DEPT_CODE").val(obj[1]);
//			console.debug($(paramObj).prop("value"));
		}
		
		return true;
	};
	dialog.showDialog();
};

