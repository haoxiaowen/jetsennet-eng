/** ===========================================================================
 * 用户管理
 * 20161211，jianghaisheng，新建
 * 20161211，jianghaisheng，修改
 * Copyright (c) Beijing Jetsen Technology Co., Ltd. All Rights Reserved.
 * ============================================================================
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "datepicker", "jquery/jquery.md5","plugins"]);

var ASSIGNDAO = new jetsennet.DefaultDal("PpnAssignService");
ASSIGNDAO.dataType = "xml";

var gToday;	//当天

var gApplicationColumns = [{ fieldName: "OUT_ID", width: 30, align: "center", isCheck: 1, checkName: "chkOUT"},
                    { fieldName: "OUT_NAME", sortField: "OUT_NAME", width: 160, align: "center", name: "出库单名称"},
                    { fieldName: "OUT_USER", sortField: "OUT_USER", width: 160, align: "center", name: "借用人员"},
                    { fieldName: "OUT_DEPT_CODE", sortField: "OUT_DEPT_CODE", width: 160, align: "center", name: "借用部门"},
                    { fieldName: "OUT_COLN_CODE", sortField: "OUT_COLN_CODE", width: 160, align: "center", name: "借用栏目"},
                    
                    { fieldName: "OUT_START_TIME", sortField: "OUT_START_TIME", width: 135, align: "center", name: "起借时间"},
                    { fieldName: "OUT_END_TIME", sortField: "OUT_END_TIME", width: 135, align: "center", name: "归还时间"},
                    { fieldName: "OUT_CHECK_USER", sortField: "OUT_CHECK_USER", width: 160, align: "center", name: "出库人员"},
                    { fieldName: "OUT_CREATE_TIME", sortField: "OUT_CREATE_TIME", width: 135, align: "center", name: "出库时间"},
                    { fieldName: "OUT_STATUS", sortField: "OUT_STATUS", width: 100, align: "center", name: "状态",
                    	format	:function(val,vals){
                    	 if(val==1){
                    		 return "已出库";
                    	 }
                    	 /*else if (val==1){
                    		 return "回收站";
                    	 }else{
                    		 return "已删除"; 
                    	 }*/
                     }
                    },
                    
                    { fieldName: "OUT_DESC", sortField: "OUT_DESC", width: 160, align: "center", name: "出库备注"},
                    { fieldName: "ITEM_NAME", sortField: "ITEM_NAME", width: 160, align: "center", name: "关联申请单"}
                    ];
var gSour = $.extend(new jetsennet.Crud("divApplicationList", gApplicationColumns, "divApplicationPage"), {
    dao : ASSIGNDAO,
    tableName : "PPN_RENT_OUT",
    joinTables: [ [ "PPN_RENT_OUT_ITEM", "ta", "ta.OUT_ID= t.OUT_ID", jetsennet.TableJoinType.left ]],
    resultFields : "t.OUT_ID,t.OUT_NAME,t.OUT_USER,t.OUT_DEPT_CODE,t.OUT_COLN_CODE,t.OUT_START_TIME,t.OUT_END_TIME,t.OUT_CHECK_USER,t.OUT_CREATE_TIME,t.OUT_DESC,ta.ITEM_NAME",
    tabAliasName : 't',
    name : "出库单",
    className : "jetsennet.jue2.beans.PpnRentOut",
    cfgId : "divadd",
    checkId : "chkOUT",
    
    oncateEditSet : function(obj) {
      el('txt_OUT_CODE').value = valueOf(obj, "OUT_CODE", "");
      el('txt_OUT_DEPT_CODE').value = valueOf(obj, "OUT_DEPT_CODE", "");
      el('txt_OUT_KEEPER').value = valueOf(obj, "OUT_KEEPER", "");
      el('txt_OUT_COLN_CODE').value = valueOf(obj, "OUT_COLN_CODE", "");
      el('txt_OUT_START_TIME').value = valueOf(obj, "OUT_START_TIME", "");
      el('txt_OUT_END_TIME').value = valueOf(obj, "OUT_END_TIME", "");
      el('txt_OUT_DESC').value = valueOf(obj, "OUT_DESC", "");
      el('txt_OUT_CREATE_TIME').value = valueOf(obj, "OUT_CREATE_TIME", "");
      el('txt_OUT_CHECK_USER').value = valueOf(obj, "OUT_CHECK_USER", "");
      el('txt_OUT_CHECK_TIME').value = valueOf(obj, "OUT_CHECK_TIME", "");
	  el('txt_OUT_USER').value = valueOf(obj, "OUT_USER", "");
      el('txt_OUT_USER_NAME').value = valueOf(obj, "OUT_USER_NAME", "");
  },
    
});
gSour.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() {
	gSour.load();
}

