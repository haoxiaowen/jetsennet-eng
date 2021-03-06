/** ===========================================================================
 * 用户组管理
 * 20130816，白丹丹，新建
 * 20130819，白丹丹，修改
 * ============================================================================
 */
jetsennet.require([ "window", "gridlist", "pagebar", "validate", "ztree/jquery.ztree.all-3.5", "ztree/jztree", "crud"]);
jetsennet.importCss("ztree/zTreeStyle");

var gParentGroupId = 0;

var gGroupColumns = [{ fieldName: "ID", width: 30, align: "center", isCheck: 1, checkName: "chkUserGroup"},
                     { fieldName: "NAME", sortField: "NAME", width: 200, align: "left", name: "分组名称"},
                     { fieldName: "TYPE", sortField: "TYPE", width: 80, align: "center", name: "分组类型", format: function(val, vals){
                         if (val == 0) {
                             return "部门";
                         } else if (val == 1){
                             return "栏目";
                         } else if (val == 2){
                             return "分组";
                         } else {
                             return "频道";
                         }
                     }},
                     { fieldName: "GROUP_CODE", sortField: "GROUP_CODE", width: 200, align: "left", name: "分组代号"},
                     { fieldName: "DESCRIPTION", sortField: "DESCRIPTION", width: "100%", align: "left", name: "描述信息"},
                     { fieldName: "ID", width: 45, align: "center", name: "编辑", format: function(val,vals){
                         return jetsennet.Crud.getEditCell("gCrud.edit('" + val + "')");
                     }},
                     { fieldName: "ID", width: 45, align: "center", name: "删除", format: function(val,vals){
                         return jetsennet.Crud.getDeleteCell("gCrud.remove('" + val + "')");
                     }}];
var gCrud = $.extend(new jetsennet.Crud("divContent", gGroupColumns, "divPage"), {
    dao : UUMDAO,
    tableName : "UUM_USERGROUP",
    conditions : [[ "t.TYPE", 2, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric],
                  ["t.FIELD_1", "1100,1101", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]],
    name : "用户组",
    className : "Usergroup",
    cfgId : "divUserGroup",
    checkId : "chkUserGroup",
    addDlgOptions : {size : {width : 550, height : 450}},
    editDlgOptions : {size : {width : 550, height : 450}},
    onAddInit : function() {
        el("selMember").options.length = 0;
    },
    onAddValid : function() {
        return !_checkGroupExist();
    },
    onAddGet : function() {
        return {
            NAME : el("txtGroupName").value,
            TYPE : 2,//分组
            GROUP_CODE : el("txtGroupCode").value,
            PARENT_ID : el("ddlParentGroup").value,
            DESCRIPTION : el("txtDescription").value,
            FIELD_1 : 1100,
            GROUP_USER : jetsennet.Crud.getSelectVals("selMember")
        };
    },
    onEditInit : function() {
        el("selMember").options.length = 0;
    },
    onEditSet : function(obj) {
        el("txtGroupName").value = valueOf(obj, "NAME", "");
        el("txtGroupCode").value = valueOf(obj, "GROUP_CODE", "");
        el("txtDescription").value = valueOf(obj, "DESCRIPTION", "");
        el('ddlParentGroup').value = valueOf(obj, "PARENT_ID", "");
        
        var jointables = [["UUM_USERTOGROUP", "uu", "uu.USER_ID=u.ID", jetsennet.TableJoinType.Left],
                          ["UUM_USERGROUP", "ug", "ug.ID=uu.GROUP_ID", jetsennet.TableJoinType.Left]];
        var users = UUMDAO.queryObjs("commonXmlQuery", "u.ID", "UUM_USER", "u", jointables, [["uu.GROUP_ID", obj.ID, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]], "u.ID,u.USER_NAME AS NAME,u.STATE");
        if(users && users.length>0) {
            jQuery.each(users, function(){
               var state = this.STATE!=0?" (已停用)":""; 
               this.NAME += state;
            });
        }
        jetsennet.Crud.initItems("selMember", users);
    },
    onEditValid : function(id, obj) {
        if (el("txtGroupName").value != valueOf(obj, "NAME", "") && _checkGroupExist()) {
            return false;
        }
        return true;
    },
    onEditGet : function(id) {
        return {
            ID : id,
            NAME : el("txtGroupName").value,
            GROUP_CODE : el("txtGroupCode").value,
            PARENT_ID : el("ddlParentGroup").value,
            DESCRIPTION : el("txtDescription").value,
            FIELD_1 : 1100,
            GROUP_USER : jetsennet.Crud.getSelectVals("selMember")
        };
    },
    msgConfirmRemove : "删除用户组,将自动删除关联信息,不可恢复,确认吗?"
});
gCrud.onAddSuccess = gCrud.onEditSuccess = gCrud.onRemoveSuccess = _loadGroupTree;

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
    _loadGroupTree(); 
};

