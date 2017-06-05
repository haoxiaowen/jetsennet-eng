/**
 * 货柜管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
var parentId;
var stat = 0;//stat值为0时 为全局操作，为1时为子级下的操作
var condition = [];
var gRackColumns = [{ fieldName: "RACK_ID", width: 30, align: "center", isCheck: 1, checkName: "chkRack"},
                   { fieldName: "RACK_CODE", sortField: "RACK_CODE", width: 135, align: "center", name: "编码"},

                   { fieldName: "RACK_NAME", sortField: "RACK_NAME", width: 135, align: "center", name: "名称"},
                   { fieldName: "RACK_ROW_SUM", sortField: "RACK_ROW_SUM", width: 80, align: "center", name: "行数"},
                   { fieldName: "RACK_COLUMN_SUM", sortField: "RACK_COLUMN_SUM", width: 80, align: "center", name: "列数"},
                   { fieldName: "RACK_STATUS", sortField: "RACK_STATUS", width: 80, align: "center", name: "状态", format: function(val, vals){
                	   if (val == 1) {
                           return  "启用";     
                       } else if (val == 0) {
                           return "禁用";
                       }
                   }},
                    { fieldName: "RACK_LENGTH", sortField: "RACK_LENGTH", width: 80, align: "center", name: "货架长"},
                    { fieldName: "RACK_WIDTH", sortField: "RACK_WIDTH", width: 80, align: "center", name: "货架宽"},
                    { fieldName: "RACK_HIGHTH", sortField: "RACK_HIGHTH", width: 80, align: "center", name: "货架高"},
                    { fieldName: "RACK_DESC", sortField: "RACK_DESC", width: 120, align: "center", name: "描述"},
                    { fieldName: "RACK_CREATE_TIME", sortField: "RACK_CREATE_TIME", width: 200, align: "center", name: "登记时间"},
                    
                    { fieldName: "RACK_ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }},
                    { fieldName: "RACK_ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edits('" + val + "')");
                    }}];
var gCrud = $.extend(new jetsennet.Crud("divRackList", gRackColumns, "divRackPage","order by RACK_CREATE_TIME"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_RACK",
    name : "货架管理",
    className : "jetsennet.jdlm.beans.PpnRentRack",
    keyId : "t.RACK_ID",
    cfgId : "divRack",
    checkId : "chkRack",
    conditions : condition,
    addDlgOptions : {size : {width : 600, height : 400}},
	editDlgOptions : {size : {width : 600, height : 400}},
	onAddValid : function() {
		if(stat==0){
			parentId =  el('selectRoom').value
			if(!parentId){
				jetsennet.alert("必须选择库房");
				return;
			}
    	}
		return true;
	},
	onEditValid : function(id) {
		if(stat==0){
			if(!el('selectRoom').value){
				jetsennet.alert("必须选择库房");
				return;
			}
    	}
		return true;
	},
	onAddGet : function() {
		
        return {
        	
    		ROOM_ID : parentId,
        	RACK_CODE : el('txt_RACK_CODE').value,
        	RACK_NAME : el('txt_RACK_NAME').value,
        	RACK_STATUS : el('txt_RACK_STATUS').value,
        	RACK_LENGTH : el('txt_RACK_LENGTH').value,
        	RACK_WIDTH : el('txt_RACK_WIDTH').value,
        	RACK_HIGHTH : el('txt_RACK_HIGHTH').value,
        	RACK_DESC : el('txt_RACK_DESC').value,
        	RACK_ROW_SUM : el('txt_RACK_ROW_SUM').value,
        	RACK_COLUMN_SUM : el('txt_RACK_COLUMN_SUM').value,
        	RACK_CREATE_TIME : new Date().toDateTimeString(),
            
        };
    },
    onEditSet : function(obj) {
    	if(stat == 0){
    		el("selectRoom").value = valueOf(obj, "ROOM_ID", "");
    	}
    	el("txt_RACK_CODE").value = valueOf(obj, "RACK_CODE", "");
    	el("txt_RACK_NAME").value = valueOf(obj, "RACK_NAME", "");
    	el("txt_RACK_STATUS").value = valueOf(obj, "RACK_STATUS", "");
    	el("txt_RACK_LENGTH").value = valueOf(obj, "RACK_LENGTH", "");
    	el("txt_RACK_WIDTH").value = valueOf(obj, "RACK_WIDTH", "");
    	el("txt_RACK_HIGHTH").value = valueOf(obj, "RACK_HIGHTH", "");
    	el("txt_RACK_DESC").value = valueOf(obj, "RACK_DESC", "");
    	el("txt_RACK_ROW_SUM").value = valueOf(obj, "RACK_ROW_SUM", "");
    	el("txt_RACK_COLUMN_SUM").value = valueOf(obj, "RACK_COLUMN_SUM", "");
    },
    onEditGet : function(id) {
    	
    	return {
    		RACK_ID : id,
    		RACK_NAME : el('txt_RACK_NAME').value,
        	RACK_STATUS : el('txt_RACK_STATUS').value,
        	RACK_LENGTH : el('txt_RACK_LENGTH').value,
        	RACK_WIDTH : el('txt_RACK_WIDTH').value,
        	RACK_HIGHTH : el('txt_RACK_HIGHTH').value,
        	RACK_DESC : el('txt_RACK_DESC').value,
        	RACK_ROW_SUM : el('txt_RACK_ROW_SUM').value,
        	RACK_COLUMN_SUM : el('txt_RACK_COLUMN_SUM').value,
        	RACK_CREATE_TIME : new Date().toDateTimeString(),
    	}
    },
    
});

/**
 * 页面初始化
 */
