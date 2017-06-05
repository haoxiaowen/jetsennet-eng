//=============================================================================
// haoxiaowen
// 2016-04-27
//=============================================================================
/**
 * 自动加载当前样式中的jetsenui.css
 */

jetsennet.importCss("jetsenui");

/**
 * 设定一个全局的变量，用于全局静态访问
 */
jetsennet.ui.Schedules = {};

/**
 * 设置当前脚本已加载
 */
jetsennet.addLoadedUri(jetsennet.getloadUri("schedule"));

/**
 * Schedule定义
 */
jetsennet.ui.Schedule = function (instanceId) {
    this.instanceId = instanceId;
    if (this.instanceId) {
        jetsennet.ui.Schedules[this.instanceId] = this;
    }
    /* public properties */
    this.titleArray = ["设备","时间"];//标题
    this.titleWidth = 190;//标题的宽度
    this.titleHeight = 50;//标题的高度
    this.itemWidth = 210;//单元格宽度
    this.itemHeigth = 60;//单元格高度
    this.containerId = null;//容器ID
    this.leftArray = null;//数组,顺序存放设备名称
    this.topArray = null;//数组,顺序存放时间
    this.itemArray = null;//数组,顺序存放数据
    this.isTopColSpan = true;//表头默认合并相同列
    
    /* private properties */
    this.constScrollSize = 17;//所有滚动条的宽度
    this.itemRows = 0;//单元格行数
    this.itemCloumns = 0;//单元格列数
    
    /* events */
    this.onItemNew = null;//新增
    this.onItemEdit = null;//编辑
};

/**
 * 重置
 */
jetsennet.ui.Schedule.prototype.clear = function () {
	el("schDivTop").innerHTML = "";
	el("schDivLeft").innerHTML = "";
	el("schDivItem").innerHTML = "";
};

/**
 * 呈现表格
 */
jetsennet.ui.Schedule.prototype.bind = function (containerId) {
	if(!el(containerId)){
		jetsennet.alert("不存在id为"+containerId+"的div");
		return;
	}
	this.containerId = containerId;
	var divGantt = '<table id="schTabGantt" class="sch_table">';
	divGantt += '<tr>';
	divGantt += '<td class="sch_gantt_td">';
	divGantt += '<div id="schDivStyle" class="sch_div" style="position:absolute;left:0;top:25;"></div>';
	divGantt += '<div id="schDivTitle" class="sch_div" style="position:absolute;left:0;top:25;">title</div>';
	divGantt += '</td>';
	divGantt += '<td class="sch_gantt_td">';
	divGantt += '<div id="schDivTop" class="sch_div" >top</div>';
	divGantt += '</td>';
	divGantt += '</tr>';
	divGantt += '<tr>';
	divGantt += '<td class="sch_gantt_td">';
	divGantt += '<div id="schDivLeft" class="sch_div">left</div>';
	divGantt += '</td>';
	divGantt += '<td class="sch_gantt_td">';
	divGantt += '<div id="schDivItem" class="sch_div" style="overflow:auto;">item</div>';
	divGantt += '</td>';
	divGantt += '</tr>';
	divGantt += '</table>';
	el(containerId).innerHTML = divGantt;
	
	$("#schDivItem").scroll(function(){//滚动同步
		el("schDivTop").scrollLeft = el("schDivItem").scrollLeft;
		el("schDivLeft").scrollTop = el("schDivItem").scrollTop;
	});
};

/**
 * 初始化表格
 */
