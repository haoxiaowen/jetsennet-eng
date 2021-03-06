/*
 * Copyright 2010-2016 the original author or authors.
 * 
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 文件：jetsennet.jdlm.beans.PpnRentObjType.java
 * 日 期：Tue Dec 06 14:08:31 CST 2016
 */
package jetsennet.jdlm.beans;

import java.io.Serializable;
import java.util.Date;
import org.uorm.orm.annotation.ClassMapping;
import org.uorm.orm.annotation.FieldMapping;

/**
 *
 * this file is generated by the uorm pojo tools.
 *
 * @author <a href="mailto:xunchangguo@gmail.com">郭训常</a>
 * @version 1.0.0
 */
@ClassMapping(tableName = "PPN_RENT_OBJ_TYPE", keyGenerator = "uuid")
public class PpnRentObjType implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_OBJ_TYPE_CHECK_RULE = "OBJ_TYPE_CHECK_RULE";
	public static String PROP_OBJ_TYPE_CODE = "OBJ_TYPE_CODE";
	public static String PROP_OBJ_TYPE_CREATE_TIME = "OBJ_TYPE_CREATE_TIME";
	public static String PROP_OBJ_TYPE_DESC = "OBJ_TYPE_DESC";
	public static String PROP_OBJ_TYPE_FIELD1 = "OBJ_TYPE_FIELD1";
	public static String PROP_OBJ_TYPE_FIELD2 = "OBJ_TYPE_FIELD2";
	public static String PROP_OBJ_TYPE_ID = "OBJ_TYPE_ID";
	public static String PROP_OBJ_TYPE_NAME = "OBJ_TYPE_NAME";
	public static String PROP_OBJ_TYPE_PARENT_ID = "OBJ_TYPE_PARENT_ID";
	public static String PROP_OBJ_TYPE_STATUS = "OBJ_TYPE_STATUS";
	public static String PROP_OBJ_TYPE_STATUS_DESC = "OBJ_TYPE_STATUS_DESC";
	public static String PROP_OBJ_TYPE_TABLE_NAME = "OBJ_TYPE_TABLE_NAME";
	public static String PROP_OBJ_TYPE_URL = "OBJ_TYPE_URL";
	
	/** primary key field of objTypeId */
	@FieldMapping(columnName = "OBJ_TYPE_ID", columnType = 12, primary = true)
	private String objTypeId;
	@FieldMapping(columnName = "OBJ_TYPE_CHECK_RULE", columnType = 12)
	private String objTypeCheckRule;
	@FieldMapping(columnName = "OBJ_TYPE_CODE", columnType = 12)
	private String objTypeCode;
	@FieldMapping(columnName = "OBJ_TYPE_CREATE_TIME", columnType = 93)
	private Date objTypeCreateTime;
	@FieldMapping(columnName = "OBJ_TYPE_DESC", columnType = 12)
	private String objTypeDesc;
	@FieldMapping(columnName = "OBJ_TYPE_FIELD1", columnType = 12)
	private String objTypeField1;
	@FieldMapping(columnName = "OBJ_TYPE_FIELD2", columnType = 12)
	private String objTypeField2;
	@FieldMapping(columnName = "OBJ_TYPE_NAME", columnType = 12)
	private String objTypeName;
	@FieldMapping(columnName = "OBJ_TYPE_PARENT_ID", columnType = 12)
	private String objTypeParentId;
	@FieldMapping(columnName = "OBJ_TYPE_STATUS", columnType = 2)
	private Integer objTypeStatus;
	@FieldMapping(columnName = "OBJ_TYPE_STATUS_DESC", columnType = 12)
	private String objTypeStatusDesc;
	@FieldMapping(columnName = "OBJ_TYPE_TABLE_NAME", columnType = 12)
	private String objTypeTableName;
	@FieldMapping(columnName = "OBJ_TYPE_URL", columnType = 12)
	private String objTypeUrl;
	
	public PpnRentObjType() {
		super();
	}

	public PpnRentObjType(String objTypeId) {
		this.objTypeId = objTypeId;
	}

	public PpnRentObjType(String objTypeCode, String objTypeName, Integer objTypeStatus, String objTypeUrl) {
		this.objTypeCode = objTypeCode;
		this.objTypeName = objTypeName;
		this.objTypeStatus = objTypeStatus;
		this.objTypeUrl = objTypeUrl;
	}

	/**
	 * @return the objTypeCheckRule
	 */
	public String getObjTypeCheckRule() {
		return this.objTypeCheckRule;
	}
	
	/**
	 * @param objTypeCheckRule the objTypeCheckRule to set
	 */
	public void setObjTypeCheckRule(String value) {
		this.objTypeCheckRule = value;
	}

	/**
	 * @return the objTypeCode
	 */
	public String getObjTypeCode() {
		return this.objTypeCode;
	}
	
	/**
	 * @param objTypeCode the objTypeCode to set
	 */
	public void setObjTypeCode(String value) {
		this.objTypeCode = value;
	}

	/**
	 * @return the objTypeCreateTime
	 */
	public Date getObjTypeCreateTime() {
		return this.objTypeCreateTime;
	}
	
	/**
	 * @param objTypeCreateTime the objTypeCreateTime to set
	 */
	public void setObjTypeCreateTime(Date value) {
		this.objTypeCreateTime = value;
	}

	/**
	 * @return the objTypeDesc
	 */
	public String getObjTypeDesc() {
		return this.objTypeDesc;
	}
	
	/**
	 * @param objTypeDesc the objTypeDesc to set
	 */
	public void setObjTypeDesc(String value) {
		this.objTypeDesc = value;
	}

	/**
	 * @return the objTypeField1
	 */
	public String getObjTypeField1() {
		return this.objTypeField1;
	}
	
	/**
	 * @param objTypeField1 the objTypeField1 to set
	 */
	public void setObjTypeField1(String value) {
		this.objTypeField1 = value;
	}

	/**
	 * @return the objTypeField2
	 */
	public String getObjTypeField2() {
		return this.objTypeField2;
	}
	
	/**
	 * @param objTypeField2 the objTypeField2 to set
	 */
	public void setObjTypeField2(String value) {
		this.objTypeField2 = value;
	}

	/**
	 * @return the objTypeId
	 */
	public String getObjTypeId() {
		return this.objTypeId;
	}
	
	/**
	 * @param objTypeId the objTypeId to set
	 */
	public void setObjTypeId(String value) {
		this.objTypeId = value;
	}

	/**
	 * @return the objTypeName
	 */
	public String getObjTypeName() {
		return this.objTypeName;
	}
	
	/**
	 * @param objTypeName the objTypeName to set
	 */
	public void setObjTypeName(String value) {
		this.objTypeName = value;
	}

	/**
	 * @return the objTypeParentId
	 */
	public String getObjTypeParentId() {
		return this.objTypeParentId;
	}
	
	/**
	 * @param objTypeParentId the objTypeParentId to set
	 */
	public void setObjTypeParentId(String value) {
		this.objTypeParentId = value;
	}

	/**
	 * @return the objTypeStatus
	 */
	public Integer getObjTypeStatus() {
		return this.objTypeStatus;
	}
	
	/**
	 * @param objTypeStatus the objTypeStatus to set
	 */
	public void setObjTypeStatus(Integer value) {
		this.objTypeStatus = value;
	}

	/**
	 * @return the objTypeStatusDesc
	 */
	public String getObjTypeStatusDesc() {
		return this.objTypeStatusDesc;
	}
	
	/**
	 * @param objTypeStatusDesc the objTypeStatusDesc to set
	 */
	public void setObjTypeStatusDesc(String value) {
		this.objTypeStatusDesc = value;
	}

	/**
	 * @return the objTypeTableName
	 */
	public String getObjTypeTableName() {
		return this.objTypeTableName;
	}
	
	/**
	 * @param objTypeTableName the objTypeTableName to set
	 */
	public void setObjTypeTableName(String value) {
		this.objTypeTableName = value;
	}

	/**
	 * @return the objTypeUrl
	 */
	public String getObjTypeUrl() {
		return this.objTypeUrl;
	}
	
	/**
	 * @param objTypeUrl the objTypeUrl to set
	 */
	public void setObjTypeUrl(String value) {
		this.objTypeUrl = value;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnRentObjType)) {
			return false;
		}
		PpnRentObjType other = (PpnRentObjType)o;
		if (null == this.objTypeId) {
			if (other.objTypeId != null)
				return false;
		} else if (!this.objTypeId.equals(other.objTypeId))
			return false;
		return true;
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((objTypeId == null) ? 0 : objTypeId.hashCode());
		return result;
	}
	
}