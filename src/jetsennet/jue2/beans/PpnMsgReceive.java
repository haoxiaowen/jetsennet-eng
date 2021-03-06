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
 * 文件：jetsennet.jue2.beans.PpnMsgReceive.java
 * 日 期：Wed Oct 26 16:57:59 CST 2016
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
@ClassMapping(tableName = "PPN_MSG_RECEIVE", keyGenerator = "uuid")
public class PpnMsgReceive implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_MSG_ID = "MSG_ID";
	public static String PROP_REC_FIELD1 = "REC_FIELD1";
	public static String PROP_REC_FIELD2 = "REC_FIELD2";
	public static String PROP_REC_ID = "REC_ID";
	public static String PROP_REC_READ = "REC_READ";
	public static String PROP_REC_READ_TIME = "REC_READ_TIME";
	public static String PROP_REC_STATUS = "REC_STATUS";
	public static String PROP_REC_STICK = "REC_STICK";
	public static String PROP_REC_STICK_TIME = "REC_STICK_TIME";
	public static String PROP_REC_TIME = "REC_TIME";
	public static String PROP_REC_USER = "REC_USER";
	
	/** primary key field of recId */
	@FieldMapping(columnName = "REC_ID", columnType = 12, primary = true)
	private String recId;
	/** foreign key field of PPN_MSG.MSG_ID */
	@FieldMapping(columnName = "MSG_ID", columnType = 12)
	private String msgId;
	@FieldMapping(columnName = "REC_FIELD1", columnType = 12)
	private String recField1;
	@FieldMapping(columnName = "REC_FIELD2", columnType = 12)
	private String recField2;
	@FieldMapping(columnName = "REC_READ", columnType = 2)
	private Integer recRead;
	@FieldMapping(columnName = "REC_READ_TIME", columnType = 93)
	private Date recReadTime;
	@FieldMapping(columnName = "REC_STATUS", columnType = 2)
	private Integer recStatus;
	@FieldMapping(columnName = "REC_STICK", columnType = 2)
	private Integer recStick;
	@FieldMapping(columnName = "REC_STICK_TIME", columnType = 93)
	private Date recStickTime;
	@FieldMapping(columnName = "REC_TIME", columnType = 93)
	private Date recTime;
	@FieldMapping(columnName = "REC_USER", columnType = 12)
	private String recUser;
	
	public PpnMsgReceive() {
		super();
	}

	public PpnMsgReceive(String recId) {
		this.recId = recId;
	}

	public PpnMsgReceive(Integer recRead, Integer recStatus, Date recTime, String recUser) {
		this.recRead = recRead;
		this.recStatus = recStatus;
		this.recTime = recTime;
		this.recUser = recUser;
	}

	/**
	 * @return the msgId
	 */
	public String getMsgId() {
		return this.msgId;
	}
	
	/**
	 * @param msgId the msgId to set
	 */
	public void setMsgId(String value) {
		this.msgId = value;
	}

	/**
	 * @return the recField1
	 */
	public String getRecField1() {
		return this.recField1;
	}
	
	/**
	 * @param recField1 the recField1 to set
	 */
	public void setRecField1(String value) {
		this.recField1 = value;
	}

	/**
	 * @return the recField2
	 */
	public String getRecField2() {
		return this.recField2;
	}
	
	/**
	 * @param recField2 the recField2 to set
	 */
	public void setRecField2(String value) {
		this.recField2 = value;
	}

	/**
	 * @return the recId
	 */
	public String getRecId() {
		return this.recId;
	}
	
	/**
	 * @param recId the recId to set
	 */
	public void setRecId(String value) {
		this.recId = value;
	}

	/**
	 * @return the recRead
	 */
	public Integer getRecRead() {
		return this.recRead;
	}
	
	/**
	 * @param recRead the recRead to set
	 */
	public void setRecRead(Integer value) {
		this.recRead = value;
	}

	/**
	 * @return the recReadTime
	 */
	public Date getRecReadTime() {
		return this.recReadTime;
	}
	
	/**
	 * @param recReadTime the recReadTime to set
	 */
	public void setRecReadTime(Date value) {
		this.recReadTime = value;
	}

	/**
	 * @return the recStatus
	 */
	public Integer getRecStatus() {
		return this.recStatus;
	}
	
	/**
	 * @param recStatus the recStatus to set
	 */
	public void setRecStatus(Integer value) {
		this.recStatus = value;
	}

	/**
	 * @return the recStick
	 */
	public Integer getRecStick() {
		return this.recStick;
	}
	
	/**
	 * @param recStick the recStick to set
	 */
	public void setRecStick(Integer value) {
		this.recStick = value;
	}

	/**
	 * @return the recStickTime
	 */
	public Date getRecStickTime() {
		return this.recStickTime;
	}
	
	/**
	 * @param recStickTime the recStickTime to set
	 */
	public void setRecStickTime(Date value) {
		this.recStickTime = value;
	}

	/**
	 * @return the recTime
	 */
	public Date getRecTime() {
		return this.recTime;
	}
	
	/**
	 * @param recTime the recTime to set
	 */
	public void setRecTime(Date value) {
		this.recTime = value;
	}

	/**
	 * @return the recUser
	 */
	public String getRecUser() {
		return this.recUser;
	}
	
	/**
	 * @param recUser the recUser to set
	 */
	public void setRecUser(String value) {
		this.recUser = value;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnMsgReceive)) {
			return false;
		}
		PpnMsgReceive other = (PpnMsgReceive)o;
		if (null == this.recId) {
			if (other.recId != null)
				return false;
		} else if (!this.recId.equals(other.recId))
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
		result = prime * result + ((recId == null) ? 0 : recId.hashCode());
		return result;
	}
	
}