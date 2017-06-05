/**
 * dhtmlGrid事务管理
 * 基于dgrid.js
 * @author zw	2014-12-8 17:13:49
 * @param grid		dhtmlGrid 对象
 * @param divId		grid所在的divId
 * @param filePath	配置文件位置
 * @returns {jetsennet.ui.dGridTra}
 */

jetsennet.ui.dGridTra = function(/*object*/grid, /*string*/divId, /*string*/filePath) {
	this._grid = grid;
	this._divId = divId;
	this._filePath = filePath;
	
	this._config;	//事务相关配置项
	//验证相关配置
	this._valiDateTypeArray = [];	//数据验证类型
	this._maxLens = [];
	this._minLens = [];
	this._maxVals = [];
	this._minVals = [];
	
	//记录对应行主键
	this.editKeys = [];
	this.saveKeys = [];
	this.delKeys = [];
	
	//缓存编辑的内容
	this.edtiTabs = [];
	this.saveTabs = [];
	this.delTabs = [];
	this.checkValObj = null;	//验证结果（默认空，没有错误）
	
	this.newLineTag = "new";	//新建行标记（用户可以自定义）
	this.delTag = "-1";
	
	var self = this;
	
	/**
	 * 初始化事务对象
	 */
	this.init = function(filePath) {
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
		
		self._config = configObj["business"];	
		
		//初始化验证相关内容
		var cellLen = configObj["tab-head"].cell.length;
		for (var i=0; i<cellLen; i++) {
			var cellObj = configObj["tab-head"].cell[i];
			if(cellObj["@validatetype"]) {
				self._valiDateTypeArray.push(cellObj["@validatetype"]);
			} else {
				self._valiDateTypeArray.push("");
			}
			if(cellObj["@maxlength"]) {
				self._maxLens.push(cellObj["@maxlength"]);
			} else {
				self._maxLens.push("");
			}
			if(cellObj["@minlength"]) {
				self._minLens.push(cellObj["@minlength"]);
			} else {
				self._minLens.push("");
			}
			if(cellObj["@maxvalue"]) {
				self._maxVals.push(cellObj["@maxvalue"]);
			} else {
				self._maxVals.push("");
			}
			if(cellObj["@minvalue"]) {
				self._minVals.push(cellObj["@minvalue"]);
			} else {
				self._minVals.push("");
			}
		}
	};
	

	this.init(filePath);
	
	/**
	 * 清除上次记录的编辑内容
	 */
	this.clearKeys = function () {
		this.editKeys = [];
		this.saveKeys = [];
		this.delKeys = [];
		this.edtiTabs = [];
		this.saveTabs = [];
		this.delTabs = [];
	};
	
	/**
	 * 清空缓存sql
	 */
	this.clearTabs = function() {
		this.edtiTabs = [];
		this.saveTabs = [];
		this.delTabs = [];
		this.checkValObj = null;
	};
	
	/**
	 * 修改的内容是否已经清空
	 */
	this.isKeysClear = function() {
		var res = true;
		if (this.editKeys[0] || this.saveKeys[0] || this.delKeys[0]) {
			res = false;
		}
		return res;
	};
	
	/**
	 * 默认编辑回调方法（需在客户端的编辑回调方法中显示调用）
	 * ①修改被编辑行颜色
	 * ②记录被编辑行的行主键
	 * 
	 * @param keyId			行主键
	 * @param cellIndex	列下标
	 */
	this.editCellCallBack = function (/*string*/keyId, /*Int*/cellIndex, /*string*/oldVal) {
		//验证合法性
		var newVal = self._grid.cellById(keyId, cellIndex).getValue();
		var checkRes = self._checkValidity(cellIndex, newVal);
		
		//获取对应行下标
		var rIndex = self._grid.getRowIndex(keyId);	
		//修改对应行颜色
		var queryStr = "#" + self._divId + " > div.objbox > table > tbody > tr";
		var trObj = $(queryStr).get(rIndex + 1);
		
		//如果验证没有通过，标示后，将值改为原值
		if (!checkRes.isValidate) {
			jetsennet.message(checkRes.errorMsg, {timeout: 5000});
			//将值恢复
			 self._grid.cellById(keyId, cellIndex).setValue(oldVal);
			 $($(trObj).children("td").get(cellIndex)).css("color", "#F35454");
			return;
		}
		
		if(keyId.indexOf(self.newLineTag) >= 0) {
			// 新增
			self.saveKeys.push(keyId);
		} else {		
			self.editKeys.push(keyId);
		}
		
		//修改字体颜色为暗红色（控制到td的原因是：css样式控制到td）
		$(trObj).children("td").each(function(){
			$(this).css("color", "#A25100");//#AA55FF
		});
	};
	
	/**
	 * 删除行（在客户端删除行逻辑中，需要显示调用）
	 * ①默认执行在grid中删除对应的行
	 * ②记录被删除行的行主键
	 */
	this.delRow = function() {
		if (self._grid.getSelectedRowId()) {
			jetsennet.confirm("确定删除？<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;<span style='color: red'>【删除后需要提交】</span>", function() {
				var _delKeys = self._grid.getSelectedRowId().split(",");
				var len = _delKeys.length;
				for ( var i = 0; i < len; i++) {
					if(_delKeys[i].indexOf(self.newLineTag) < 0) {
						//不是新增
						self.delKeys.push(_delKeys[i]);
					}
				}
				self._grid.deleteSelectedRows();
				return true;
			});
		} else {
			jetsennet.alert("请选择需要删除的内容！");
		}
	};

	/**
	 * 获得数据库字段名称（在xml配置的时候，有可能是 表别名.字段名）
	 */
	this.getColName = function(name) {
		//去掉可能存在的 表别名
		if (name.indexOf(".") > 0) {
			name = name.substr(name.indexOf(".")+1);
		}
		return name;
	};
	
	/**
	 * 获取特殊列处理方法
	 * 需要通过自定义方法获得对应字段的值
	 */
	this._getSpCol = function (_refTabConf, _refTab, isUpdate) {
		var isHandle = false;
		//需要特殊处理的列（如除配置中的主表外的其他被关联表链接的列）
		var spColsConf =  _refTabConf["special-col"];
		if (spColsConf ) {
			var spColsLen = spColsConf.length;
			if (spColsLen) {
				for(var i=0; i<spColsLen; i++) {
					var spCol = spColsConf[i];
					if (isUpdate && "true" != spCol["@is-update"]) {
						continue;	//该字段不执行更新操作
					}
					var _getFunc = window[spCol["@get-method"]];
					if (_getFunc) {
						var _obj = {};
						_obj["$"] = _getFunc();
						_refTab[spCol["@col-name"]] = _obj;
						isHandle = true;
					}
				}
			} else {
				if (isUpdate && "true" != spColsConf["@is-update"]) {
					return isHandle;	//该字段不执行更新操作
				}
				var _getFunc = window[spColsConf["@get-method"]];
				if (_getFunc) {
					var _obj = {};
					_obj["$"] = _getFunc();
					_refTab[spColsConf["@col-name"]] = _obj;
					isHandle = true;
				}
			}
		}
		return isHandle;
	};
	
	/**
	 * 获得关联表添加sql
	 */
	this._getSaveRefStr = function(_refTabConf, tabColNames, _mainKey) {
		var xml = "";
		if (_refTabConf) {
			var _refTab = {};
			var _isRefNull = true;
			if (_refTabConf["@cols-index"]) {
				//在grid中存在显示的列
				var refTabColsIndexs = _refTabConf["@cols-index"].split(",");
				var _refColsLen = refTabColsIndexs.length;
				for(var i=0; i< _refColsLen; i++) {
					var _colIndex = refTabColsIndexs[i];//需要记录的列下标
					var colName = self.getColName(tabColNames[_colIndex]);//获得数据字段名
					var _obj = {};
					var _val = self._grid.cellById(_mainKey, _colIndex).getValue();
					var _checkRes = self._checkNull(_colIndex, _val);
					if (!_checkRes.isValidate) {
						self.checkValObj = _checkRes;
						return;
					}
					
					if (_val && _val != self.delTag) {
						_obj["$"] = _val;
						_isRefNull = false;
					}
					_refTab[colName] = _obj;
				}
			}
			
			//需要特殊处理的列（如除配置中的主表外的其他被关联表链接的列）
			var isSpHandle  = self._getSpCol(_refTabConf, _refTab, false);
			if (_isRefNull && !isSpHandle) {
				return xml;
			}
			
			var foreignKey = _refTabConf["foreign-key"];
			//主外键关系
			var _obj = {};
			_obj["@ref-field"] = foreignKey["@ref-field-name"];
			_refTab[foreignKey["@col-name"]] = _obj;
			xml +=  jetsennet.xml.serialize(_refTab, {rootName:"TABLE", igoreAttribute: false})
							.replace(/<TABLE>/,"<TABLE CLASS_NAME='" +_refTabConf["@class-name"] + "'>");
		}
		self.saveTabs.push(xml);
		return xml;
	};
	
	/**
	 * 获得关联表删除sql
	 */
	this._getDelRefStr = function(_refTabConf, mainKey) {
		var xml = "";
		var foreignKeyConf =  _refTabConf["foreign-key"];
		_fkName = foreignKeyConf["@col-name"];
		
		xml += "<TABLE TABLE_NAME='" + _refTabConf["@tab-name"] + "'>";
		xml += "<SqlWhereInfo>";
		xml += "<"+_fkName+" ParamType='String' RelationType='In' LogicType='And'>"+ mainKey+"</"+_fkName+">";
		xml += "</SqlWhereInfo>";
		xml +="</TABLE>";
		return xml;
	};
	
	/**
	 * 获取关联表更新语句
	 */
	this._getUpdateRefStr = function(_refTabConf, /*行主键*/_mainKey, primaryKeyConf) {
		var xml = "";
		var tabColNames = self._grid.sortFieldNameArray;
		if (_refTabConf) {
			var _refTab = {};
			//设置关联表主键
			var refPriKeyConf = _refTabConf["primary-key"];
			if (refPriKeyConf["@key-index"] == null) {
				return xml;
			}
			var refKeyVal = _mainKey.split("|")[refPriKeyConf["@key-index"] ];	//关联表主键实际值
			if (refKeyVal) {
				var _keyObj = {};
				_keyObj["$"] = refKeyVal;
				_refTab[refPriKeyConf["@col-name"]] = _keyObj;
			}
			//需要特殊处理的列（（关联其他表）-外键）
			var isSpHandle  = self._getSpCol(_refTabConf, _refTab, true);
			
			if (_refTabConf["@cols-index"]) {
				//在grid中存在显示的列
				var refTabColsIndexs = _refTabConf["@cols-index"].split(",");
				var _refColsLen = refTabColsIndexs.length;
				for(var i=0; i< _refColsLen; i++) {
					var _colIndex = refTabColsIndexs[i];//需要记录的列下标
					var colName = self.getColName(tabColNames[_colIndex]);//获得数据字段名
					var _obj = {};
					var _val = self._grid.cellById(_mainKey, _colIndex).getValue();
					//如果该值为删除标记并且含有关联主键，则执行删除
					if (_val == self.delTag) {
						if (refKeyVal) {
							var _fkName = _refTabConf["primary-key"]["@col-name"];
							// 执行删除
							var delXml = "";
							delXml += "<TABLE TABLE_NAME='" + _refTabConf["@tab-name"] + "'>";
							delXml += "<SqlWhereInfo>";
							delXml += "<"+_fkName+" ParamType='String' RelationType='In' LogicType='And'>"+refKeyVal +"</"+_fkName+">";
							delXml += "</SqlWhereInfo>";
							delXml +="</TABLE>";
							self.delTabs.push(delXml);
						}
						return xml;	//执行删除，不需要更新
					}
					
					var _val = self._grid.cellById(_mainKey, _colIndex).getValue();
					var _checkRes = self._checkNull(_colIndex, _val);
					if (!_checkRes.isValidate) {
						self.checkValObj = _checkRes;
						return;
					}
					
					_obj["$"] = _val;
					_refTab[colName] = _obj;
				}
			}
			
			if (!isSpHandle && !_refTabConf["@cols-index"]) {				
				return xml;	//从表没有显示的列，不需要更新
			}
			
			if (refKeyVal) {
				//包含主键为编辑
				xml +=  jetsennet.xml.serialize(_refTab, {rootName:"TABLE", igoreAttribute: false})
								.replace(/<TABLE>/,"<TABLE CLASS_NAME='" +_refTabConf["@class-name"] + "'>");
				self.edtiTabs.push(xml);
			} else {
				//不包含关联表主键为新增关联
				var foreignKey = _refTabConf["foreign-key"];
				//主外键关系
				var mainTabKeyVal = _mainKey.split("|")[primaryKeyConf["@key-index"] ];	//主表主键实际值
				var _obj = {};
				_obj["$"] = mainTabKeyVal;
				_refTab[foreignKey["@col-name"]] = _obj;
				
				xml +=  jetsennet.xml.serialize(_refTab, {rootName:"TABLE", igoreAttribute: false})
						.replace(/<TABLE>/,"<TABLE CLASS_NAME='" +_refTabConf["@class-name"] + "'>");
				self.saveTabs.push(xml);
			}
		}
		return xml;
	};
	
	/**
	 * 获取提交的sqlXml，并记录到缓存中(内部使用)
	 */
	this._getcommitStrs = function() {		
		var _MainTabConf = self._config["main-tab"];
		var _MainTabColsIndexs = _MainTabConf["@cols-index"].split(",");
		var tabColNames = self._grid.sortFieldNameArray;
		
		var _refTabConfs = self._config["relate-tab"];
		
		if(self.saveKeys[0]) {
			//保存主表
			for (var k=0; k<self.saveKeys.length; k++) {
				var _mainKey = self.saveKeys[k];	//行主键
				if (!_mainKey) {
					continue;
				}
				//判断新增行是否存在，如果已被删除，则不进行添加
				if (!self._grid.doesRowExist(_mainKey) || jetsennet.ui.dGrid.checkRowIsNull(self._grid, self.saveKeys[k])) {
					continue;	
				}
				
				var _colsLen = _MainTabColsIndexs.length;
				var _MainInfo = {};
				
				for(var i=0; i< _colsLen; i++) {
					var _colIndex = _MainTabColsIndexs[i];//需要记录的列下标
					var colName = self.getColName(tabColNames[_colIndex]);//获得数据字段名
					//验证是否非空
					var colVal = self._grid.cellById(_mainKey, _colIndex).getValue();
					var _checkRes = self._checkNull(_colIndex, colVal);
					if (!_checkRes.isValidate) {
						self.checkValObj = _checkRes;
						return;
					}
					var _obj = {};
					_obj["$"] = colVal;
					_MainInfo[colName] = _obj;
				}
				//需要特殊处理的列（如除配置中的主表外的其他被关联表链接的列）
				self._getSpCol(_MainTabConf, _MainInfo, false);	
				self.saveTabs.push(jetsennet.xml.serialize(_MainInfo, {rootName:"TABLE", igoreAttribute: false})
						.replace(/<TABLE>/,"<TABLE CLASS_NAME='" +_MainTabConf["@class-name"] + "'>"));
				
				//保存从表
				if (_refTabConfs) {
					var _refTabLen = _refTabConfs.length;
					if(_refTabLen) {
						for (var i=0; i<_refTabLen; i++) {
							var _refTabConf = _refTabConfs[i];
							self._getSaveRefStr(_refTabConf, tabColNames, _mainKey);
						}
					} else {
						self._getSaveRefStr(_refTabConfs, tabColNames, _mainKey);
					}
				}
			}
			if (self.checkValObj) {
				return;
			}
		}

		if(self.editKeys[0]) {
			for (var k=0; k<self.editKeys.length; k++) {
				//更新主表
				var _mainKey = self.editKeys[k];	//行主键	
				if (!_mainKey) {
					continue;
				}
				//判断更新行是否存在，如果已被删除，则不进行更新
				if (!self._grid.doesRowExist(_mainKey)) {
					continue;	
				}
				var _colsLen = _MainTabColsIndexs.length;
				var _MainInfo = {};
				var primaryKeyConf = _MainTabConf["primary-key"];
				var keyVal = primaryKeyConf["@key-index"] ? _mainKey.split("|")[primaryKeyConf["@key-index"] ] : _mainKey;	//主表主键实际值
				_MainInfo[primaryKeyConf["@col-name"]] = keyVal;		//设置表的主键值
				for(var i=0; i< _colsLen; i++) {
					var _colIndex = _MainTabColsIndexs[i];//需要记录的列下标
					var colName = self.getColName(tabColNames[_colIndex]);//获得数据字段名
					var colVal = self._grid.cellById(_mainKey, _colIndex).getValue();
					var _checkRes = self._checkNull(_colIndex, colVal);
					if (!_checkRes.isValidate) {
						self.checkValObj = _checkRes;
						return;
					}
					//_MainInfo[colName] = colVal;
					var _obj = {};
					_obj["$"] = colVal;
					_MainInfo[colName] = _obj;
					//_MainInfo[colName] = self._grid.cellById(_mainKey, _colIndex).getValue();
				}
				self._getSpCol(_MainTabConf, _MainInfo, true);	
				self.edtiTabs.push(jetsennet.xml.serialize(_MainInfo, {rootName:"TABLE", igoreAttribute: false})
						.replace(/<TABLE>/,"<TABLE CLASS_NAME='" +_MainTabConf["@class-name"] + "'>"));
				//更新从表
				if (_refTabConfs) {
					var _refTabLen = _refTabConfs.length;
					if(_refTabLen) {
						for (var i=0; i<_refTabLen; i++) {
							var _refTabConf = _refTabConfs[i];
							self._getUpdateRefStr(_refTabConf, _mainKey, primaryKeyConf);
							if (self.checkValObj) {
								return;
							}
						}
					} else {
						self._getUpdateRefStr(_refTabConfs, _mainKey, primaryKeyConf);
					}
				}
			}	
		}
	
	};

	/**
	 * 获取提交的xml字符串(外部使用)
	 * 返回
	 *  {
				commit: isCommit,	//是否有需要提交的内容
				xmlStr : "<OPERATES>...",	//sqlXml
				checkValObj : this.checkValObj //默认是正确提交，则为null
		};
	 */
	this.getCommitObj = function() {
		
		self.editKeys =  self.editKeys.unique();	//去重;
		self.saveKeys = self.saveKeys.unique();
		self.delKeys = self.delKeys.unique();
		
		this.clearTabs();
		this._getcommitStrs();
		
		var isCommit = false;
		if (this.checkValObj != null && !this.checkValObj.isValidate) {
			//验证没有通过
			var res = {
					commit: isCommit,
					xmlStr : "",
					checkValObj : this.checkValObj
			};
			this.clearTabs();
			return res;
		}
		
		var _MainTabConf = self._config["main-tab"];	//主表配置对象	
		var _refTabConfs = self._config["relate-tab"];	//关联表配置对象
		
		var xml = "<OPERATES>";
		//保存的内容
		xml += "<SAVE>";
		xml += "<TABLES>";
		if (self.saveTabs[0]) {
			xml += self.saveTabs.join("");
			isCommit = true;
		}
		xml += "</TABLES>";
		xml += "</SAVE>";
		//更新的内容
		xml += "<UPDATE isFilterNull='true' >";
		xml += "<TABLES>";
		if (self.edtiTabs[0]) {
			xml += self.edtiTabs.join("");
			isCommit = true;
		}
		
		xml += "</TABLES>";
		xml += "</UPDATE>";

		//删除的内容
		xml += "<DEL>";
		xml += "<TABLES>";
		
		if(self.delKeys[0]) {
			//主键
			var primaryKeyConf = _MainTabConf["primary-key"];
			var mainKeyIndex = primaryKeyConf["@key-index"];
			var _mainKey = self.delKeys.join(",");		//行主键
			if (mainKeyIndex) {
				_mainKey = jetsennet.ui.dGrid.getIds(_mainKey, mainKeyIndex);
			} 
			
			//删除从表
			var _fkName = "";
			if (_refTabConfs) {
				var _refTabLen = _refTabConfs.length;
				if (_refTabLen) {
					for (var i=0; i<_refTabLen; i++) {
						xml += self._getDelRefStr(_refTabConfs[i], _mainKey);
					}
				} else {
					xml += self._getDelRefStr(_refTabConfs, _mainKey);
				}
			}
			

			//删除主表
			_fkName = _MainTabConf["primary-key"]["@col-name"];
			xml += "<TABLE TABLE_NAME='" + _MainTabConf["@tab-name"] + "'>";
			xml += "<SqlWhereInfo>";
			xml += "<"+_fkName+" ParamType='String' RelationType='In' LogicType='And'>"+_mainKey +"</"+_fkName+">";
			xml += "</SqlWhereInfo>";
			xml +="</TABLE>";
			
			isCommit = true;
		}
		
		if (self.delTabs[0]) {
			xml += self.delTabs.join("");
			isCommit = true;
		}
		
		xml += "</TABLES>";
		xml += "</DEL>";
		xml += "</OPERATES>";
		
		var res = {
				commit: isCommit,
				xmlStr : xml
		};
		return res;
	};
	
	/**
	 * 默认验证项
	 */
	this.validateOptions = [
		{
			name : "notempty",
			onvalidate : function(val) {
				return !jetsennet.util.isNullOrEmpty(val.trim());
			},
			message : "不能为空值"
		},
		{
			name : "datetime,date",
			onvalidate : function(val) {
				jetsennet.require("js_datetime");
				return jetsennet.util.isNullOrEmpty(val) || jetsennet.DateTime.isDate(val);
			},
			message : "必须为日期(yyyy-MM-dd)"
		},
		{
			name : "integer,int",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || jetsennet.util.isInt(val);
			},
			message : "必须为整数"
		},
		{
			name : "uinteger",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || /^\d*$/.test(val);
			},
			message : "必须为无符号的整数"
		},
		{
			name : "double,float,money,numeric",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || /^-?\d*\.?\d*$/.test(val);
			},
			message : "必须为数字"
		},
		{
			name : "hhmmssff,hh:mm:ss:ff",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || /^(\d{2}(:\d{2}){3}\d?)?$/.test(val);
			},
			message : "必须为时码格式(hh:mm:ss:ff)"
		},
		{
			name : "hh:mm:ss",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || /^(\d{2}(:\d{2}){2})?$/.test(val);
			},
			message : "必须为时间格式(hh:mm:ss)"
		},
		{
			name : "email",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || /^(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*){0,1}$/.test(val);
			},
			message : "必须为有效的电子邮件格式"
		},
		{
			name : "abcandn",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || jetsennet.util.isABCAndN(val);
			},
			message : "必须为字母数字或下划线"
		},
		{
			name : "notsymbol",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || new RegExp(
								"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
								.test(val) == false;
			},
			message : "不能包含特殊符号"
		},
		{
			name : "illegal",
			onvalidate : function(val) {
				return jetsennet.util.isNullOrEmpty(val) || /[<>\\&]+/.test(val) == false;
			},
			message : "非法字符><\\&"
		},
		{
			name : "maxlength",
			onvalidate : function(val, index) {
				var maxlen = self._maxLens[index];
				this.message = "不能超过" + maxlen + "个字";
				return val.length <= parseInt(maxlen);
			},
			message : ""
		},
		{
			name : "minlength",
			onvalidate : function(val, index) {
				var minlen = self._minLens[index];
				this.message = "不能少于" + minlen + "个字";
				return val.length >= parseInt(minlen);
			},
			message : ""
		},
		{
			name : "maxvalue",
			onvalidate : function(val, index) {
				var maxval =  self._maxVals[index];
				this.message = "必须小于等于" + maxval;
				return jetsennet.util.isNullOrEmpty(val) || (/^-?\d*\.?\d*$/.test(val) && parseFloat(val) <= parseFloat(maxval));
			},
			message : ""
		},
		{
			name : "minvalue",
			onvalidate : function(val, index) {
				var minval = self._minVals[index];
				this.message = "必须大于等于" + minval;
				return jetsennet.util.isNullOrEmpty(val) || (/^-?\d*\.?\d*$/.test(val) && parseFloat(val) >= parseFloat(minval));
			},
			message : ""
		},
		{
			name : "filename",
			onvalidate : function(element, val) {
				return jetsennet.util.isNullOrEmpty(val) || /[\\|\/|\||\?|\:|\*|\<|\>|\"]/.test(val) == false;
			},
			message : "不能包含字符\\/|?:*<>\""
		} ];
				
		/**
		 * 验证非空
		 */
		this._checkNull = function(colIndex, colVal) {
			var bValidate = true;
		    var gErrorMsg = "";
		    
		    var validateType = self._valiDateTypeArray[colIndex];
		    if(validateType && validateType.toLowerCase().indexOf("notempty") >= 0) {
		    	//需要验证非空
		    	var _isNull = jetsennet.util.isNullOrEmpty(colVal.trim());
		    	if (_isNull) {
		    		var _colTitle  = self._grid.hdrLabels[colIndex];
		    		gErrorMsg = "[" + _colTitle +  "]不能为空值";
		    		bValidate = false;
		    	} 
		    }
		    
		    return {isValidate:bValidate, errorMsg: gErrorMsg};
		};
		
		/**
		 * 单元格验证
		 */
		this._checkValidity = function(colIndex, colVal) {
		    var bValidate = true;
		    var gErrorMsg = "";
	
		    var isValidate = true;
	        var validateMsg = "";
	        var validateType = self._valiDateTypeArray[colIndex];
	
	        if (validateType != "") {
	            var validateArr = validateType.split(',');
	            for (var j = 0; j < validateArr.length; j++) {
	                if (validateArr[j] == "")
	                    continue;
	                var curValidateString = validateArr[j].toLowerCase();
	                var hasMatchItem = false;
	
	                jQuery.each(self.validateOptions, function (i) {
	                    var vitems = this.name.split(",");
	                    for (var vi = 0; vi < vitems.length; vi++) {
	                        if (curValidateString.equal(vitems[vi])) {
	                            isValidate = this.onvalidate(/*单元格值*/colVal, /*单元格下标*/colIndex);
	                            hasMatchItem = true;
	                            break;
	                        }
	                    }
	                    if (!isValidate) {
	                        validateMsg = this.message;
	                        return false;
	                    }
	                    if (hasMatchItem) {
	                        return false;
	                    }
	                });
	                
	                if (!isValidate)
	                    break;
	            }
	        }
	        if (!isValidate) {
	            bValidate = false;
	            gErrorMsg = "[" + colVal +"]值错误！"+ validateMsg;
	        }
	        
		    return {isValidate:bValidate, errorMsg: gErrorMsg};
		};
};
