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
 * 文件：jetsennet.jue2.beans.PpnRm2Resource.java
 * 日 期：Tue Nov 08 14:51:40 CST 2016
 */
package jetsennet.jue2.beans;

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
@ClassMapping(tableName = "PPN_RM2_RESOURCE", keyGenerator = "uuid")
public class PpnRm2Resource implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_RES_AMOUNT = "RES_AMOUNT";
	public static String PROP_RES_CLASS = "RES_CLASS";
	public static String PROP_RES_CODE = "RES_CODE";
	public static String PROP_RES_CREATE_TIME = "RES_CREATE_TIME";
	public static String PROP_RES_DESC = "RES_DESC";
	public static String PROP_RES_FIELD1 = "RES_FIELD1";
	public static String PROP_RES_FIELD2 = "RES_FIELD2";
	public static String PROP_RES_ID = "RES_ID";
	public static String PROP_RES_LOCATION = "RES_LOCATION";
	public static String PROP_RES_NAME = "RES_NAME";
	public static String PROP_RES_STATUS = "RES_STATUS";
	public static String PROP_RES_UPDATE_TIIME = "RES_UPDATE_TIIME";
	
	/** primary key field of resId */
	@FieldMapping(columnName = "RES_ID", columnType = 12, primary = true)
	private String resId;
	@FieldMapping(columnName = "RES_AMOUNT", columnType = 2)
	private Integer resAmount;
	@FieldMapping(columnName = "RES_CLASS", columnType = 2)
	private Integer resClass;
	@FieldMapping(columnName = "RES_CODE", columnType = 12)
	private String resCode;
	@FieldMapping(columnName = "RES_CREATE_TIME", columnType = 93)
	private Date resCreateTime;
	@FieldMapping(columnName = "RES_DESC", columnType = 12)
	private String resDesc;
	@FieldMapping(columnName = "RES_FIELD1", columnType = 12)
	private String resField1;
	@FieldMapping(columnName = "RES_FIELD2", columnType = 12)
	private String resField2;
	@FieldMapping(columnName = "RES_LOCATION", columnType = 12)
	private String resLocation;
	@FieldMapping(columnName = "RES_NAME", columnType = 12)
	private String resName;
	@FieldMapping(columnName = "RES_STATUS", columnType = 2)
	private Integer resStatus;
	@FieldMapping(columnName = "RES_UPDATE_TIIME", columnType = 93)
	private Date resUpdateTiime;
	
	public PpnRm2Resource() {
		super();
	}

	public PpnRm2Resource(String resId) {
		this.resId = resId;
	}

	public PpnRm2Resource(String resCode, String resName, Integer resStatus) {
		this.resCode = resCode;
		this.resName = resName;
		this.resStatus = resStatus;
	}

	/**
	 * @return the resAmount
	 */
	public Integer getResAmount() {
		return this.resAmount;
	}
	
	/**
	 * @param resAmount the resAmount to set
	 */
	public void setResAmount(Integer value) {
		this.resAmount = value;
	}

	/**
	 * @return the resClass
	 */
	public Integer getResClass() {
		return this.resClass;
	}
	
	/**
	 * @param resClass the resClass to set
	 */
	public void setResClass(Integer value) {
		this.resClass = value;
	}

	/**
	 * @return the resCode
	 */
	public String getResCode() {
		return this.resCode;
	}
	
	/**
	 * @param resCode the resCode to set
	 */
	public void setResCode(String value) {
		this.resCode = value;
	}

	/**
	 * @return the resCreateTime
	 */
	public Date getResCreateTime() {
		return this.resCreateTime;
	}
	
	/**
	 * @param resCreateTime the resCreateTime to set
	 */
	public void setResCreateTime(Date value) {
		this.resCreateTime = value;
	}

	/**
	 * @return the resDesc
	 */
	public String getResDesc() {
		return this.resDesc;
	}
	
	/**
	 * @param resDesc the resDesc to set
	 */
	public void setResDesc(String value) {
		this.resDesc = value;
	}

	/**
	 * @return the resField1
	 */
	public String getResField1() {
		return this.resField1;
	}
	
	/**
	 * @param resField1 the resField1 to set
	 */
	public void setResField1(String value) {
		this.resField1 = value;
	}

	/**
	 * @return the resField2
	 */
	public String getResField2() {
		return this.resField2;
	}
	
	/**
	 * @param resField2 the resField2 to set
	 */
	public void setResField2(String value) {
		this.resField2 = value;
	}

	/**
	 * @return the resId
	 */
	public String getResId() {
		return this.resId;
	}
	
	/**
	 * @param resId the resId to set
	 */
	public void setResId(String value) {
		this.resId = value;
	}

	/**
	 * @return the resLocation
	 */
	public String getResLocation() {
		return this.resLocation;
	}
	
	/**
	 * @param resLocation the resLocation to set
	 */
	public void setResLocation(String value) {
		this.resLocation = value;
	}

	/**
	 * @return the resName
	 */
	public String getResName() {
		return this.resName;
	}
	
	/**
	 * @param resName the resName to set
	 */
	public void setResName(String value) {
		this.resName = value;
	}

	/**
	 * @return the resStatus
	 */
	public Integer getResStatus() {
		return this.resStatus;
	}
	
	/**
	 * @param resStatus the resStatus to set
	 */
	public void setResStatus(Integer value) {
		this.resStatus = value;
	}

	/**
	 * @return the resUpdateTiime
	 */
	public Date getResUpdateTiime() {
		return this.resUpdateTiime;
	}
	
	/**
	 * @param resUpdateTiime the resUpdateTiime to set
	 */
	public void setResUpdateTiime(Date value) {
		this.resUpdateTiime = value;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnRm2Resource)) {
			return false;
		}
		PpnRm2Resource other = (PpnRm2Resource)o;
		if (null == this.resId) {
			if (other.resId != null)
				return false;
		} else if (!this.resId.equals(other.resId))
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
		result = prime * result + ((resId == null) ? 0 : resId.hashCode());
		return result;
	}
	
}