jetsennet.ui.Schedule.prototype.init = function () {
	if(!this.leftArray){
		jetsennet.alert("未设置左侧数据leftArray");
		return;
	}
	if(!this.topArray){
		jetsennet.alert("未设置上面数据topArray");
		return;
	}
	this.clear();
    this.itemRows = this.leftArray.length;//单元格行数
    this.itemCloumns = this.topArray.length;//单元格列数
	var clientWidth = el(this.containerId).clientWidth;//可见宽度
	var clientHeight = el(this.containerId).clientHeight;//可见高度
	var dataWith = clientWidth - this.titleWidth;//所有单元格数据可见宽度
	var dataHeight = clientHeight - this.titleHeight;//所有单元格数据可见高度
	var dataScrollWidth= this.itemWidth * this.itemCloumns;//所有单元格数据宽度,有滚动条时比dataWith大,无滚动条时比dataWith小
	var dataScrollHeight = this.itemHeigth * this.itemRows;//所有单元格数据高度,有滚动条时比dataHeight大,无滚动条时比dataHeight小
	var topWidh = 0;
	var topHeight = this.titleHeight;
	var leftWidh = this.titleWidth;
	var leftHeight = 0;
	var contentWidh = 0;
	var contentHeight = 0;
	if(dataScrollWidth<=dataWith && dataScrollHeight>dataHeight){//只有竖向滚动条
		topWidh = dataScrollWidth;
		leftHeight = dataHeight;
		contentWidh = dataScrollWidth + this.constScrollSize;
		contentHeight = dataHeight;
	}else if(dataScrollWidth>dataWith && dataScrollHeight>dataHeight){//横竖都有滚动条
		topWidh = dataWith - this.constScrollSize;
		leftHeight = dataHeight - this.constScrollSize;
		contentWidh = dataWith;
		contentHeight = dataHeight;
	}else if(dataScrollWidth>dataWith && dataScrollHeight<=dataHeight){//只有横向滚动条
		topWidh = dataWith;
		leftHeight = dataScrollHeight;
		contentWidh = dataWith;
		contentHeight = dataScrollHeight + this.constScrollSize;
	}else if(dataScrollWidth<=dataWith && dataScrollHeight<=dataHeight){//没有滚动条
		topWidh = dataScrollWidth;
		leftHeight = dataScrollHeight;
		contentWidh = dataScrollWidth;
		contentHeight = dataScrollHeight;
	}
	el("schDivTitle").style.width = this.titleWidth + "px";
	el("schDivTitle").style.height = this.titleHeight + "px";
	el("schDivTop").style.width = topWidh + "px";
	el("schDivTop").style.height = topHeight + "px";
	el("schDivLeft").style.width = leftWidh + "px";
	el("schDivLeft").style.height = leftHeight + "px";
	el("schDivItem").style.width = contentWidh + "px";
	el("schDivItem").style.height = contentHeight + "px";
	
	this.initTableTitle(this.titleWidth,this.titleHeight);
	this.initTableTop(dataScrollWidth,this.titleHeight);
	this.initTableLeft(this.titleWidth,dataScrollHeight);
	this.initTableItem(dataScrollWidth,dataScrollHeight);
}

//标题
jetsennet.ui.Schedule.prototype.initTableTitle = function (width,height) {
	var tableStyle = "<table id='schTableStyle' class='sch_table' style='width:"+width+"px;height:"+height+"px;'>";
	tableStyle += "<tr><th style='position:absolute;top:0;right:0;bottom:0;left:0;border-right:"+this.titleWidth+"px solid #D0E0E0;; border-bottom:"+this.titleHeight+"px solid #F0F0F0;'></th></tr>";
	tableStyle += "</table>";
	el("schDivStyle").innerHTML = tableStyle;
	
	var tableTitle = "<table id='schTableTitle' class='sch_table' style='width:"+width+"px;height:"+height+"px;'>";
	tableTitle += "<tr><th class='sch_title_td' style='border-top:1px solid #C0C0C0;border-left:1px solid #C0C0C0;'></th><th class='sch_title_td' style='border-top:1px solid #C0C0C0;'>"+this.titleArray[1]+"</th></tr>";
	tableTitle += "<tr><th class='sch_title_td' style='border-left:1px solid #C0C0C0;'>"+this.titleArray[0]+"</th><th class='sch_title_td'></th></tr>";
	tableTitle += "</table>";
	el("schDivTitle").innerHTML = tableTitle;
}

//表头
jetsennet.ui.Schedule.prototype.initTableTop = function (width,height) {
	var tableTop = "<table id='schTableTop' class='sch_table' style='width:"+width+"px;height:"+height+"px;'>";
	var _obj = this.topArray[0];
	if(typeof(_obj)=="object"){//存在多行
		for(var item in _obj){
			tableTop += "<tr>";
			for(var m=0; m<this.itemCloumns; m+=1){
				tableTop += "<th id='sch_top_"+m+"' class='sch_top_td'>";
				tableTop += "<b>"+this.topArray[m][item]+"</b>";
				tableTop += "</th>";
			}
			tableTop += "</tr>";
		}
	}else{
		tableTop += "<tr>";
		for(var m=0; m<this.itemCloumns; m+=1){
			tableTop += "<th id='sch_top_"+m+"' class='sch_top_td'>";
			tableTop += this.topArray[m];
			tableTop += "</th>";
		}
		tableTop += "</tr>";
	}
	tableTop += "</table>";
	el("schDivTop").innerHTML = tableTop;
	if(this.isTopColSpan){
		this.colSpan("schTableTop");
	}
}

//表左侧
jetsennet.ui.Schedule.prototype.initTableLeft = function (width,height) {
	var tableLeft = "<table id='schTableLeft' class='sch_table' style='width:"+width+"px;height:"+height+"px;'>";
	var _obj = this.leftArray[0];
	if(typeof(_obj)=="object"){//存在多列
		for(m=0;m<this.itemRows;m++){
			tableLeft += "<tr>";
			var className = 'sch_left_even_td';
			if(m%2==0){
				className = 'sch_left_td';
			}
			for(var item in _obj){
				tableLeft += "<td id='sch_left_"+m+"' class='"+className+"' style='height:"+this.itemHeigth+"px;'>"+this.leftArray[m][item]+"</td>";
			}
			tableLeft += "</tr>";
		}
	}else{
		for(m=0;m<this.itemRows;m++){
			var className = 'sch_left_even_td';
			if(m%2==0){
				className = 'sch_left_td';
			}
			tableLeft += "<tr><td id='sch_left_"+m+"' class='"+className+"' style='height:"+this.itemHeigth+"px;'>"+this.leftArray[m]+"</td></tr>";
		}
	}
	tableLeft += "</table>";
	el("schDivLeft").innerHTML = tableLeft;
}

