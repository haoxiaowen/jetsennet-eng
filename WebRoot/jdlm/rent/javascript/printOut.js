/**
 * 打印出库
 * 
 * @author yyf 2016-12-28
 */
jetsennet.require([ "window", "gridlist", "pageframe","datetime", "datepicker", "menu",
		"pagebar", "validate", "ztree/jquery.ztree.all-3.5", "ztree/jztree",
		 "bootstrap/daterangepicker", "crud" ]);
var gItemId = jetsennet.queryString("itemID");
function pageInit() { 
	generateOutFromId(gItemId);
	
}





/**
 * 根据出库单打印
 */
function generateOutFromId(id){
	var conditions = [];
	conditions.push([ "t.ITEM_ID", id, jetsennet.SqlLogicType.And,jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.String ]);
	var jointables =  [["PPN_RENT_OUT", "au", "t.OUT_ID = au.OUT_ID", jetsennet.TableJoinType.Inner],
	                   ["UUM_USER", "u", "u.USER_CODE = au.OUT_USER ", jetsennet.TableJoinType.Inner],
					   ["ppn_cdm_column", "col", "col.COL_CODE=au.out_coln_code", jetsennet.TableJoinType.Left],["uum_department", "dept", "trim(dept.depart_no) = trim(au.out_dept_code)", jetsennet.TableJoinType.Left]];
	var resultFields = "dept.NAME,col.COL_NAME,OUT_END_TIME,OUT_DESC,OUT_TYPE,MOBILE_PHONE,au.OUT_CODE,au.OUT_USER_NAME,au.OUT_USER,au.OUT_CREATE_TIME,au.OUT_DEPT_CODE,au.OUT_COLN_CODE,t.ITEM_NAME,t.ITEM_CODE,au.OUT_FIELD1,t.ITEM_FIELD1";
	var queryRes = SYSDAO.query("commonXmlQuery", "ITEM_ID", "PPN_RENT_OUT_ITEM",	"t", jointables, conditions, resultFields);
	if (queryRes && queryRes.resultVal) {
		if (jetsennet.xml.deserialize(queryRes.resultVal, "Record") != null) {
			var objout = null;
			objout = jetsennet.xml.deserialize(queryRes.resultVal, "Record");
			var len = objout.length;
			if(len>0){
				$("#outNo").append(objout[0].OUT_CODE);
				$("#outTime").append(objout[0].OUT_CREATE_TIME);
				$("#username").html(objout[0].OUT_USER_NAME);
				$("#mobilephone").html(objout[0].MOBILE_PHONE);
				$("#cdmcolumn").html(objout[0].COL_NAME);
				$("#usercode").html(objout[0].OUT_USER);
				$("#userdept").html(objout[0].NAME);
				$("#useplace").html(objout[0].OUT_FIELD1);
				
			}
			for (var i = 0; i < len; i++) {
				addNewRow(objout[i]);
				
			}
//			addLastRow(objout);
			createSencondInfo();
		}
	}
	
}


/**
 * 添加行
 * @param obj
 */
function addNewRow(/** Object**/ obj) {
	var table1 = $("#outdev");
    var row = $("<tr></tr>");
    var td_1 = $("<td style='text-align: center' colspan=2“></td>");
    var td_2 = $("<td></td>");
    var td_3 = $("<td></td>");
    var td_4 = $("<td></td>");
    var td_5 = $("<td></td>");
    var td_6= $("<td colspan='2'></td>");
    td_1.append(obj.ITEM_NAME);
    td_2.append(obj.ITEM_CODE);
    td_3.append(obj.OUT_END_TIME);
//    td_3.append("2011-11-11");
    if(obj.OUT_TYPE=="1"){
    	td_4.append("否");
    }else{
    	td_4.append("是");
    }
    td_5.append("1");
//    td_6.append("背包*1  鼠标*1  电源*1");
    td_6.append(obj.ITEM_FIELD1);
    row.append(td_1);
    row.append(td_2);
    row.append(td_3);
    row.append(td_4);
    row.append(td_5);
    row.append(td_6);
    table1.append(row);
    
}

/**
 * 添加合计行
 * @param obj
 */
function addLastRow(/** Object**/ obj) {
	var table1 = $("#outdev");
    var row = $("<tr></tr>");
    var td_1 = $("<td colspan='2'>合计</td>");
    var td_2 = $("<td colspan='3'></td>");
    var td_3 = $("<td></td>");
    var td_4 = $("<td colspan='2'></td>");
    td_3.append(obj.length);
    row.append(td_1);
    row.append(td_2);
    row.append(td_3);
    row.append(td_4);
    table1.append(row);
    createSencondInfo();
}


/**
 * 两联单信息
 */
function createSencondInfo(){
	var srcDiv = jQuery("#divContent");
	var copyDiv = $("#copyinfoDiv");
	copyDiv.html(srcDiv.html());
}