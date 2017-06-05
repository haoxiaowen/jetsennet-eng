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
 * 文件：jetsennet.jue2.trm.bean.PpnStorUser.java
 * 日 期：Mon Aug 01 20:03:00 CST 2016
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
@ClassMapping(tableName = "PPN_STOR_USER", keyGenerator = "uuid")
public class PpnStorUser implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_USER_CREATE_TIME = "USER_CREATE_TIME";
	public static String PROP_USER_CREATE_USER = "USER_CREATE_USER";
	public static String PROP_USER_FIELD1 = "USER_FIELD1";
	public static String PROP_USER_ID = "USER_ID";
	public static String PROP_USER_LOGIN_NAME = "USER_LOGIN_NAME";
	public static String PROP_USER_LOGIN_PWD = "USER_LOGIN_PWD";
	public static String PROP_USER_SCOPE = "USER_SCOPE";
	public static String PROP_USER_UID = "USER_UID";
	
	/** primary key field of userId */
	@FieldMapping(columnName = "USER_ID", columnType = 12, primary = true)
	private String userId;
	@FieldMapping(columnName = "USER_CREATE_TIME", columnType = 93)
	private Date userCreateTime;
	@FieldMapping(columnName = "USER_CREATE_USER", columnType = 12)
	private String userCreateUser;
	@FieldMapping(columnName = "USER_FIELD1", columnType = 12)
	private String userField1;
	@FieldMapping(columnName = "USER_LOGIN_NAME", columnType = 12)
	private String userLoginName;
	@FieldMapping(columnName = "USER_LOGIN_PWD", columnType = 12)
	private String userLoginPwd;
	@FieldMapping(columnName = "USER_SCOPE", columnType = 12)
	private String userScope;
	@FieldMapping(columnName = "USER_UID", columnType = 12)
	private String userUid;
	
	public PpnStorUser() {
		super();
	}

	public PpnStorUser(String userId) {
		this.userId = userId;
	}

	/**
	 * @return the userCreateTime
	 */
	public Date getUserCreateTime() {
		return this.userCreateTime;
	}
	
	/**
	 * @param userCreateTime the userCreateTime to set
	 */
	public void setUserCreateTime(Date value) {
		this.userCreateTime = value;
	}

	/**
	 * @return the userCreateUser
	 */
	public String getUserCreateUser() {
		return this.userCreateUser;
	}
	
	/**
	 * @param userCreateUser the userCreateUser to set
	 */
	public void setUserCreateUser(String value) {
		this.userCreateUser = value;
	}

	/**
	 * @return the userField1
	 */
	public String getUserField1() {
		return this.userField1;
	}
	
	/**
	 * @param userField1 the userField1 to set
	 */
	public void setUserField1(String value) {
		this.userField1 = value;
	}

	/**
	 * @return the userId
	 */
	public String getUserId() {
		return this.userId;
	}
	
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String value) {
		this.userId = value;
	}

	/**
	 * @return the userLoginName
	 */
	public String getUserLoginName() {
		return this.userLoginName;
	}
	
	/**
	 * @param userLoginName the userLoginName to set
	 */
	public void setUserLoginName(String value) {
		this.userLoginName = value;
	}

	/**
	 * @return the userLoginPwd
	 */
	public String getUserLoginPwd() {
		return this.userLoginPwd;
	}
	
	/**
	 * @param userLoginPwd the userLoginPwd to set
	 */
	public void setUserLoginPwd(String value) {
		this.userLoginPwd = value;
	}

	/**
	 * @return the userScope
	 */
	public String getUserScope() {
		return this.userScope;
	}
	
	/**
	 * @param userScope the userScope to set
	 */
	public void setUserScope(String value) {
		this.userScope = value;
	}

	/**
	 * @return the userUid
	 */
	public String getUserUid() {
		return this.userUid;
	}
	
	/**
	 * @param userUid the userUid to set
	 */
	public void setUserUid(String value) {
		this.userUid = value;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnStorUser)) {
			return false;
		}
		PpnStorUser other = (PpnStorUser)o;
		if (null == this.userId) {
			if (other.userId != null)
				return false;
		} else if (!this.userId.equals(other.userId))
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
		result = prime * result + ((userId == null) ? 0 : userId.hashCode());
		return result;
	}
	
}