/**
 * 加载左侧地区树及查询条件区域树
 * @private
 */
function _loadGroupTree() {
    var conditions = [["TYPE", 2, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric],
                      ["FIELD_1", "1100,1101", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]];
    var result = UUMDAO.query("commonXmlQuery", "ID", "UUM_USERGROUP", null, null, conditions, "ID,NAME,PARENT_ID");
    if (result && result.errorCode == 0) {
        var onclickEvent = function() {
            var treeNode = getTreeSelectedNodes("divTree");
            searchGroup(treeNode["id"]);
        }
        createTree(result.resultVal, "ID", "PARENT_ID", "NAME", "divTree", onclickEvent);
        
        el("ddlParentGroup").length = 0;
        el("ddlParentGroup").options[0] = new Option("系统分组", "0");
        var _obj = jetsennet.xml.deserialize(result.resultVal, "Record");
        var _len = _obj.length;
        for (var i = 0; i < _len; i++) {
            el("ddlParentGroup").options[i + 1] = new Option(_obj[i].NAME, _obj[i].ID);
        }
    }
}

/**
 * 查询
 * @param {String} parentId 父用户组Id
 */
function searchGroup(parentId) {
    gParentGroupId = parentId == null ? gParentGroupId : parentId;
    
    var conditions = [[ "t.TYPE", 2, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric],
                      ["t.FIELD_1", "1100,1101", jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.In, jetsennet.SqlParamType.String]];
    var subConditions = [];
    if (gParentGroupId > 0) {
        subConditions.push([["t.PARENT_ID", gParentGroupId, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric],
                ["t.ID", gParentGroupId, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]]);
    }
    var txtSearchGroupName = jetsennet.util.trim(el("txtSearchGroupName").value)//去除前后空格
    if (txtSearchGroupName) {
        subConditions.push([["t.NAME", txtSearchGroupName, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String],
                            ["t.GROUP_CODE", txtSearchGroupName, jetsennet.SqlLogicType.Or, jetsennet.SqlRelationType.Like, jetsennet.SqlParamType.String]]);
    }
    gCrud.search(conditions, subConditions);
}

/**
 * 检查用户组是否存在
 * @returns {Boolean}
 * @private
 */
function _checkGroupExist() {
    var conditions = [["PARENT_ID", gParentGroupId, jetsennet.SqlLogicType.and, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric],
                      ["TYPE", 2, jetsennet.SqlLogicType.And, jetsennet.SqlRelationType.Equal, jetsennet.SqlParamType.Numeric]];
    var groups = UUMDAO.queryObjs("commonXmlQuery", "ID", "UUM_USERGROUP", null, null, conditions, "NAME");
    if (groups) {
        var name = el("txtGroupName").value;
        for (var i = 0; i < groups.length; i++) {
            if (name == groups[i].NAME) {
                jetsennet.alert("此组中，[" + name + "]组名称已被使用！");
                return true;
            }
        }
    }
    return false;
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
