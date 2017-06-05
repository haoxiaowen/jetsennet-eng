/**
 *  创建dhtmlGrid工具类
 *  @author zw	2014-9-22
 */

jetsennet.require(["sql"]);
jetsennet.registerNamespace("jetsennet.ui.dGrid");

/***********************************************************************************/
jetsennet.ui.dGrid.head = document.getElementsByTagName('head');
jetsennet.ui.dGrid.dhtmlScript = document.createElement('script');
jetsennet.ui.dGrid.dhtmlScript.src = jetsennet.baseUrl + "../../dhx/codebase/dhtmlxgrid.js";
jetsennet.ui.dGrid.dhtmlScript.type = 'text/javascript';
jetsennet.ui.dGrid.head[0].appendChild(jetsennet.ui.dGrid.dhtmlScript);

jetsennet.ui.dGrid.dhtmlLink = document.createElement('link');
jetsennet.ui.dGrid.dhtmlLink.rel ="stylesheet";
jetsennet.ui.dGrid.dhtmlLink.type = "text/css";
jetsennet.ui.dGrid.dhtmlLink.href = jetsennet.baseUrl + "../../dhx/codebase/dhtmlxgrid.css";
jetsennet.ui.dGrid.head[0].appendChild(jetsennet.ui.dGrid.dhtmlLink);
/***********************************************************************************/

/**
 * 创建dhtmlGrid
 */
