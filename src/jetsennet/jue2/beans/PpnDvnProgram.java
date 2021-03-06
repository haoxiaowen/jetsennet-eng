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
 * 文件：jetsennet.jue2.beans.PpnDvnProgram.java
 * 日 期：Thu Sep 08 16:03:12 CST 2016
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
@ClassMapping(tableName = "PPN_DVN_PROGRAM", keyGenerator = "uuid")
public class PpnDvnProgram implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_AFD = "AFD";
	public static String PROP_AUDIOLANGCODE = "AUDIOLANGCODE";
	public static String PROP_AUDIOLANGNAME = "AUDIOLANGNAME";
	public static String PROP_BREAKPOINT_SUM = "BREAKPOINT_SUM";
	public static String PROP_COLUMN_ID = "COLUMN_ID";
	public static String PROP_COLUMN_NAME = "COLUMN_NAME";
	public static String PROP_CREATE_TIME = "CREATE_TIME";
	public static String PROP_CREATE_USER = "CREATE_USER";
	public static String PROP_CREATE_USERID = "CREATE_USERID";
	public static String PROP_DIRECTOR_ID = "DIRECTOR_ID";
	public static String PROP_DIRECTOR_LOGINNAME = "DIRECTOR_LOGINNAME";
	public static String PROP_DIRECTOR_NAME = "DIRECTOR_NAME";
	public static String PROP_DURATION = "DURATION";
	public static String PROP_EDIT_FORMAT = "EDIT_FORMAT";
	public static String PROP_FLOW_TYPE = "FLOW_TYPE";
	public static String PROP_INTERPLAYWS = "INTERPLAYWS";
	public static String PROP_OID = "OID";
	public static String PROP_OS = "OS";
	public static String PROP_PGM_ABBRNAME = "PGM_ABBRNAME";
	public static String PROP_PGM_CODE = "PGM_CODE";
	public static String PROP_PGM_DISKPATH = "PGM_DISKPATH";
	public static String PROP_PGM_ID = "PGM_ID";
	public static String PROP_PGM_NAME = "PGM_NAME";
	public static String PROP_PGM_PATH = "PGM_PATH";
	public static String PROP_PGM_SOURCE = "PGM_SOURCE";
	public static String PROP_PGM_STATE = "PGM_STATE";
	public static String PROP_PGM_TYPE = "PGM_TYPE";
	public static String PROP_PLAN_TIME = "PLAN_TIME";
	public static String PROP_SEG_SUM = "SEG_SUM";
	public static String PROP_SUBTITLELANGCODE = "SUBTITLELANGCODE";
	public static String PROP_SUBTITLELANGNAME = "SUBTITLELANGNAME";
	public static String PROP_TASK_ID = "TASK_ID";
	public static String PROP_WORK_SPACE = "WORK_SPACE";
	
	@FieldMapping(columnName = "AFD", columnType = 12)
	private String afd="1";
	@FieldMapping(columnName = "AUDIOLANGCODE", columnType = 12)
	private String audiolangcode="1";
	@FieldMapping(columnName = "AUDIOLANGNAME", columnType = 12)
	private String audiolangname="1";
	@FieldMapping(columnName = "BREAKPOINT_SUM", columnType = 12)
	private String breakpointSum="1";
	@FieldMapping(columnName = "COLUMN_ID", columnType = 12)
	private String columnId="1";
	@FieldMapping(columnName = "COLUMN_NAME", columnType = 12)
	private String columnName="1";
	@FieldMapping(columnName = "CREATE_TIME", columnType = 93)
	private Date createTime=new Date();
	@FieldMapping(columnName = "CREATE_USER", columnType = 12)
	private String createUser="1";
	@FieldMapping(columnName = "CREATE_USERID", columnType = 12)
	private String createUserid="1";
	@FieldMapping(columnName = "DIRECTOR_ID", columnType = 12)
	private String directorId="1";
	@FieldMapping(columnName = "DIRECTOR_LOGINNAME", columnType = 12)
	private String directorLoginname="1";
	@FieldMapping(columnName = "DIRECTOR_NAME", columnType = 12)
	private String directorName="1";
	@FieldMapping(columnName = "DURATION", columnType = 12)
	private String duration;
	@FieldMapping(columnName = "EDIT_FORMAT", columnType = 12)
	private String editFormat;
	@FieldMapping(columnName = "FLOW_TYPE", columnType = 12)
	private String flowType;
	@FieldMapping(columnName = "INTERPLAYWS", columnType = 12)
	private String interplayws;
	@FieldMapping(columnName = "OID", columnType = 12)
	private String oid;
	@FieldMapping(columnName = "OS", columnType = 12)
	private String os;
	@FieldMapping(columnName = "PGM_ABBRNAME", columnType = 12)
	private String pgmAbbrname;
	@FieldMapping(columnName = "PGM_CODE", columnType = 12)
	private String pgmCode;
	@FieldMapping(columnName = "PGM_DISKPATH", columnType = 12)
	private String pgmDiskpath;
	@FieldMapping(columnName = "PGM_ID", columnType = 12)
	private String pgmId;
	@FieldMapping(columnName = "PGM_NAME", columnType = 12)
	private String pgmName;
	@FieldMapping(columnName = "PGM_PATH", columnType = 12)
	private String pgmPath;
	@FieldMapping(columnName = "PGM_SOURCE", columnType = 12)
	private String pgmSource;
	@FieldMapping(columnName = "PGM_STATE", columnType = 12)
	private String pgmState;
	@FieldMapping(columnName = "PGM_TYPE", columnType = 12)
	private String pgmType;
	@FieldMapping(columnName = "PLAN_TIME", columnType = 93)
	private Date planTime;
	@FieldMapping(columnName = "SEG_SUM", columnType = 12)
	private String segSum="1";
	@FieldMapping(columnName = "SUBTITLELANGCODE", columnType = 12)
	private String subtitlelangcode="1";
	@FieldMapping(columnName = "SUBTITLELANGNAME", columnType = 12)
	private String subtitlelangname="1";
	@FieldMapping(columnName = "TASK_ID", columnType = 12)
	private String taskId;
	@FieldMapping(columnName = "WORK_SPACE", columnType = 12)
	private String workSpace;
	
	public PpnDvnProgram() {
		super();
	}

	public PpnDvnProgram(String afd, String audiolangcode, String audiolangname, String breakpointSum, String columnId, String columnName, Date createTime, String directorId, String directorLoginname, String directorName, String duration, String pgmCode, String pgmDiskpath, String pgmId, String pgmName, Date planTime, String segSum, String subtitlelangcode, String subtitlelangname) {
		this.afd = afd;
		this.audiolangcode = audiolangcode;
		this.audiolangname = audiolangname;
		this.breakpointSum = breakpointSum;
		this.columnId = columnId;
		this.columnName = columnName;
		this.createTime = createTime;
		this.directorId = directorId;
		this.directorLoginname = directorLoginname;
		this.directorName = directorName;
		this.duration = duration;
		this.pgmCode = pgmCode;
		this.pgmDiskpath = pgmDiskpath;
		this.pgmId = pgmId;
		this.pgmName = pgmName;
		this.planTime = planTime;
		this.segSum = segSum;
		this.subtitlelangcode = subtitlelangcode;
		this.subtitlelangname = subtitlelangname;
	}

	/**
	 * @return the afd
	 */
	public String getAfd() {
		return this.afd;
	}
	
	/**
	 * @param afd the afd to set
	 */
	public void setAfd(String value) {
		this.afd = value;
	}

	/**
	 * @return the audiolangcode
	 */
	public String getAudiolangcode() {
		return this.audiolangcode;
	}
	
	/**
	 * @param audiolangcode the audiolangcode to set
	 */
	public void setAudiolangcode(String value) {
		this.audiolangcode = value;
	}

	/**
	 * @return the audiolangname
	 */
	public String getAudiolangname() {
		return this.audiolangname;
	}
	
	/**
	 * @param audiolangname the audiolangname to set
	 */
	public void setAudiolangname(String value) {
		this.audiolangname = value;
	}

	/**
	 * @return the breakpointSum
	 */
	public String getBreakpointSum() {
		return this.breakpointSum;
	}
	
	/**
	 * @param breakpointSum the breakpointSum to set
	 */
	public void setBreakpointSum(String value) {
		this.breakpointSum = value;
	}

	/**
	 * @return the columnId
	 */
	public String getColumnId() {
		return this.columnId;
	}
	
	/**
	 * @param columnId the columnId to set
	 */
	public void setColumnId(String value) {
		this.columnId = value;
	}

	/**
	 * @return the columnName
	 */
	public String getColumnName() {
		return this.columnName;
	}
	
	/**
	 * @param columnName the columnName to set
	 */
	public void setColumnName(String value) {
		this.columnName = value;
	}

	/**
	 * @return the createTime
	 */
	public Date getCreateTime() {
		return this.createTime;
	}
	
	/**
	 * @param createTime the createTime to set
	 */
	public void setCreateTime(Date value) {
		this.createTime = value;
	}

	/**
	 * @return the createUser
	 */
	public String getCreateUser() {
		return this.createUser;
	}
	
	/**
	 * @param createUser the createUser to set
	 */
	public void setCreateUser(String value) {
		this.createUser = value;
	}

	/**
	 * @return the createUserid
	 */
	public String getCreateUserid() {
		return this.createUserid;
	}
	
	/**
	 * @param createUserid the createUserid to set
	 */
	public void setCreateUserid(String value) {
		this.createUserid = value;
	}

	/**
	 * @return the directorId
	 */
	public String getDirectorId() {
		return this.directorId;
	}
	
	/**
	 * @param directorId the directorId to set
	 */
	public void setDirectorId(String value) {
		this.directorId = value;
	}

	/**
	 * @return the directorLoginname
	 */
	public String getDirectorLoginname() {
		return this.directorLoginname;
	}
	
	/**
	 * @param directorLoginname the directorLoginname to set
	 */
	public void setDirectorLoginname(String value) {
		this.directorLoginname = value;
	}

	/**
	 * @return the directorName
	 */
	public String getDirectorName() {
		return this.directorName;
	}
	
	/**
	 * @param directorName the directorName to set
	 */
	public void setDirectorName(String value) {
		this.directorName = value;
	}

	/**
	 * @return the duration
	 */
	public String getDuration() {
		return this.duration;
	}
	
	/**
	 * @param duration the duration to set
	 */
	public void setDuration(String value) {
		this.duration = value;
	}

	/**
	 * @return the editFormat
	 */
	public String getEditFormat() {
		return this.editFormat;
	}
	
	/**
	 * @param editFormat the editFormat to set
	 */
	public void setEditFormat(String value) {
		this.editFormat = value;
	}

	/**
	 * @return the flowType
	 */
	public String getFlowType() {
		return this.flowType;
	}
	
	/**
	 * @param flowType the flowType to set
	 */
	public void setFlowType(String value) {
		this.flowType = value;
	}

	/**
	 * @return the interplayws
	 */
	public String getInterplayws() {
		return this.interplayws;
	}
	
	/**
	 * @param interplayws the interplayws to set
	 */
	public void setInterplayws(String value) {
		this.interplayws = value;
	}

	/**
	 * @return the oid
	 */
	public String getOid() {
		return this.oid;
	}
	
	/**
	 * @param oid the oid to set
	 */
	public void setOid(String value) {
		this.oid = value;
	}

	/**
	 * @return the os
	 */
	public String getOs() {
		return this.os;
	}
	
	/**
	 * @param os the os to set
	 */
	public void setOs(String value) {
		this.os = value;
	}

	/**
	 * @return the pgmAbbrname
	 */
	public String getPgmAbbrname() {
		return this.pgmAbbrname;
	}
	
	/**
	 * @param pgmAbbrname the pgmAbbrname to set
	 */
	public void setPgmAbbrname(String value) {
		this.pgmAbbrname = value;
	}

	/**
	 * @return the pgmCode
	 */
	public String getPgmCode() {
		return this.pgmCode;
	}
	
	/**
	 * @param pgmCode the pgmCode to set
	 */
	public void setPgmCode(String value) {
		this.pgmCode = value;
	}

	/**
	 * @return the pgmDiskpath
	 */
	public String getPgmDiskpath() {
		return this.pgmDiskpath;
	}
	
	/**
	 * @param pgmDiskpath the pgmDiskpath to set
	 */
	public void setPgmDiskpath(String value) {
		this.pgmDiskpath = value;
	}

	/**
	 * @return the pgmId
	 */
	public String getPgmId() {
		return this.pgmId;
	}
	
	/**
	 * @param pgmId the pgmId to set
	 */
	public void setPgmId(String value) {
		this.pgmId = value;
	}

	/**
	 * @return the pgmName
	 */
	public String getPgmName() {
		return this.pgmName;
	}
	
	/**
	 * @param pgmName the pgmName to set
	 */
	public void setPgmName(String value) {
		this.pgmName = value;
	}

	/**
	 * @return the pgmPath
	 */
	public String getPgmPath() {
		return this.pgmPath;
	}
	
	/**
	 * @param pgmPath the pgmPath to set
	 */
	public void setPgmPath(String value) {
		this.pgmPath = value;
	}

	/**
	 * @return the pgmSource
	 */
	public String getPgmSource() {
		return this.pgmSource;
	}
	
	/**
	 * @param pgmSource the pgmSource to set
	 */
	public void setPgmSource(String value) {
		this.pgmSource = value;
	}

	/**
	 * @return the pgmState
	 */
	public String getPgmState() {
		return this.pgmState;
	}
	
	/**
	 * @param pgmState the pgmState to set
	 */
	public void setPgmState(String value) {
		this.pgmState = value;
	}

	/**
	 * @return the pgmType
	 */
	public String getPgmType() {
		return this.pgmType;
	}
	
	/**
	 * @param pgmType the pgmType to set
	 */
	public void setPgmType(String value) {
		this.pgmType = value;
	}

	/**
	 * @return the planTime
	 */
	public Date getPlanTime() {
		return this.planTime;
	}
	
	/**
	 * @param planTime the planTime to set
	 */
	public void setPlanTime(Date value) {
		this.planTime = value;
	}

	/**
	 * @return the segSum
	 */
	public String getSegSum() {
		return this.segSum;
	}
	
	/**
	 * @param segSum the segSum to set
	 */
	public void setSegSum(String value) {
		this.segSum = value;
	}

	/**
	 * @return the subtitlelangcode
	 */
	public String getSubtitlelangcode() {
		return this.subtitlelangcode;
	}
	
	/**
	 * @param subtitlelangcode the subtitlelangcode to set
	 */
	public void setSubtitlelangcode(String value) {
		this.subtitlelangcode = value;
	}

	/**
	 * @return the subtitlelangname
	 */
	public String getSubtitlelangname() {
		return this.subtitlelangname;
	}
	
	/**
	 * @param subtitlelangname the subtitlelangname to set
	 */
	public void setSubtitlelangname(String value) {
		this.subtitlelangname = value;
	}

	/**
	 * @return the taskId
	 */
	public String getTaskId() {
		return this.taskId;
	}
	
	/**
	 * @param taskId the taskId to set
	 */
	public void setTaskId(String value) {
		this.taskId = value;
	}

	/**
	 * @return the workSpace
	 */
	public String getWorkSpace() {
		return this.workSpace;
	}
	
	/**
	 * @param workSpace the workSpace to set
	 */
	public void setWorkSpace(String value) {
		this.workSpace = value;
	}

	
}