//新增出库单
function addOutOrder(){
	gToday = new Date().toDateString() + " " + new Date().toTimeString();
	var dialog = jetsennet.Crud.getConfigDialog("新增" + "资源借用出库单","divadd", {size : {width :820, height :700}});
	$("#new").removeAttr("disabled");
	dialog.showDialog();
	el('txt_OUT_CREATE_TIME').value = gToday;
	el('txt_OUT_CHECK_TIME').value = gToday;
	el('txt_OUT_KEEPER').value = jetsennet.Application.userInfo.UserName;
	gSour.load();
}


//新增资源出库单
function saveadd(){
	 //出库单号
	 if(el('txt_OUT_CODE').value==null||el('txt_OUT_CODE').value==""){
		 jetsennet.alert("出库单号,不能为空");
		 return true;
	 }
	 //借用部门
	 if(el('txt_OUT_DEPT_CODE').value==null||el('txt_OUT_DEPT_CODE').value==""){
		 jetsennet.alert("借用部门,不能为空");
		 return true;
	 }
	 //借用栏目
	 if(el('txt_OUT_COLN_CODE').value==null||el('txt_OUT_COLN_CODE').value==""){
		 jetsennet.alert("借用栏目,不能为空");
		 return true;
	 }
	 //起借时间
	 if(el('txt_OUT_START_TIME').value==null||el('txt_OUT_START_TIME').value==""){
		 jetsennet.alert("起借时间,不能为空");
		 return true;
	 }
	 //归还时间
	 if(el('txt_OUT_END_TIME').value==null||el('txt_OUT_END_TIME').value==""){
		 jetsennet.alert("归还时间,不能为空");
		 return true;
	 }
	 //库管人员
	 if(el('txt_OUT_KEEPER').value==null||el('txt_OUT_KEEPER').value==""){
		 jetsennet.alert("库管人员,不能为空");
		 return true;
	 }
	 //出库时间
	 if(el('txt_OUT_CREATE_TIME').value==null||el('txt_OUT_CREATE_TIME').value==""){
		 jetsennet.alert("出库时间,不能为空");
		 return true;
	 }
	 //出库说明
	 if(el('txt_OUT_DESC').value==null||el('txt_OUT_DESC').value==""){
		 jetsennet.alert("出库说明,不能为空");
		 return true;
	 }
	//领取人工号
	 if(el('txt_OUT_USER').value==null||el('txt_OUT_USER').value==""){
		 jetsennet.alert("领取人工号,不能为空");
		 return true;
	 }
	//核验时间
	 if(el('txt_OUT_CHECK_TIME').value==null||el('txt_OUT_CHECK_TIME').value==""){
		 jetsennet.alert("核验时间,不能为空");
		 return true;
	 }
	//出库核验
	 if(el('txt_OUT_CHECK_USER').value==null||el('txt_OUT_CHECK_USER').value==""){
		 jetsennet.alert("出库核验,不能为空");
		 return true;
	 }
	 var params = new HashMap();
	 var obj=onaddSource();
	 params.put("saveXml", jetsennet.xml.serialize(obj,"PPN_RENT_OUT"));
     var result = ASSIGNDAO.execute("saveSource", params);
	 if (result && result.errorCode == 0) {
		 jetsennet.alert("保存成功");
		 el('txt_OUT_ID').value=result.resultVal;
		$("#new").attr("disabled","disabled");
		   return true;
	    }
}