//表主体
jetsennet.ui.Schedule.prototype.initTableItem = function (width,height) {
	var tableContent = "<table id='schTableItem' class='sch_table' style='width:"+width+"px;height:"+height+"px;'>";
	for(var i=0;i<this.itemRows;i++){
		tableContent += "<tr>";
		var className = 'sch_item_even_td';
		if(i%2==0){
			className = 'sch_item_td';
		}
		for(var j=0;j<this.itemCloumns;j++){
			if(this.onItemNew){
				tableContent += "<td id='sch_item_"+i+"_"+j+"' class='"+className+"' style='height:"+this.itemHeigth+"px;' ondblclick="+this.onItemNew+"("+i+","+j+") >&nbsp;</td>";
			}else{
				tableContent += "<td id='sch_item_"+i+"_"+j+"' class='"+className+"' style='height:"+this.itemHeigth+"px;'>&nbsp;</td>";
			}
		}
		tableContent += "</tr>";
	}
	tableContent += "</table>";
	el("schDivItem").innerHTML = tableContent;
}

/**
 * 表格数据
 */
jetsennet.ui.Schedule.prototype.show = function(){
	if(!this.itemArray){
		jetsennet.alert("未设置表格数据itemArray");
		return;
	}
	for(var i=0; i<this.itemArray.length; i+=1){
		var obj = this.itemArray[i];
		var columnIndex = obj.columnIndex;
		var rowIndex = obj.rowIndex;
		var display = obj.display;
		if(typeof(columnIndex)!="number" || typeof(rowIndex)!="number"){
			continue;
		}
		var innerTxt = el("sch_item_"+rowIndex+"_"+columnIndex).innerHTML;
		var title = el("sch_item_"+rowIndex+"_"+columnIndex).title;
		if(innerTxt!="&nbsp;"){
			innerTxt += "<hr style='margin:2px;border:none;border-top:1px solid silver'/>";
			title += "\n";
		}
		if(typeof(display) == "object"){
			for(var item in display){
				if(innerTxt=="&nbsp;"){
					innerTxt = display[item];
					title = display[item];
				}else{
					innerTxt += "<br/>" + display[item];
					title += "\n" + display[item];
				}
			}
		}else{
			innerTxt = display;
			title = display;
		}
		el("sch_item_"+rowIndex+"_"+columnIndex).innerHTML = innerTxt;
		el("sch_item_"+rowIndex+"_"+columnIndex).title = title;
		$("#sch_item_"+rowIndex+"_"+columnIndex).removeAttr("ondblclick");
		var func = this.onItemEdit;
		$("#sch_item_"+rowIndex+"_"+columnIndex).bind("dblclick",function(){
			var indexArr = this.id.split("_");
			eval(func + "("+indexArr[2]+","+indexArr[3]+")");
		});
	}
	setTimeout(this.onResize(),10);
}

//合并表格相邻的相同列数据
jetsennet.ui.Schedule.prototype.colSpan = function (tabId) {
	var tab = el(tabId);
	var rows = tab.rows.length;
	if(rows<2){
		return;
	}
	var cols = tab.rows[0].cells.length;
	if(cols<2){
		return;
	}
	for(var i=0; i<rows-1; i+=1){
		var tempItem = tab.rows[i].cells[0].innerHTML;
		var tempCols = 1;
		var curCols = cols//获取列数
		for(var j=1; j<curCols; j+=1){
			var item = tab.rows[i].cells[j].innerHTML;
			if(item == tempItem){
				tempCols += 1;
			}else{
				if(tempCols > 1){//合并列
					var spanCol = j - tempCols;
					var delCol = spanCol + 1;
					tab.rows[i].cells[spanCol].colSpan = tempCols;
					for(var k=1; k<tempCols; k+=1){
						tab.rows[i].deleteCell(delCol);
					}
					tempItem = item;
					tempCols = 1;
					curCols = tab.rows[i].cells.length;//重新获取列数
					j = delCol;//从合并处继续
				}
			}
		}
		if(tempCols > 1){//行末合并列
			var spanCol = j - tempCols;
			var delCol = spanCol + 1;
			tab.rows[i].cells[spanCol].colSpan = tempCols;
			for(var k=1; k<tempCols; k+=1){
				tab.rows[i].deleteCell(delCol);
			}
		}
	}
}

//根据数据表格，动态调整左侧的行高
jetsennet.ui.Schedule.prototype.onResize = function () {
	for(var i=0; i<this.itemRows; i++){
		if(el("sch_item_"+i+"_0").offsetHeight > el("sch_left_"+i).offsetHeight){
			el("sch_left_"+i).style.height = el("sch_item_"+i+"_0").offsetHeight + "px";
		}
	}
}
