/** ===========================================================================
 * 用户管理
 * 20161211，jianghaisheng，新建
 * 20161211，jianghaisheng，修改
 * Copyright (c) Beijing Jetsen Technology Co., Ltd. All Rights Reserved.
 * ============================================================================
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "datepicker", "jquery/jquery.md5","plugins"]);

var ASSIGNDAO = new jetsennet.DefaultDal("PpnSourceService");
ASSIGNDAO.dataType = "xml";

var gToday;	//当天
var gId;
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
                     }
                    },
                    
                    { fieldName: "OUT_DESC", sortField: "OUT_DESC", width: 160, align: "center", name: "出库备注"}];
var gSour = $.extend(new jetsennet.Crud("divApplicationList", gApplicationColumns, "divApplicationPage"), {
    dao : ASSIGNDAO,
    tableName : "PPN_RENT_OUT",
    resultFields : "t.OUT_ID,t.OUT_NAME,t.OUT_USER,t.OUT_DEPT_CODE,t.OUT_COLN_CODE,t.OUT_START_TIME,t.OUT_END_TIME,t.OUT_CHECK_USER,t.OUT_CREATE_TIME,t.OUT_DESC,t.OUT_STATUS",
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
	 if(el('txt_OUT_ID').value==null || el('txt_OUT_ID').value==""){
		 var obj=onaddSource();
	 }else{
		 var obj=oneditSource();
	 }
	 var params = new HashMap();
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
		OUT_STATUS:0,
		};
}

function oneditSource(){
	return {
		OUT_ID:el('txt_OUT_ID').value,//主键
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
		OUT_STATUS:0,
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
    	    	ITEM_OBJ_UOM:el('txt_ITEM_OBJ_UOM').value,
    	    	ITEM_OBJ_UOM_SUM:parseInt(el('txt_ITEM_OBJ_UOM_SUM').value),
    	    	ITEM_OBJ_TYPE:el('txt_OBJ_TYPE_NAME').value,
           };
       },
       addDlgOptions : {size : {width : 700, height : 500}},
       onEditInit : function() {
       },
       onEditSet : function(obj) {
    	   selName(valueOf(obj, "ITEM_CODE", ""));
    	   el("txt_ITEM_CODE").value = valueOf(obj, "ITEM_CODE", "");
    	   el("txt_OUT_ID").value = valueOf(obj, "OUT_ID", "");
    	   el("txt_ITEM_ID").value = valueOf(obj, "ITEM_ID", "");
    	   el("txt_ITEM_OBJ_CODE").value = valueOf(obj, "ITEM_OBJ_CODE", "");
    	   el("txt_ITEM_NAME").value = valueOf(obj, "ITEM_NAME", "");
    	   el("txt_ITEM_FOLLOW_PERSON").value = valueOf(obj, "ITEM_FOLLOW_PERSON", "");
    	   el("txt_ITEM_OBJ_PRICE").value = valueOf(obj, "ITEM_OBJ_PRICE", "");
    	   el("txt_ITEM_OBJ_NUM").value = valueOf(obj, "ITEM_OBJ_NUM", "");
    	   el("txt_ITEM_REMARK").value = valueOf(obj, "ITEM_REMARK", "");
    	   el("txt_ITEM_OBJ_SPECS").value = valueOf(obj, "ITEM_OBJ_SPECS", "");
    	   el("txt_ITEM_OBJ_DESC").value = valueOf(obj, "ITEM_OBJ_DESC", "");
    	   el('txt_ITEM_OBJ_UOM').value = valueOf(obj, "ITEM_OBJ_UOM", "");
    	   el('txt_ITEM_OBJ_UOM_SUM').value = valueOf(obj, "ITEM_OBJ_UOM_SUM", "");
    	   el('txt_OBJ_TYPE_NAME').value = valueOf(obj, "ITEM_OBJ_TYPE", "");
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
    		    ITEM_OBJ_UOM:el('txt_ITEM_OBJ_UOM').value,
    	    	ITEM_OBJ_UOM_SUM:parseInt(el('txt_ITEM_OBJ_UOM_SUM').value),
    	    	ITEM_OBJ_TYPE:el('txt_OBJ_TYPE_NAME').value,
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
  
  function searchDepart() {
	    var conditions = [];
	    var subConditions = [];
	    if(el('txt_DESC').value){
	    subConditions.push([[ "t.OUT_USER",el('txt_DESC').value,  jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String  ],
		                 [ "t.OUT_DEPT_CODE", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ],
	    				 [ "t.OUT_COLN_CODE", el('txt_DESC').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]]);
	    }
	    gSour.search(conditions, subConditions);
	}

//资源类型列表
	var selectObjTypeColumns = [
	                            { fieldName: "OBJ_TYPE_CODE", sortField: "OBJ_TYPE_CODE", width: 135, align: "center", name: "类型编码"},
	                            { fieldName: "OBJ_TYPE_NAME", sortField: "OBJ_TYPE_NAME", width: 135, align: "center", name: "类型名称"},
	                            { fieldName: "OBJ_TYPE_DESC", sortField: "OBJ_TYPE_DESC", width: 135, align: "center", name: "类型描述"},
	                            { fieldName: "OBJ_TYPE_CREATE_TIME", sortField: "OBJ_TYPE_CREATE_TIME", width: 135, align: "center", name: "创建时间"}];
	var gTypeCrud = new jetsennet.Crud("divTypeList", selectObjTypeColumns, "divTypePage","order by OBJ_TYPE_CREATE_TIME");
	//对象类型ID
	var typeId; 
	//对象类型Name
	var typeName;
	var parId;
	gTypeCrud.grid.ondoubleclick = null;
	
	/**
	 * 单击获取类型Id和Name
	 */
	gTypeCrud.grid.onrowclick = function(item, td) {
		parId = item.OBJ_TYPE_ID;
		typeName = item.OBJ_TYPE_NAME;
	}
	
	/**
	 * 对象类型的查询方法
	 */
	function searchTypeCode(){
		typeId = ""; 
		typeName = "";
		var conditions = [["OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
		var value = jetsennet.util.trim(el('OBJ_TYPE_CODE').value);
		if(value){
			conditions.push(["OBJ_TYPE_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		}
		gTypeCrud.search(conditions);
	}

function searchSourceType(){
		var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
		jQuery.extend(_dialog, {
			size : {
				width : 700,
				height : 450
			},
			title : "选择资源类型",
			submitBox : true,
			cancelBox : true,
			maximizeBox : false,
			minimizeBox : false,
			controls : [ "divPageFrame3" ]
			
		});
		gTypeCrud = $.extend(gTypeCrud, {
		    dao : SYSDAO,
		    tableName : "PPN_RENT_OBJ_TYPE",
		    name : "资源类型",
		    keyId : "t.OBJ_TYPE_ID",
		    conditions :[["OBJ_TYPE_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]],
		    checkId : "chkType"});
		_dialog.show();
		gTypeCrud.load();

		_dialog.onsubmit = function() {
			typeId = parId;
			if(typeId){
				_dialog.close();
				el("txt_OBJ_TYPE_NAME").value = typeId;
				if(el('OBJ_TYPE_CODE').value != '' &&el('OBJ_TYPE_CODE').value != null){
					el('OBJ_TYPE_CODE').value = ''
				}
				selCode();
			}else{
				jetsennet.alert("请选择一个对象类型！");
				return;
			}
			
		}
		_dialog.showDialog()
	}

//资源代码下拉框
function selCode(){
	  var result = SYSDAO.query("commonXmlQuery", "p.obj_id", "ppn_rent_obj", "p", 
				[["Ppn_Rent_Obj_Type", "t", "p.obj_type_id = t.obj_type_id", jetsennet.TableJoinType.Left]],
		  		[["p.obj_type_id",parId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],	
		  		"p.*");
	  var _obj = jetsennet.xml.deserialize(result.resultVal, "Record");
	  if (_obj) {
	    	$('#txt_ITEM_CODE').empty();
	        var len = _obj.length;
	        jQuery("<option selected='selected' >全部</option>", {}).attr("value", 0).appendTo($("#txt_ITEM_CODE"));
	        for (var i = 0; i < len; i++) {
	        	jQuery("<option>"+_obj[i].OBJ_CODE+"</option>", {}).attr("value", _obj[i].OBJ_ID).appendTo($("#txt_ITEM_CODE"));
	        }
	    }
}

function selName(parId){
	var condition = [ [ 'p.obj_id', parId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'p.obj_id', 'ppn_rent_obj', "p",null, condition, 'p.*');
	
	  if (result) {
	    	$('#txt_ITEM_CODE').empty();
	        var len = result.length;
	        jQuery("<option selected='selected' >全部</option>", {}).attr("value", 0).appendTo($("#txt_ITEM_CODE"));
	        for (var i = 0; i < len; i++) {
	        	jQuery("<option>"+result[i].OBJ_CODE+"</option>", {}).attr("value", result[i].OBJ_ID).appendTo($("#txt_ITEM_CODE"));
	        }
	    }
}

function getVal(obj){
	  var objId = obj.value;
	  TotalPrice = 0;
	  var ret = SYSDAO.query("commonXmlQuery", "p.obj_id", "ppn_rent_obj", "p", 
					[["Ppn_Rent_Obj_Type", "t", "p.obj_type_id = t.obj_type_id", jetsennet.TableJoinType.Left],
					 ["ppn_rent_obj_uom", "u", "t.obj_type_id = u.obj_type_id", jetsennet.TableJoinType.Left]],
			  		[["p.OBJ_ID",objId, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],	
			  		"p.*,u.UOM_PRICE,u.UOM_NAME");
			if(ret){
				var _obj = jetsennet.xml.deserialize(ret.resultVal, "Record");
				if(_obj){
					el('txt_ITEM_NAME').value = _obj[0].OBJ_NAME;
					el('txt_ITEM_OBJ_SPECS').value = _obj[0].OBJ_SPECS;
					el('txt_ITEM_OBJ_DESC').value = _obj[0].OBJ_DESC;
					el('txt_ITEM_OBJ_CODE').value = _obj[0].OBJ_CODE;
					el('txt_ITEM_OBJ_PRICE').value = _obj[0].UOM_PRICE;
					el('txt_ITEM_OBJ_UOM').value = _obj[0].UOM_NAME;
				}
			}
}
function selNum(obj){
	  var count = obj.value;
	  var reg = new RegExp("^[0-9]*$");  
      if(!reg.test(count)){  
       alert("请输入数字!");
       el('txt_ITEM_OBJ_NUM').value = "";
       return;
      }  
	  var singePri = el('txt_ITEM_OBJ_PRICE').value;
	  el('txt_ITEM_OBJ_UOM_SUM').value = count * singePri;
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

function sourceDepart(){
		var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
		jQuery.extend(_dialog, {
			size : {
				width : 700,
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
				width : 700,
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
	var typeId; 
	//对象类型Name
	var userName;
	var parId;
	gFollowPers.grid.ondoubleclick = null;
	
	/**
	 * 单击获取类型Id和Name
	 */
	gFollowPers.grid.onrowclick = function(item, td) {
		parId = item.ID;
		userName = item.USER_NAME;
	}
	
	/**
	 * 对象类型的查询方法
	 */
	function searchuser(){
		typeId = ""; 
		userName = "";
		//var conditions = [["PARENT_ID", "0", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.String ]];
		var conditions = [];
		var value = jetsennet.util.trim(el('user').value);
		if(value){
			conditions.push(["USER_NAME", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
		}
		gFollowPers.search(conditions);
	}

function SelectPerson(){
		var _dialog = new jetsennet.ui.Window("obj-divTypeShow");
		jQuery.extend(_dialog, {
			size : {
				width : 700,
				height : 450
			},
			title : "选择借用栏目",
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
			typeId = parId;
			if(typeId){
				_dialog.close();
				el("txt_ITEM_FOLLOW_PERSON").value = userName;
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


/**
 * 单击事件  点击左边的出库单grid，显示右边的出库项
 */
var gSourGrid = gSour.grid;
gSourGrid.onrowclick = resOnRowClick;

function resOnRowClick(item, td) {
	gId = item.OUT_ID;
	loadResType(gId);
}
function loadResType(ID){
	var conditions = [["t.OUT_ID", ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]];
	gCrudItem.search(conditions);
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
var gCrudItem = $.extend(new jetsennet.Crud("divoutItem", gcColumnsource, "divPageItem", "order by t.ITEM_ID"), {
	    dao : ASSIGNDAO,
	    tableName : "PPN_RENT_OUT_ITEM",
	    name : "出库项信息",
	    className : "jetsennet.jue2.beans.PpnRentOutItem",
	    checkId : "item_id",
	    cfgId : "divsour",
	    keyId:   "ITEM_ID",
    onAddInit : function() {
        $('#myTab a:first').tab('show'); 
    },
    
    onAddValid : function() {
 	  
         return true;
    },
     onAddGet : function() {
  	    return {
  	    	OUT_ID:gId,
  	    	ITEM_CODE : el('txt_ITEM_CODE').value,
  	    	ITEM_OBJ_CODE : el('txt_ITEM_OBJ_CODE').value,
  	    	ITEM_NAME : el('txt_ITEM_NAME').value,
  	    	ITEM_FOLLOW_PERSON : el('txt_ITEM_FOLLOW_PERSON').value,
  	    	ITEM_OBJ_PRICE : el('txt_ITEM_OBJ_PRICE').value,
  	    	ITEM_OBJ_NUM : el('txt_ITEM_OBJ_NUM').value,
  	    	ITEM_REMARK : el('txt_ITEM_REMARK').value,
  	    	ITEM_OBJ_SPECS : el('txt_ITEM_OBJ_SPECS').value,
  	    	ITEM_OBJ_DESC : el('txt_ITEM_OBJ_DESC').value,
  	    	ITEM_OBJ_UOM:el('txt_ITEM_OBJ_UOM').value,
  	    	ITEM_OBJ_UOM_SUM:parseInt(el('txt_ITEM_OBJ_UOM_SUM').value),
  	    	ITEM_OBJ_TYPE:el('txt_OBJ_TYPE_NAME').value,
         };
     },
     addDlgOptions : {size : {width : 700, height : 500}},
     onEditInit : function() {
     },
     onEditSet : function(obj) {
  	   selName(valueOf(obj, "ITEM_CODE", ""));
  	   el("txt_ITEM_CODE").value = valueOf(obj, "ITEM_CODE", "");
  	   el("txt_OUT_ID").value = valueOf(obj, "OUT_ID", "");
  	   el("txt_ITEM_ID").value = valueOf(obj, "ITEM_ID", "");
  	   el("txt_ITEM_OBJ_CODE").value = valueOf(obj, "ITEM_OBJ_CODE", "");
  	   el("txt_ITEM_NAME").value = valueOf(obj, "ITEM_NAME", "");
  	   el("txt_ITEM_FOLLOW_PERSON").value = valueOf(obj, "ITEM_FOLLOW_PERSON", "");
  	   el("txt_ITEM_OBJ_PRICE").value = valueOf(obj, "ITEM_OBJ_PRICE", "");
  	   el("txt_ITEM_OBJ_NUM").value = valueOf(obj, "ITEM_OBJ_NUM", "");
  	   el("txt_ITEM_REMARK").value = valueOf(obj, "ITEM_REMARK", "");
  	   el("txt_ITEM_OBJ_SPECS").value = valueOf(obj, "ITEM_OBJ_SPECS", "");
  	   el("txt_ITEM_OBJ_DESC").value = valueOf(obj, "ITEM_OBJ_DESC", "");
  	   el('txt_ITEM_OBJ_UOM').value = valueOf(obj, "ITEM_OBJ_UOM", "");
  	   el('txt_ITEM_OBJ_UOM_SUM').value = valueOf(obj, "ITEM_OBJ_UOM_SUM", "");
  	   el('txt_OBJ_TYPE_NAME').value = valueOf(obj, "ITEM_OBJ_TYPE", "");
     },
     
     editDlgOptions : {size : {width : 700, height : 500}},
     
     onEditGet : function(id) {
  	   return {
  		   	ITEM_ID:id,
  		    OUT_ID:gId,
  		    ITEM_CODE:el("txt_ITEM_CODE").value,
  		    ITEM_OBJ_CODE:el("txt_ITEM_OBJ_CODE").value,
  		    ITEM_NAME:el("txt_ITEM_NAME").value,
  		    ITEM_FOLLOW_PERSON:el("txt_ITEM_FOLLOW_PERSON").value,
  		    ITEM_OBJ_PRICE:el("txt_ITEM_OBJ_PRICE").value,
  		    ITEM_OBJ_NUM:el("txt_ITEM_OBJ_NUM").value,
  		    ITEM_REMARK:el("txt_ITEM_REMARK").value,
  		    ITEM_OBJ_SPECS:el("txt_ITEM_OBJ_SPECS").value,
  		    ITEM_OBJ_DESC:el("txt_ITEM_OBJ_DESC").value,
  		    ITEM_OBJ_UOM:el('txt_ITEM_OBJ_UOM').value,
  	    	ITEM_OBJ_UOM_SUM:parseInt(el('txt_ITEM_OBJ_UOM_SUM').value),
  	    	ITEM_OBJ_TYPE:el('txt_OBJ_TYPE_NAME').value,
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
gCrudItem.grid.ondoubleclick = null;
/**
 * 出库项新建任务
 */
gCrudItem.add = function() {
    var $this = this;
    if(gId==null || gId=="undefined"){
		 jetsennet.alert("没有关联出库单，请单击左边出库单");	
		 return false;
	}
    var dialog = jetsennet.Crud.getConfigDialog(this.msgAdd + this.name, this.cfgId, this.addDlgOptions);
    if (this.onAddInit) {
        this.onAddInit();
    }
    dialog.onsubmit = function() {
        var areaElements = jetsennet.form.getElements($this.cfgId);
        if (!jetsennet.form.validate(areaElements, true)) {
            return false;
        }
        var obj = $this.onAddGet();
        return $this.directAdd(obj);
    };
    dialog.showDialog();
};
function examineSub(){
		//出库单ID、出库项ID 
	var checkIds = jetsennet.form.getCheckedValues("item_id"); 
		if(checkIds != ""){
			 var params = new HashMap();
			 params.put("item_id", checkIds.join(","));
				 ASSIGNDAO.execute("submitSource", params, {
				 	    success: function(result) {
				 	    	jetsennet.alert("提交审核成功!");
				 	    	gCrudItem.load();
				 	    	return true;
				 	    },
				 	   error: function(errCode,errStr) {
					    	jetsennet.error("提交审核失败");
					    	gCrudItem.load();
					    	return false;
					    },
				 	});
		}
}