function onaddSource(){
	return {
		OUT_KEEPER:jetsennet.Application.userInfo.UserName,//库管员工号
		OUT_CODE:el('txt_OUT_CODE').value,//出库单代码
		OUT_DEPT_CODE:el('txt_OUT_DEPT_CODE').value,//借用部门
		OUT_COLN_CODE:el('txt_OUT_COLN_CODE').value,//借用栏目
		OUT_START_TIME:el('txt_OUT_START_TIME').value,//起借时间
		OUT_END_TIME:el('txt_OUT_END_TIME').value,//归还时间
		OUT_DESC:el('txt_OUT_DESC').value,//出库说明
		OUT_CREATE_TIME:el('txt_OUT_CREATE_TIME').value,//出库时间
		OUT_CHECK_USER:el('txt_OUT_CHECK_USER').value,//出库核验
		OUT_CHECK_TIME:el('txt_OUT_CHECK_TIME').value,//核验时间
		OUT_USER:el('txt_OUT_USER').value,//领取人工号
		OUT_USER_NAME:el('txt_OUT_USER_NAME').value,//领取人姓名
		OUT_STATUS:1,
		};
}


var UserInfo;
function addUser(obj){
	el("iframeUser").src = "../commonweb/getUser.htm";
	var dialog = new jetsennet.ui.Window("choose-User");
	jQuery.extend(dialog, {submitBox : true, cancelBox : true, size : {width : 600}, title : "选择人员" });
	dialog.controls = [ "divChoose" ];
	dialog.onsubmit = function() {
	 	var params = new HashMap();
	 	params.put("USER_IDS", UserInfo);
		var result = ASSIGNDAO.execute("selectUsers", params);
		jetsennet.alert("添加人员成功!");
		if(obj == '1'){
			el('txt_OUT_USER').value=UserInfo;
			el('txt_OUT_USER_NAME').value=result.resultVal;
		}else{
			el('txt_OUT_CHECK_USER').value=result.resultVal;
		}
		return true;
		jetsennet.ui.Windows.close("choose-User");
	};
	dialog.showDialog();
}

//新增出库单
function addSourceOut(){
	  if (el('txt_OUT_ID').value == null||el('txt_OUT_ID').value=="") {
        jetsennet.alert('请先保存出库单信息！');
       return false;
    }
	  gCrudSource.add();
	  selName();
}

