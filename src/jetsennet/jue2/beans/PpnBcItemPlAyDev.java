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
 * 文件：jetsennet.jue2.bean.PpnBcItemPlAyDev.java
 * 日 期：Fri Jul 22 14:22:04 CST 2016
 */
package jetsennet.jue2.beans;

import java.io.Serializable;
import org.uorm.orm.annotation.ClassMapping;
import org.uorm.orm.annotation.FieldMapping;

/**
 *
 * this file is generated by the uorm pojo tools.
 *
 * @author <a href="mailto:xunchangguo@gmail.com">郭训常</a>
 * @version 1.0.0
 */
@ClassMapping(tableName = "PPN_BC_ITEM_PlAY_DEV", keyGenerator = "uuid")
public class PpnBcItemPlAyDev implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_AUDIO_DEV_CODE = "AUDIO_DEV_CODE";
	public static String PROP_BAK_DEV_CODE = "BAK_DEV_CODE";
	public static String PROP_BAK_DEV_NAME = "BAK_DEV_NAME";
	public static String PROP_BAK_DEV_TYPE_CODE = "BAK_DEV_TYPE_CODE";
	public static String PROP_BAK_DEV_TYPE_NAME = "BAK_DEV_TYPE_NAME";
	public static String PROP_DEV_CODE = "DEV_CODE";
	public static String PROP_DEV_FIELD1 = "DEV_FIELD1";
	public static String PROP_DEV_FIELD2 = "DEV_FIELD2";
	public static String PROP_DEV_ID = "DEV_ID";
	public static String PROP_DEV_NAME = "DEV_NAME";
	public static String PROP_DEV_TYPE_CODE = "DEV_TYPE_CODE";
	public static String PROP_DEV_TYPE_NAME = "DEV_TYPE_NAME";
	
	@FieldMapping(columnName = "AUDIO_DEV_CODE", columnType = 12)
	private String audioDevCode;
	@FieldMapping(columnName = "BAK_DEV_CODE", columnType = 12)
	private String bakDevCode;
	@FieldMapping(columnName = "BAK_DEV_NAME", columnType = 12)
	private String bakDevName;
	@FieldMapping(columnName = "BAK_DEV_TYPE_CODE", columnType = 2)
	private Integer bakDevTypeCode;
	@FieldMapping(columnName = "BAK_DEV_TYPE_NAME", columnType = 12)
	private String bakDevTypeName;
	@FieldMapping(columnName = "DEV_CODE", columnType = 12)
	private String devCode;
	@FieldMapping(columnName = "DEV_FIELD1", columnType = 12)
	private String devField1;
	@FieldMapping(columnName = "DEV_FIELD2", columnType = 12)
	private String devField2;
	@FieldMapping(columnName = "DEV_ID", columnType = 12,primary = true)
	private String devId;
	@FieldMapping(columnName = "DEV_NAME", columnType = 12)
	private String devName;
	@FieldMapping(columnName = "DEV_TYPE_CODE", columnType = 2)
	private Integer devTypeCode;
	@FieldMapping(columnName = "DEV_TYPE_NAME", columnType = 12)
	private String devTypeName;
	
	public PpnBcItemPlAyDev() {
		super();
	}

	public PpnBcItemPlAyDev(String devCode, String devId, Integer devTypeCode, String devTypeName) {
		this.devCode = devCode;
		this.devTypeCode = devTypeCode;
		this.devTypeName = devTypeName;
	}

	/**
	 * @return the audioDevCode
	 */
	public String getAudioDevCode() {
		return this.audioDevCode;
	}
	
	/**
	 * @param audioDevCode the audioDevCode to set
	 */
	public void setAudioDevCode(String value) {
		this.audioDevCode = value;
	}

	/**
	 * @return the bakDevCode
	 */
	public String getBakDevCode() {
		return this.bakDevCode;
	}
	
	/**
	 * @param bakDevCode the bakDevCode to set
	 */
	public void setBakDevCode(String value) {
		this.bakDevCode = value;
	}

	/**
	 * @return the bakDevName
	 */
	public String getBakDevName() {
		return this.bakDevName;
	}
	
	/**
	 * @param bakDevName the bakDevName to set
	 */
	public void setBakDevName(String value) {
		this.bakDevName = value;
	}

	/**
	 * @return the bakDevTypeCode
	 */
	public Integer getBakDevTypeCode() {
		return this.bakDevTypeCode;
	}
	
	/**
	 * @param bakDevTypeCode the bakDevTypeCode to set
	 */
	public void setBakDevTypeCode(Integer value) {
		this.bakDevTypeCode = value;
	}

	/**
	 * @return the bakDevTypeName
	 */
	public String getBakDevTypeName() {
		return this.bakDevTypeName;
	}
	
	/**
	 * @param bakDevTypeName the bakDevTypeName to set
	 */
	public void setBakDevTypeName(String value) {
		this.bakDevTypeName = value;
	}

	/**
	 * @return the devCode
	 */
	public String getDevCode() {
		return this.devCode;
	}
	
	/**
	 * @param devCode the devCode to set
	 */
	public void setDevCode(String value) {
		this.devCode = value;
	}

	/**
	 * @return the devField1
	 */
	public String getDevField1() {
		return this.devField1;
	}
	
	/**
	 * @param devField1 the devField1 to set
	 */
	public void setDevField1(String value) {
		this.devField1 = value;
	}

	/**
	 * @return the devField2
	 */
	public String getDevField2() {
		return this.devField2;
	}
	
	/**
	 * @param devField2 the devField2 to set
	 */
	public void setDevField2(String value) {
		this.devField2 = value;
	}

	/**
	 * @return the devId
	 */
	public String getDevId() {
		return this.devId;
	}
	
	/**
	 * @param devId the devId to set
	 */
	public void setDevId(String value) {
		this.devId = value;
	}

	/**
	 * @return the devName
	 */
	public String getDevName() {
		return this.devName;
	}
	
	/**
	 * @param devName the devName to set
	 */
	public void setDevName(String value) {
		this.devName = value;
	}

	/**
	 * @return the devTypeCode
	 */
	public Integer getDevTypeCode() {
		return this.devTypeCode;
	}
	
	/**
	 * @param devTypeCode the devTypeCode to set
	 */
	public void setDevTypeCode(Integer value) {
		this.devTypeCode = value;
	}

	/**
	 * @return the devTypeName
	 */
	public String getDevTypeName() {
		return this.devTypeName;
	}
	
	/**
	 * @param devTypeName the devTypeName to set
	 */
	public void setDevTypeName(String value) {
		this.devTypeName = value;
	}

	
}