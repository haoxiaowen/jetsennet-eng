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
 * 文件：jetsennet.jue2.beans.PpnDevCtrl.java
 * 日 期：Mon Sep 12 14:01:59 CST 2016
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
@ClassMapping(tableName = "PPN_DEV_CTRL", keyGenerator = "uuid")
public class PpnDevCtrl implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_CTRL_EXPIRE_TIME = "CTRL_EXPIRE_TIME";
	public static String PROP_CTRL_MODE = "CTRL_MODE";
	public static String PROP_CTRL_USER_NAME = "CTRL_USER_NAME";
	public static String PROP_CTRL_USER_PWD = "CTRL_USER_PWD";
	public static String PROP_DEV_ID = "DEV_ID";
	
	/**
	 * primary key field of devId
	 * foreign key field of PPN_DEV_DEVICE.DEV_ID
	 */
	@FieldMapping(columnName = "DEV_ID", columnType = 12, primary = true)
	private String devId;
	@FieldMapping(columnName = "CTRL_EXPIRE_TIME", columnType = 12)
	private String ctrlExpireTime;
	@FieldMapping(columnName = "CTRL_MODE", columnType = 12)
	private String ctrlMode;
	@FieldMapping(columnName = "CTRL_USER_NAME", columnType = 12)
	private String ctrlUserName;
	@FieldMapping(columnName = "CTRL_USER_PWD", columnType = 12)
	private String ctrlUserPwd;
	
	public PpnDevCtrl() {
		super();
	}

	public PpnDevCtrl(String devId) {
		this.devId = devId;
	}

	public PpnDevCtrl(String ctrlExpireTime, String ctrlUserName, String ctrlUserPwd) {
		this.ctrlExpireTime = ctrlExpireTime;
		this.ctrlUserName = ctrlUserName;
		this.ctrlUserPwd = ctrlUserPwd;
	}

	/**
	 * @return the ctrlExpireTime
	 */
	public String getCtrlExpireTime() {
		return this.ctrlExpireTime;
	}
	
	/**
	 * @param ctrlExpireTime the ctrlExpireTime to set
	 */
	public void setCtrlExpireTime(String value) {
		this.ctrlExpireTime = value;
	}

	/**
	 * @return the ctrlMode
	 */
	public String getCtrlMode() {
		return this.ctrlMode;
	}
	
	/**
	 * @param ctrlMode the ctrlMode to set
	 */
	public void setCtrlMode(String value) {
		this.ctrlMode = value;
	}

	/**
	 * @return the ctrlUserName
	 */
	public String getCtrlUserName() {
		return this.ctrlUserName;
	}
	
	/**
	 * @param ctrlUserName the ctrlUserName to set
	 */
	public void setCtrlUserName(String value) {
		this.ctrlUserName = value;
	}

	/**
	 * @return the ctrlUserPwd
	 */
	public String getCtrlUserPwd() {
		return this.ctrlUserPwd;
	}
	
	/**
	 * @param ctrlUserPwd the ctrlUserPwd to set
	 */
	public void setCtrlUserPwd(String value) {
		this.ctrlUserPwd = value;
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

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnDevCtrl)) {
			return false;
		}
		PpnDevCtrl other = (PpnDevCtrl)o;
		if (null == this.devId) {
			if (other.devId != null)
				return false;
		} else if (!this.devId.equals(other.devId))
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
		result = prime * result + ((devId == null) ? 0 : devId.hashCode());
		return result;
	}
	
}