//出库项
var gcColumnsource = [  { fieldName: "ITEM_ID", width: 30, align: "center", isCheck: 1, checkName: "item_id"},
  	                    { fieldName: "ITEM_CODE", sortField: "ITEM_CODE", width: 90, align: "center", name: "资源代码"},
  	                    { fieldName: "ITEM_OBJ_CODE", sortField: "ITEM_OBJ_CODE", width: 90, align: "center", name: "序列号" },
  	                    { fieldName: "ITEM_NAME", sortField:"ITEM_NAME", width: 90, align: "center", name: "名称" },
  	                    { fieldName: "ITEM_OBJ_DESC", sortField: "ITEM_OBJ_DESC", width:120, align: "center", name: "型号"},
  	                    { fieldName: "ITEM_OBJ_SPECS", sortField: "ITEM_OBJ_SPECS", width: 90, align: "center", name: "规格"},
  	                    { fieldName: "ITEM_OBJ_PRICE", sortField: "ITEM_OBJ_PRICE", width: 90, align: "center", name: "单价"},
  	                    { fieldName: "ITEM_OBJ_NUM", sortField: "ITEM_OBJ_NUM", width: 90, align: "center", name: "数量"},
  	                    { fieldName: "ITEM_REMARK", sortField: "ITEM_REMARK", width: 90, align: "center", name: "备注"},
  	                    { fieldName: "ITEM_FOLLOW_PERSON", sortField: "ITEM_FOLLOW_PERSON", width: 90, align: "center", name: "跟机人"},
  	                  { fieldName: "ITEM_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
  	                	  return jetsennet.Crud.getDeleteCell("gCrudSource.remove('" + val + "')");
                      }}
  	                   ];
  var gCrudSource = $.extend(new jetsennet.Crud("divout", gcColumnsource, "divPagesource", "order by t.ITEM_ID"), {
  	    dao : ASSIGNDAO,
  	    tableName : "PPN_RENT_OUT_ITEM",
  	    name : "出库项信息",
  	    className : "jetsennet.jue2.beans.PpnRentOutItem",
  	    checkId : "item_id",
  	    cfgId : "divsour",
  	    keyId:   "ITEM_ID",
  	  onAddInit : function() {
  		  
      },
      onAddValid : function() {
   	  
           return true;
      },
       onAddGet : function() {
    	    return {
    	    	OUT_ID:el('txt_OUT_ID').value,
    	    	ITEM_CODE : el('txt_ITEM_CODE').value,
    	    	ITEM_OBJ_CODE : el('txt_ITEM_OBJ_CODE').value,
    	    	ITEM_NAME : el('txt_ITEM_NAME').value,
    	    	ITEM_FOLLOW_PERSON : el('txt_ITEM_FOLLOW_PERSON').value,
    	    	ITEM_OBJ_PRICE : el('txt_ITEM_OBJ_PRICE').value,
    	    	ITEM_OBJ_NUM : el('txt_ITEM_OBJ_NUM').value,
    	    	ITEM_REMARK : el('txt_ITEM_REMARK').value,
    	    	ITEM_OBJ_SPECS : el('txt_ITEM_OBJ_SPECS').value,
    	    	ITEM_OBJ_DESC : el('txt_ITEM_OBJ_DESC').value,
    	    	ITEM_OBJ_UOM:1,
    	    	ITEM_OBJ_UOM_SUM:1,
    	    	ITEM_OBJ_TYPE:1,
           };
       },
       addDlgOptions : {size : {width : 700, height : 500}},
       onEditInit : function() {
       },
       onEditSet : function(obj) {
    	   el("txt_ITEM_CODE").value = valueOf(obj, "ITEM_CODE", "");
    	   el("txt_OUT_ID").value = valueOf(obj, "OUT_ID", "");
    	   el("txt_ITEM_OBJ_CODE").value = valueOf(obj, "ITEM_OBJ_CODE", "");
    	   el("txt_ITEM_NAME").value = valueOf(obj, "ITEM_NAME", "");
    	   el("txt_ITEM_FOLLOW_PERSON").value = valueOf(obj, "ITEM_FOLLOW_PERSON", "");
    	   el("txt_ITEM_OBJ_PRICE").value = valueOf(obj, "ITEM_OBJ_PRICE", "");
    	   el("txt_ITEM_OBJ_NUM").value = valueOf(obj, "ITEM_OBJ_NUM", "");
    	   el("txt_ITEM_REMARK").value = valueOf(obj, "ITEM_REMARK", "");
    	   el("txt_ITEM_OBJ_SPECS").value = valueOf(obj, "ITEM_OBJ_SPECS", "");
    	   el("txt_ITEM_OBJ_DESC").value = valueOf(obj, "ITEM_OBJ_DESC", "");
       },
       
       editDlgOptions : {size : {width : 700, height : 500}},
       
       onEditGet : function(id) {
    	   return {
    		   	ITEM_ID:el("txt_ITEM_ID").value,
    		    OUT_ID:el('txt_OUT_ID').value,
    		    ITEM_CODE:el("txt_ITEM_CODE").value,
    		    ITEM_OBJ_CODE:el("txt_ITEM_OBJ_CODE").value,
    		    ITEM_NAME:el("txt_ITEM_NAME").value,
    		    ITEM_FOLLOW_PERSON:el("txt_ITEM_FOLLOW_PERSON").value,
    		    ITEM_OBJ_PRICE:el("txt_ITEM_OBJ_PRICE").value,
    		    ITEM_OBJ_NUM:el("txt_ITEM_OBJ_NUM").value,
    		    ITEM_REMARK:el("txt_ITEM_REMARK").value,
    		    ITEM_OBJ_SPECS:el("txt_ITEM_OBJ_SPECS").value,
    		    ITEM_OBJ_DESC:el("txt_ITEM_OBJ_DESC").value,
    		    ITEM_OBJ_UOM:1,
    	    	ITEM_OBJ_UOM_SUM:1,
    	    	ITEM_OBJ_TYPE:1,
           };
       },
       onRemoveValid : function(checkIds) {
           return true;
       },
       onAddSuccess : function() {
    	   gCrudSource.conditions = 
    		   [["t.OUT_ID",el('txt_OUT_ID').value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ] ];
       }
  });
  
