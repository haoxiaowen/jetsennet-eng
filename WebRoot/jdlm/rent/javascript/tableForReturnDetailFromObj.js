/**
 * 入库table
 * 
 * @author yyf 2016-12-13
 */
var gNum = 1;
var gTableSize = 0;

/**
 * 根据资源入库项
 * @param objout
 * @param type 
 */
function generateTableFormRes(objout,type) {
//	var objout=[];
	var bodydiv = jQuery("#divdetail");//动态添加table所在div
	// 构造出库项详情table--------开始------------
	getTableSize();
	//构造出库项详情table--------结束------------
	//构造入库资源table---------开始-------------
	var table = document.createElement("table");
	jQuery(table).css("float", "left");
	jQuery(table).css("margin-left", "5px");
	jQuery(table).addClass("tg");// 设置tableclass
	table.id = 'table' + gNum;// 设置tableid
	var tblBody = document.createElement("tbody");// 创建table body
	var tbody = jQuery("#tbdemo");
	jQuery(tblBody).html(tbody.html());
	jQuery(table).append(tblBody);// 把tbody 添加到body
	//构造入库资源table---------开始-------------

	//添加入库资源table
	bodydiv.append(table);
	//--------------------重命名入库资源table中的text name--------------------
	jQuery(tblBody).find("tbody").find("th input[type='text']").each(
			function(i) {
				if ($(this).attr('name') == 'resno') {
					$(this).val(objout.ITEM_OBJ_CODE);
					$(this).attr('id','resno' + gNum);
				}
				if ($(this).attr('name') == 'resname') {
					$(this).val(objout.OBJ_NAME);
					$(this).attr('id','resname' + gNum);
				}

			});
	//--------------------重命名入库资源table中的radio name--------------------
	jQuery(tblBody).find("tbody").find("tr input[type='radio']").each(
			function(i) {
				// 设置radio值
				// 初始化时，需要把每个单项框的名字改掉
				if ($(this).attr('name') == 'outcompare') {
					var tempname = "outcompare" + gNum;
					$(this).attr('name', tempname);
				}
				if ($(this).attr('name') == 'outchekresult') {
					var tempname = "outchekresult" + gNum;
					$(this).attr('name', tempname);
				}
				if ($(this).attr('name') == 'incompare') {
					var tempname = "incompare" + gNum;
					$(this).attr('name', tempname);
				}
				if ($(this).attr('name') == 'inchekresult') {
					var tempname = "inchekresult" + gNum;
					$(this).attr('name', tempname);
				}
				if ($(this).attr('name') == 'backresult') {
					var tempname = "backresult" + gNum;
					$(this).attr('name', tempname);
				}

			});
	
	//--------------------重命名入库资源table中的text name--------------------
	jQuery(tblBody).find("tbody").find("tr input[type='text']").each(
			function(i) {
				if ($(this).attr('name') == 'outresdepict') {
					$(this).attr('id','outresdepict' + gNum);
				}
				if ($(this).attr('name') == 'inresdepict') {
					$(this).attr('id','inresdepict' + gNum);
				}
				if ($(this).attr('name') == 'backdepict') {
					$(this).attr('id','backdepict' + gNum);
				}
				if ($(this).attr('name') == 'checkuser') {
					$(this).val(jetsennet.Application.userInfo.UserName);
					$(this).attr('id','checkuser' + gNum);
				}
				if ($(this).attr('name') == 'checktime') {
				    $(this).val(new Date().toDateTimeString());
					$(this).attr('id','checktime' + gNum);
				}

			});
	//--------------------重命名入库资源table中的hidden name--------------------
	jQuery(tblBody).find("tbody").find("tr input[type='hidden']").each(
			function(i) {
				if ($(this).attr('name') == 'hid_ITEM_OBJ_TYPE') {
					$(this).val(objout.ITEM_OBJ_TYPE);
					$(this).attr('id','hid_ITEM_OBJ_TYPE' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_NUM') {
					$(this).val(objout.ITEM_OBJ_NUM);
					$(this).attr('id','hid_ITEM_OBJ_NUM' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_UOM') {
					$(this).val(objout.ITEM_OBJ_UOM);
					$(this).attr('id','hid_ITEM_OBJ_UOM' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_UOM_SUM') {
					$(this).val(objout.ITEM_OBJ_UOM_SUM);
					$(this).attr('id','hid_ITEM_OBJ_UOM_SUM' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_PRICE') {
					$(this).val(objout.ITEM_OBJ_PRICE);
					$(this).attr('id','hid_ITEM_OBJ_PRICE' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_DESC') {
					$(this).val(objout.ITEM_OBJ_DESC);
					$(this).attr('id','hid_ITEM_OBJ_DESC' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_CURRENCY') {
					$(this).val(objout.ITEM_OBJ_CURRENCY);
					$(this).attr('id','hid_ITEM_OBJ_CURRENCY' + gNum);
				}
				if ($(this).attr('name') == 'hid_ITEM_OBJ_SPECS') {
					$(this).val(objout.ITEM_OBJ_SPECS);
					$(this).attr('id','hid_ITEM_OBJ_SPECS' + gNum);
				}

			});
	gNum++;
	setResNum();
}

/**
 * 设置资源序号
 */
function setResNum() {
	jQuery("#divdetail").find("table[class='tg'] tbody tbody").find("th span").each(
			function(i) {
//				console.debug($(this));
				var tempint = i + 1;
				$(this).html("入库资源" + tempint);

			});

}

/**
 * 删除table
 * @param obj
 */
function del_table(obj) {

	var tableId = $(obj).closest('table').attr('id');

	var tableNum = tableId.substring(5);

	$("#" + tableId).remove();
	$("#tableres" + tableNum).remove();

	setResNum();

	// $("#"+tableId).html("");

	// $("#tableres"+tableNum).html("");

}


/**
 * 查看出库情况
 * @param obj
 */
function view_table(obj) {
	var tableNum = $(obj).closest('table').attr('id').substring(5);
	if ($("#tableres" + tableNum).css("visibility") == "hidden") {
		$("#tableres" + tableNum).css("visibility", "visible ");
	} else {
		$("#tableres" + tableNum).css("visibility", "hidden");
	}
}

/**
 * 获取入库资源数量
 */
function getTableSize() {

	gTableSize = jQuery("#divdetail").children('table').length / 2;
//	console.debug(gTableSize);

}

