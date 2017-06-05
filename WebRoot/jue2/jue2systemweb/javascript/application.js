//=============================================================================
// UUMSystemService application
//=============================================================================
jetsennet.require(["layoutit"]);
jetsennet.importCss([ "jetsen", "bootstrap/bootstrap" ]);

var SYSTEM_CODE_JUUM = 20;

//uumdao
var UUMDAO = new jetsennet.DefaultDal("UUMSystemService");
UUMDAO.dataType = "xml";

//sysdao
var SYSDAO = new jetsennet.DefaultDal("SystemService");
SYSDAO.dataType = "xml";

var PPNDAO = new jetsennet.DefaultDal("PpnServiceIn","WEBSERVICE");
PPNDAO.dataType = "xml";

//权限模式:disable,hidden
var AUTH_MODE = "disable";

/**
 * 取系统配置
 * @param {String} configNames 配置项列表
 */
jetsennet.application.getSysConfig = function(configNames) {
    var param = new HashMap();
    param.put("params", configNames);
    var result = SYSDAO.execute("getVagueMutiConfigFromDB", param);
    var configs = {};
    if (result && result.resultVal) {
        var objs = jQuery.parseJSON(result.resultVal);
        if(objs && objs.length>0) {
            for(var i=0; i<objs.length; i++) {
                var obj = objs[i];
                configs[obj.NAME] = obj.DATA;
            }
        }
    }
    return configs;
};

/**
 * 校验界面上的控件是否可用
 */
jetsennet.application.checkFunctionValidate = function() {
    var menuId = jetsennet.queryString("sysid");
    if (!menuId) {
        return;
    }
    var param = new HashMap();
    param.put("userId", jetsennet.application.userInfo.UserId);
    param.put("menuId", menuId);
    var result = UUMDAO.execute("uumGetUserOperateFunction", param);
    if (result && result.resultVal) {
        var objs = jetsennet.xml.toObject(result.resultVal, "Table");
        if (objs && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                var element = $(".func-" + objs[i]["PARAM"]);
                if (element) {
                    if (!objs[i]["STATE"] == "0") {
                        if (AUTH_MODE == "hidden") {
                            element.hide();
                        } else {
                            element.attr("disabled", true);
                        }
                    }
                }
            }
        }
    }
};

jetsennet.util.formatTreeData = function(nodes, parentId, pIdField, idField, childrenField) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var randomString = function(size) {
        var string = "";
         for(var i = 0; i < size ; i ++) {
             var index = Math.ceil(Math.random()*(chars.length-1));
             string += chars.charAt(index);
         }
         return string;
    };
    var getValidField = function(obj, size) {
        while(true) {
            var field = "VALID_" + randomString(size);
            if(!obj[field] && !obj.hasOwnProperty(field)) {
                return field;
            }
        }
    };
    var addChildren = function(node, validField) {
        jQuery.each(nodes, function(){
            if(this[pIdField] == node[idField] && this[idField] != node[idField] && !this[validField]) {
                node[childrenField] = node[childrenField]||[];
                node[childrenField].push(this);
                this[validField] = true;
                addChildren(this, nodes, pIdField, idField, validField, childrenField);
            }
        });
    };
    var validField = getValidField(nodes[0], 6);
    var newNodes = [];
    jQuery.each(nodes, function(){     
        if(this[pIdField] == parentId && this[idField] != parentId  && !this[validField]) {
            this[validField] = true;
            newNodes.push(this);
            addChildren(this, validField);
        }
    });
    jQuery.each(nodes, function(){
        delete this[validField]; 
    });
    return newNodes;
};

/**
 * 初始化状态选择下拉框（通过PPN_CTLWORD表查询）
 * @param tableName 表名
 * @param fieldName 字段名
 * @param selId 	 填充下拉列表的Id
 * @param isCanNull 是否填充空值
 */
function initSelOptions(/*String*/tableName,/*String*/fieldName,/*String*/selId, /*boolean*/isCanNull) {
	
	var ret=SYSDAO.query("commonXmlQuery", "CW_ID", "PPN_CTLWORD", "c", null,
    		[["CW_TABLENAME",tableName,jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String],
    		 ["CW_FIELDNAME",fieldName,jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String]],
    		"CW_NAME,CW_DATA");
	var j = 0;
	var obj = jetsennet.xml.toObject(ret.resultVal, "Record");
	
	el(selId).innerHTML = "";
	if (isCanNull) {			
		el(selId).options[j] = new Option("- 空 -", "");
		j++;
	}
	
	if(obj){
		for(var i=0; i<obj.length; i+=1){
			if(!jetsennet.util.isNullOrEmpty(obj[i].CW_NAME)){
				el(selId).options[j] = new Option(obj[i].CW_NAME, obj[i].CW_DATA);
				if ( obj[i].CW_DATA == 1) {
					el(selId).options[j].selected = true;
				}
				j++;
			}
		}
	}
}

/**
 *  获取Grid选中行的主键（不通过复选框方式）
 * @author zw			2016-5-9
 * @param grid		Grid对象
 * @param keyId		主键名称（多个以逗号分隔）
 * @returns				返回所选行主键，逗号分隔（若多主键，主键间竖线分隔） e.g ①qw,12as,qw ②qw|as,1212w|ewwe
 */
function getGridSelKeys(/*object*/grid, /*string*/keyId) {
	var selRows = grid.selectedRows;
	var keys = keyId.split(",");
	var res = [];
	for (var i = 0; i<selRows.length; i++) {
		var rowNum = selRows[i];		//选中行下标
		if(keys.length  == 1) {
			res.push(grid.objItems[rowNum][keyId]);
		} else if (keys.length  > 1) {
			var rowKey = [];
			for (var j = 0; j< keys.length; j++) {
				rowKey.push(grid.objItems[rowNum][jetsennet.util.trim(keys[j])]);
			}
			res.push(rowKey.join("|"));
		}
	}
	return res.join(",");
}