//修改出库单
  function editSource(){
  	$("#new").removeAttr("disabled");
  	var id=null;
  	var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkOUT") : jetsennet.Crud.getCheckIds(id,"chkOUT");
  	if (checkIds.length != 1) {
    	jetsennet.alert("请选择一个节目编目！");
        return;
    }
       var dialog = jetsennet.Crud.getConfigDialog("设置" + "资源借用出库单","divadd", {size : {width :930, height :850}});
         el("txt_OUT_ID").value=checkIds.join(",");
  	   var oldObj = null;
  	   var conditions = [["t.OUT_ID",checkIds.join(","), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String ] ];
  	   var resultFields = "t.*";
  	   var joinTables = [["PPN_RENT_OUT_ITEM", "ti", "ti.OUT_ID=t.OUT_ID", jetsennet.TableJoinType.Left]];
  	   oldObj = gCrudSource.dao.queryObj("commonXmlQuery","t.OUT_ID","PPN_RENT_OUT", "t", joinTables, conditions,resultFields);
  	  //出库项
  	   var condition=[["t.OUT_ID",checkIds.join(","), jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ] ];
  	   	gCrudSource.search(condition);
  	   	gCrudSource.load();
  	  selName();
  	   if (oldObj) {
  		 gSour.oncateEditSet(oldObj);
  		  
  	   }
  	dialog.showDialog();
  }
  
  function removeSource(id){
	  var checkIds = jetsennet.Crud.onGetCheckId ? jetsennet.Crud.onGetCheckId(id, "chkOUT") : jetsennet.Crud.getCheckIds(id,"chkOUT");
		 if (checkIds.length == 0) {
		        jetsennet.alert("请选择要删除的数据！");
		        return;
		    }
		jetsennet.confirm(gSour.msgConfirmRemove, function() {
	        var result = ASSIGNDAO.execute("removeSource", checkIds.join(","));
	        if (result && result.errorCode == 0) {
	        	gSour.load();
	        }
	        return true;
	    });
  }
  
  function selName(){
	  var result = SYSDAO.queryObjs("commonXmlQuery", "OBJ_ID", "ppn_rent_obj", null, null,null,"OBJ_ID,OBJ_NAME");
	  if (result) {
	    	$('#txt_ITEM_NAME').empty();
	        var len = result.length;
	        jQuery("<option selected='selected' >全部</option>", {}).attr("value", 0).appendTo($("#txt_ITEM_NAME"));
	        for (var i = 0; i < len; i++) {
	        	jQuery("<option>"+result[i].OBJ_NAME+"</option>", {}).attr("value", result[i].OBJ_ID).appendTo($("#txt_ITEM_NAME"));
	        }
	    }
  }
  
  function getVal(obj){
	  var objId = obj.value;
	  TotalPrice = 0;
	  var ret = ASSIGNDAO.query("commonXmlQuery", "p.obj_id", "ppn_rent_obj", "p", 
					[["Ppn_Rent_Obj_Type", "t", "p.obj_type_id = t.obj_type_id", jetsennet.TableJoinType.Left],
					 ["ppn_rent_obj_uom", "u", "t.obj_type_id = u.obj_type_id", jetsennet.TableJoinType.Left]],
			  		[["p.obj_id",parseInt(objId), jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],	
			  		"u.UOM_PRICE");
			if(ret){
				var _obj = jetsennet.xml.deserialize(ret.resultVal, "Record");
				if(_obj){
					el('txt_ITEM_OBJ_PRICE').value = _obj[0].UOM_PRICE;
				}
			}
			
  }
