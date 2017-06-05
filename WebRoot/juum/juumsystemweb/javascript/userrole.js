/** ===========================================================================
 * 角色管理
 * 20130814，杨裕发，新建
 * ============================================================================
 */
jetsennet.require(["window", "gridlist", "pagebar", "validate", "ztree/jquery.ztree.all-3.5", "ztree/jztree", "bootstrap/bootstrap", "crud"]);
jetsennet.importCss("ztree/zTreeStyle");

var gFunctionTree = null;

var gRoleColumns = [{ fieldName: "ID", width: 30, align: "center", isCheck: 1, checkName: "chkUserRole"},
                    { fieldName: "NAME", sortField: "NAME", width: 180, align: "center", name: "角色名称"},
                    { fieldName: "TYPE", sortField: "TYPE", width: 60, align: "center", name: "状态", format: function(val, vals){
                        if (val == 0) {
                            return "启用";
                        } else {
                            return "禁用";
                        }
                    }},
                    { fieldName: "DESCRIPTION", sortField: "DESCRIPTION", width: "100%", align: "left", name: "描述信息",},
                    { fieldName: "ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                        return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                    }},
                    { fieldName: "ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                        return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                    }}];
var gCrud = $.extend(new jetsennet.Crud("divContent", gRoleColumns, "divPage", "order by t.ID"), {
    dao : UUMDAO,
    tableName : "UUM_ROLE",
    name : "角色",
    className : "Role",
    cfgId : "divRole",
    checkId : "chkUserRole",
    onAddInit : _funcInitDlg,
    onAddValid : function() {
        return !_checkRoleExist(0);
    },
    onAddGet : function() {
        return {
            NAME : el("txtRoleName").value,
            DESCRIPTION : el("txtDescription").value,
            TYPE : el("txtType").value,
            ROLE_FUNCTION : getItem(gFunctionTree),
            ROLE_USER : jetsennet.Crud.getSelectVals("selMember"),
            CREATE_TIME : new Date().toDateTimeString(),
        };
    },
    addDlgOptions : {size : {width : 500, height : 440}},
    onEditInit : _funcInitDlg,
    onEditSet : function(obj) {
        el("txtRoleName").value = valueOf(obj, "NAME", "");
        el("txtDescription").value = valueOf(obj, "DESCRIPTION", "");
        el("txtType").value = valueOf(obj, "TYPE", "");
        
        var jointables = [ [ "UUM_USERTOROLE", "ur", "ur.USER_ID=u.ID", jetsennet.TableJoinType.Left ] ];
        var users = UUMDAO.queryObjs("commonXmlQuery", "u.ID", "UUM_USER", "u", jointables, [ [ "ur.ROLE_ID", obj.ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ] ], "u.ID,u.USER_NAME AS NAME,u.STATE");
        if(users && users.length>0) {
            jQuery.each(users, function(){
                var state = this.STATE!=0?" (已停用)":""; 
                this.NAME += state;
            });
        }
        jetsennet.Crud.initItems("selMember", users);
        
        var funcs = UUMDAO.query("commonXmlQuery", "FUNCTION_ID,ROLE_ID", "UUM_ROLEAUTHORITY", null, null, [ [ "ROLE_ID", obj.ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ] ]);
        if (funcs && funcs.errorCode == 0) {
            setCheckTrue(gFunctionTree, funcs.resultVal, "FUNCTION_ID", true);
        }
    },
    onEditValid : function(id) {
        return !_checkRoleExist(id);
    },
    onEditGet : function(id) {
        return {
            ID : id,
            NAME : el("txtRoleName").value,
            DESCRIPTION : el("txtDescription").value,
            TYPE : el("txtType").value,
            ROLE_FUNCTION : getItem(gFunctionTree),
            ROLE_USER : jetsennet.Crud.getSelectVals("selMember"),
            CREATE_TIME : new Date().toDateTimeString(),
        };
    },
    editDlgOptions : {size : {width : 500, height : 440}}
});

Layoutit("#divSelectUser", {vLayout: [50, "auto", 35]});
var gUserCrud = $.extend(new jetsennet.Crud("divSelectUserList", gSelectUserColumns, "divSelectUserPage", "order by t.ID"), {
    dao : UUMDAO,
    tableName : "UUM_USER",
    name : "用户",
    checkId : "chk_SelectUser"
});
gUserCrud.grid.ondoubleclick = null;

/**
 * 页面初始化
 */
function pageInit() {
    gCrud.load();
    _loadFunctionTree();
};

/**
 * 查询角色
 */
function searchRole() {
    var conditions = [];
    if (el("txt_ROLE_NAME").value != "") {
        conditions.push([ "NAME", el('txt_ROLE_NAME').value, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String ]);
    }
    gCrud.search(conditions);
}

/**
 * 初始化对话框
 * @private
 */
function _funcInitDlg() {
    el('selMember').options.length = 0;
    setCheckFalse(gFunctionTree, false);
};

/**
 * 检查角色是否存在
 * @param {Int} id
 * @returns {Boolean}
 * @private
 */
function _checkRoleExist(id) {
    var roles = UUMDAO.queryObjs("commonXmlQuery", "ID", "UUM_ROLE", null, null, [ [ "ID", id, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.NotEqual, jetsennet.SqlParamType.Numeric ] ], "NAME");
    if (roles) {
        var name = el("txtRoleName").value;
        for (var i = 0; i < roles.length; i++) {
            if (name == roles[i].NAME) {
                jetsennet.alert("角色名称已被使用！");
                return true;
            }
        }
    }
    return false;
}

/**
 * 加载功能树
 * @private
 */
function _loadFunctionTree() {
    UUMDAO.query({
        method: "commonXmlQuery",
        keyId: "ID",
        tableName: "UUM_FUNCTION",
        conditions: [[ "STATE", 0, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric ]],
        resultFields: "ID, NAME, PARENT_ID",
        orderBy: "Order By PARENT_ID,VIEW_POS",
        options: {
            async:true,
            success:function(result) {
                gFunctionTree = createTree(result, "ID", "PARENT_ID", "NAME", "divFunction", null, true, null, null, null, true);
            }
        }
    });
}

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