jetsennet.ui.dGrid.create = function(divId, filePath) {
	var grid = null;
	try {
		grid = new dhtmlXGridObject(divId);
	} catch(e) {
		//alert(e);
		//document.location.reload();
	}
	grid.setSkin("dhx_skyblue");//dhx_skyblue,xp-比较接近,dhx_terrace - OK
	grid.setImagePath(jetsennet.baseUrl + "../../dhx/codebase/imgs/");
	grid.enableAutoWidth(true);
	
	var config = new jetsennet.XmlDoc();
	config.async = false;
	config.load(filePath);
	if (config.documentElement == null) {
        alert("加载文件:" + jetsennet.util.getFileName(filePath) + " 失败");
        return "";
    }
	
	var options = {arrayName:"config", igoreAttribute: false};
	options = jQuery.extend({ igoreAttribute: true, attributeFlag: "@", valueFlag: "$" }, options);
	var configObj = jetsennet.xml._toObject(config.documentElement, options);
	
	//设置表格属性
	var gridAttribute = configObj["grid-attribute"];
	if (gridAttribute) {
		//是否可以行多选
		grid.enableMultiselect(gridAttribute["@is-multiselect"] == "true" ? true : false);
		//设置分页对象
		var pageInfoStr = gridAttribute["@jetsen-page-info"] ? gridAttribute["@jetsen-page-info"] : "";
		if (pageInfoStr) {
			grid.setJetsenPageInfo(window[pageInfoStr]);
		}
	    //设置通用查询回调函数
		var comSearchStr = gridAttribute["@common-search"] ? gridAttribute["@common-search"] : "";
		if(comSearchStr) {		
			grid.setCommonSearch(window[comSearchStr]);
		}
	    //getColumnVals
		var getDbCollectFuncStr = gridAttribute["@get-db-collect"] ? gridAttribute["@get-db-collect"] : "";
		if (getDbCollectFuncStr) {
			grid.setGetDbCollectFunc(window[getDbCollectFuncStr]);
		}
		//设置是否可以编辑
		grid.setIsJetsenEditable(gridAttribute["@is-jetsen-editable"] == "true" ? true : false);
		//设置编辑回调方法
		var jetsenEditCallBackStr = gridAttribute["@jetsen-edit-callback"] ? gridAttribute["@jetsen-edit-callback"] : "";
		if (jetsenEditCallBackStr) {
			grid.setJetsenEditCallBack(window[jetsenEditCallBackStr]);
		}
		//设置自定义行响应事件
		var rowClickStr = gridAttribute["@row-click"] ? gridAttribute["@row-click"] : "";
		if (rowClickStr) {
			grid.setJetsenRowClickEevent(window[rowClickStr]);
		}
	}
	
    // $-取值  @ - 取属性
	var headTitleArray = [];
	var headTitleAlignArray = [];
	var attachHeaderArray = [];
	var colAlignArray = [];
	var fieldNameArray = [];
	var colTypesArray = [];
	var initWidths = [];
	var colSortingArray = [];
	
	//解析tab-head
	var cellLen = configObj["tab-head"].cell.length;
	for (var i=0; i<cellLen; i++) {
		var cellObj = configObj["tab-head"].cell[i];
		if(cellObj["@sort-field"]) {
			fieldNameArray.push(cellObj["@sort-field"]);
		} else {
			fieldNameArray.push("");
		}
		if(cellObj["@width"]) {
			initWidths.push(cellObj["@width"]);
		} else {
			initWidths.push("*");
		}
		if(cellObj["@attach-header"] == " ") {
			attachHeaderArray.push("&nbsp;");
		} else {
			attachHeaderArray.push(cellObj["@attach-header"]);
		}
		if(cellObj["@align"]) {
			colAlignArray.push(cellObj["@align"]);
		} else {
			colAlignArray.push("center");
		}
		if(cellObj["@type"]) {
			colTypesArray.push(cellObj["@type"]);
		} else {
			colTypesArray.push("ro");
		}
		colSortingArray.push("str");
		headTitleArray.push("<b>" + cellObj.$ + "</b>");	//统一 默认标题样式
		headTitleAlignArray.push("text-align:center;");
	}
	
	//配置grid
	grid.setHeader(headTitleArray.join(","), null, headTitleAlignArray);
	if(attachHeaderArray.join(",").length != cellLen-1) {
		//如果没有配置attachHeader属性，那么不再添加副标题
		grid.attachHeader(attachHeaderArray.join(","));
	}
	
	//宽度是否按百分比计算
	var isPixels = configObj["tab-head"]["@width-is-pixels"];
	if(isPixels && isPixels == "true") {
		grid.setInitWidths(initWidths.join(","));		//按像素计算宽度		
	}  else {
		grid.setInitWidthsP(initWidths.join(","));	//按百分比计算宽度
	}
	
	grid.setColAlign(colAlignArray.join(","));
	grid.setColSorting(colSortingArray.join(","));	//借用注册表头排序响应事件
    //设置排序相关 ------------
	grid.setSortFieldNameStr(fieldNameArray.join(","));	//设置分页列名
	// 说明：将列类型设为coro，可以将数据库的值转为指定内容
	grid.setColTypes(colTypesArray.join(","));
	
	var specialCell = configObj["special-cell"];
	if(specialCell && specialCell.cell) {
		var slen = specialCell.cell.length;
		for(var i=0; i<slen; i++) {
			var _cell = specialCell.cell[i];
			grid.getCombo(_cell["@index"]).put(_cell["@key"], _cell["@value"]);
		}
	}
	//通过受控词填充
	if (specialCell && specialCell["control-cell"]) {
		var slen = specialCell["control-cell"].length;
		if(slen) {
			for(var i=0; i<slen; i++) {
				var _cell = specialCell["control-cell"][i];
				jetsennet.ui.dGrid.fillCwWord(grid,_cell );
			}
		} else {
			var _cell = specialCell["control-cell"];
			jetsennet.ui.dGrid.fillCwWord(grid,_cell );
		}
	}
    
	//右键菜单键
	var contextMenu = configObj["context-menu"];
	if(contextMenu) {
		var menu = new dhtmlXMenuObject();
		menu.setIconsPath(jetsennet.baseUrl + "../../dhx/codebase/imgs/");
		menu.renderAsContextMenu();
		menu.attachEvent("onClick",window[contextMenu["@click-event"]]);
		menu.loadStruct(contextMenu["@common-path"]);
		grid.enableContextMenu(menu);
	}
	
    grid.init();
	return grid;
};

