/**
 * 对象管理
 */
jetsennet.require(["window", "gridlist", "pagebar", "jetsentree", "validate", "bootstrap/bootstrap", "crud", "jquery/jquery.md5"]);
//存放从获取对象的表得到的对象主键
var gtabColumns = [{ fieldName: "CFG_ID", width: 30, align: "center", isCheck: 1, checkName: "chkObj"},
                    { fieldName: "MON_SERVER_HOST", sortField: "MON_SERVER_HOST", width: 80, align: "center", name: "配置ip"},
                    { fieldName: "MON_SERVER_PORT", sortField: "MON_SERVER_PORT", width: 80, align: "center", name: "配置端口1"},
                    { fieldName: "MON_SERVER_CTLPORT", sortField: "MON_SERVER_CTLPORT", width: 150, align: "center", name: "配置端口2"},
                    { fieldName: "MON_SERVER_IMGPORT", sortField: "MON_SERVER_IMGPORT", width: 150, align: "center", name: "配置端口3"},
                    { fieldName: "BASHPATH1", sortField: "BASHPATH1", width: 150, align: "center", name: "配置路径"},
                    { fieldName: "MON_SERVER_TIMER", sortField: "MON_SERVER_TIMER", width: 100, align: "center", name: "配置时间"}
                    ];
var gCrud = $.extend(new jetsennet.Crud("divtabList", gtabColumns, "divtabPage","order by CFG_ID"), {
    dao : SYSDAO,
    tableName : "PPN_RENT_MON_CFG",
    name : "ip记录",
    className : "jetsennet.jdlm.beans.PpnRentMonCfg",
    keyId : "t.CFG_ID",
    cfgId : "divObj",
    checkId : "chkObj",
	addDlgOptions : {size : {width : 600, height : 430}},
	editDlgOptions : {size : {width : 600, height : 430}},
	onAddInit : function (){
		  return true;
	},
	onAddValid : function() {
		  return true;
    },
	onAddGet : function() {
        return {
        	MON_SERVER_HOST :  el('txt_MON_SERVER_HOST').value,
        	MON_SERVER_PORT : el('txt_MON_SERVER_PORT').value,
        	MON_SERVER_CTLPORT : el('txt_MON_SERVER_CTLPORT').value,
        	MON_SERVER_IMGPORT : el('txt_MON_SERVER_IMGPORT').value,
        	MON_SERVER_TIMER : el('txt_MON_SERVER_TIMER').value,
        	BASHPATH1:el('txt_BASHPATH1').value
        };
        window.parent.searchRetu();
	        window.parent.jetsennet.ui.Windows.close("add-divTablib");
        
    },
onEditSet : function(obj) {
	    el("txt_CFG_ID").value = valueOf(obj, "CFG_ID", "");
    	el("txt_MON_SERVER_HOST").value = valueOf(obj, "MON_SERVER_HOST", "");
    	el("txt_MON_SERVER_PORT").value = valueOf(obj, "MON_SERVER_PORT", "");
    	el("txt_MON_SERVER_CTLPORT").value = valueOf(obj, "MON_SERVER_CTLPORT", "");
    	el("txt_MON_SERVER_IMGPORT").value = valueOf(obj, "MON_SERVER_IMGPORT", "");
        el("txt_MON_SERVER_TIMER").value = valueOf(obj,"MON_SERVER_TIMER","");
        el("txt_BASHPATH1").value = valueOf(obj,"BASHPATH1","");
    },
    onEditGet : function(id) {
    	return {
    		CFG_ID : id,
    		MON_SERVER_HOST : el('txt_MON_SERVER_HOST').value,
    		MON_SERVER_PORT : el('txt_MON_SERVER_PORT').value,
    		MON_SERVER_CTLPORT : el('txt_MON_SERVER_CTLPORT').value,
    		MON_SERVER_IMGPORT : el('txt_MON_SERVER_IMGPORT').value,
    		MON_SERVER_TIMER : el('txt_MON_SERVER_TIMER').value,
    		BASHPATH1:el("txt_BASHPATH1").value
    	}
    },
});
gCrud.grid.ondoubleclick = null;
//gObjCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() {
    gCrud.load();

}
/**
 * 对象的条件查询（对象编码）
 * 
 */
function searchIP() {
	var conditions = [];
    var value = jetsennet.util.trim(el('txtHOST').value);
    if(value){
    	 conditions.push( ["t.MON_SERVER_HOST", value, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gCrud.search(conditions);
}