function pageInit() {
    
    parentId = jetsennet.queryString("room_id");
    if(parentId){
    	stat = 1;
    	condition.push(['ROOM_ID', parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String]);
    }
    gCrud.load();
}
gCrud.adds = function(){
	if(stat==0){
		onAddI();
	}else{
		el('RoomCode').style.display = "none";
	}
	gCrud.add();
}
gCrud.edits = function(val){
	if(stat==0){
		onAddI();
	}else{
		/*el('selectRoom').style.display = "none";*/
		el('RoomCode').style.display = "none";
	}
	gCrud.edit(val);
}
//获取库房信息
function onAddI(){
	var conditions = [['ROOM_STATUS', 1, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]];
	var result = SYSDAO.queryObjs('commonXmlQuery', 'ROOM_ID', 'PPN_RENT_ROOM', "t", null, conditions, 'ROOM_NAME NAME,ROOM_ID ID', null);
	if(result && result.length>0) {
		 jetsennet.Crud.initItems("selectRoom", result);
            };
}
/**
 * 条件查询（货架编码）
 * @param objName
 */
function searchRack() {
	var conditions = [];
    var value = jetsennet.util.trim(el('txtRackCode').value);
    if(value){
    	 conditions.push( ["t.RACK_CODE", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    if(parentId != null && parentId != ""){
    	conditions.push(["t.ROOM_ID", parentId, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String]);
    }
    
    gCrud.search(conditions);
}
gCrud.grid.ondoubleclick = function(obj) {
	vals = obj.RACK_ID//+","+obj.RACK_ROW_SUM+","+obj.RACK_COLUMN_SUM;
	if (true) {
		$.ajax({
			type : 'post',
			url : 'rentRackSkuByparentId.htm',
			success : function() {
				location.href = "rentRackSkuByparentId.htm?id=" + vals;
			},
			error : function() {
				jetsennet.alert("URL配置错误");
			}

		});

	}
}
function objURL(vals) {
	if (true) {
		$.ajax({
			type : 'post',
			url : "CargoPlan.htm",
			success : function() {
					location.href = "CargoPlan.htm?id=" + vals;
			},
			error : function() {
				jetsennet.alert("消息对象URL配置错误");
			}

		});

	} else {
		jetsennet.alert("没有找到对应的消息对象或对象没有配置URL");
	}
}