/**
 * 根据配置项填充对应列的受控词
 */
jetsennet.ui.dGrid.fillCwWord = function(grid, cell) {
	var _index = cell["@index"];
	var fieldName = grid.sortFieldNameArray[_index];
	var parentId = cell["@parent-id"] ? cell["@parent-id"] : 0;
	var func = cell["@get-data-func"];		//自定义获取受控词方法
	var cwDatas = null;
	if (func) {
		var _getCwDataFunc = window[func];
		if (_getCwDataFunc) {			
			cwDatas =_getCwDataFunc(fieldName, cell["@table-name"], parentId);
		}
	} else {
		cwDatas = jetsennet.ui.dGrid.getCtrword(fieldName, cell["@table-name"], parentId);				
	}
	jetsennet.ui.dGrid.setCombo(grid, _index, cwDatas);
};

/**
 * 从受控词表中获得对应的值PPN_CTLWORD
 * @param fieldName
 * @param tableName
 * @param parentId
 * @returns
 */
jetsennet.ui.dGrid.getCtrword= function(fieldName, tableName, parentId) {
	parentId = !parentId ? 0 : parentId;
	var cws = null;
	var sqlQuery = new jetsennet.SqlQuery();
    var queryTable = jetsennet.createQueryTable("PPN_CTLWORD","c");
    var conditions = new jetsennet.SqlConditionCollection();
    conditions.SqlConditions.push(jetsennet.SqlCondition.create("CW_TABLENAME", tableName,jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String));
    conditions.SqlConditions.push(jetsennet.SqlCondition.create("CW_FIELDNAME", fieldName,jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String));
    conditions.SqlConditions.push(jetsennet.SqlCondition.create("CW_PARENTID", parentId,jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal,jetsennet.SqlParamType.String));
    
    jQuery.extend(sqlQuery,{IsPageResult:1,KeyId:"CW_ID", ResultFields:"CW_NAME,CW_DATA",QueryTable:queryTable});
    sqlQuery.Conditions = conditions;
    
	var CONFIG_SERVICE = jetsennet.baseUrl + "../../services/SystemService?wsdl";
	var ws = new jetsennet.Service(CONFIG_SERVICE);
	ws.async = false;
    ws.oncallback = function(res) {
    	cws = jetsennet.xml.deserialize(res.resultVal, "Record");
    };
    ws.onerror = function(ex){ jetsennet.error(ex);};
    ws.call("commonXmlQuery",[sqlQuery.toXml()]);
	return cws;
};

/**
 * 获取受控词中对应的值
 * @param tpCtrlData
 * @param colName
 * @param searchTxt
 * @returns
 */
jetsennet.ui.dGrid.getCtrlDataVal = function (tpCtrlData, searchTxt) {
	var tpVal = null;
	if (!tpCtrlData) {
		return tpVal;
	}
	for (var i=0; i<tpCtrlData.length; i++) {
		if (tpCtrlData[i]["CW_NAME"] == searchTxt) {
			tpVal = tpCtrlData[i]["CW_DATA"];
			break;
		};
	}
	return tpVal;
};

/**
 * 在grid中填入受控词
 * @param grid
 * @param index
 * @param cwDatas
 */
jetsennet.ui.dGrid.setCombo = function(grid, index, cwDatas) {
	if(cwDatas) {
		if (cwDatas.length) {
			var _len = cwDatas.length;
			for(var i=0; i<_len; i++) {
				var cwData = cwDatas[i];
				if(cwData["CW_NAME"]) {					
					grid.getCombo(index).put(cwData["CW_DATA"], cwData["CW_NAME"]);
				}
			}
		}
	}
};

/**
 * 为dhtmlGrid转换结果
 * @param str
 * @returns
 */
jetsennet.ui.dGrid.changeStrCell = function (str){
//	var reg = /(<row[^s.]*?>)(.*?)<\/row>/ig;
	var reg = /(<row[^s.]*?>)([\s\S]*?)<\/row>/ig;	//含换行内的任意字符\s\S
	var strRe = str.replace(reg, function($0, $1, $2, $3){
		return $1 + $2.replace(/<[^\/.]*?>/ig, "<cell>").replace(/<\/.*?>/ig, "</cell>") + "</row>";
	});
	return strRe;
};

/**
 * 通过xml获得数据总行数
 * @param srcXml
 * @returns
 */
jetsennet.ui.dGrid.getCount = function (srcXml){
	var xmlDoc = jQuery.parseXML(srcXml);
	return jQuery(xmlDoc).find("rows").attr("TotalCount");
};

/**
 * 根据grid选择的结果，获取主键
 * @param ids grid选择的结果
 * @param index 主键所在结果集中的下标[id1|id11,id2,id22...]
 */
jetsennet.ui.dGrid.getIds = function(ids, index) {
	var res = null;
	if (ids) {
		var resArray = [];
		var idsArray = ids.split(",");
		if(index || index == 0) {
			var _len = idsArray.length;
			for (var i=0; i<_len; i++) {
				if (idsArray[i]) {	
					var temps = idsArray[i].split("|");
					if (temps[index]) {
						resArray.push(temps[index]);
					}
				}
			}
		} else {
			resArray = idsArray;
		}
		if(resArray.length) {					
			res = resArray.join(",");
		}
	}
	
	return res;
};

/**
 * 填充表格（含空白行）
 * @param grid
 * @param gridStr
 * @param pageSize
 */
jetsennet.ui.dGrid.fillGrid = function(grid, gridStr, pageSize, newTag) {
	newTag = newTag ? newTag : "new";
	var rowCount = 0;
	if (gridStr.match(/<\/row>/ig)) {		
		rowCount = gridStr.match(/<\/row>/ig).length;   
		if (rowCount < pageSize) {
			gridStr = gridStr.substring(0, gridStr.indexOf("</rows>"));
			var needLen = pageSize - rowCount;
			for(var i=0; i<needLen; i++) {
				gridStr += "<row id=\"" + newTag + i + "\">";
				var colSize = grid.sortFieldNameArray.length;
				for (var j=0; j<colSize; j++) {
					gridStr +="<cell></cell>";
				}
				gridStr += "</row>";
			}
			gridStr += "</rows>";
		} else if (rowCount == pageSize) {
			//grid填满时默认添加一条空白行
			gridStr = gridStr.substring(0, gridStr.indexOf("</rows>"));
			gridStr += "<row id=\"" + newTag + "1\">";
			var colSize = grid.sortFieldNameArray.length;
			for (var j=0; j<colSize; j++) {
				gridStr +="<cell></cell>";
			}
			gridStr += "</row>";
			gridStr += "</rows>";
		}
	} else {
		//内容为空
		gridStr = gridStr.substring(0, gridStr.indexOf("<rows TotalCount="));
		gridStr +="<rows TotalCount=\"0\">";
		var needLen = pageSize - rowCount;
		for(var i=0; i<needLen; i++) {
			gridStr += "<row id=\"" + newTag + i + "\">";
			var colSize = grid.sortFieldNameArray.length;
			for (var j=0; j<colSize; j++) {
				gridStr +="<cell></cell>";
			}
			gridStr += "</row>";
		}
		gridStr += "</rows>";
	}
	grid.loadXMLString(gridStr);
};

/**
 * 验证行内容是否为空值
 */
jetsennet.ui.dGrid.checkRowIsNull = function(grid, keyId) {
	var res = true;
	var colSize = grid.sortFieldNameArray.length;
	for (var i=0; i<colSize; i++) {
		if(grid.cellById(keyId,i).getValue()) {
			res = false;
			break;
		}
	}
	return res;
};

/**
 * Array去重
 * @returns {Array}
 */
Array.prototype.unique = function()
{
	this.sort();
	var re=[this[0]];
	for(var i = 1; i < this.length; i++)
	{
		if( this[i] !== re[re.length-1])
		{
			re.push(this[i]);
		}
	}
	return re;
};


