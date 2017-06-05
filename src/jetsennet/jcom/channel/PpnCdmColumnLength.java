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
 * 文件：jetsennet.ppn.trm.bean.PpnCdmColumnLength.java
 * 日 期：Thu Aug 04 19:27:31 CST 2016
 */
package jetsennet.jcom.channel;

import java.io.Serializable;
import org.uorm.orm.annotation.ClassMapping;
import org.uorm.orm.annotation.FieldMapping;


@ClassMapping(tableName = "PPN_CDM_COLUMN_LENGTH", keyGenerator = "uuid")
public class PpnCdmColumnLength implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_COL_BREAKPOINT_SUM = "COL_BREAKPOINT_SUM";
	public static String PROP_COL_ID = "COL_ID";
	public static String PROP_COL_LENGTH = "COL_LENGTH";
	public static String PROP_LEN_ID = "LEN_ID";
	
	/** primary key field of lenId */
	@FieldMapping(columnName = "LEN_ID", columnType = 12, primary = true)
	private String lenId;
	@FieldMapping(columnName = "COL_BREAKPOINT_SUM", columnType = 2)
	private Integer colBreakpointSum;
	/** foreign key field of PPN_CDM_COLUMN.COL_ID */
	@FieldMapping(columnName = "COL_ID", columnType = 12)
	private String colId;
	@FieldMapping(columnName = "COL_LENGTH", columnType = 12)
	private String colLength;
	
	public PpnCdmColumnLength() {
		super();
	}

	public PpnCdmColumnLength(String lenId) {
		this.lenId = lenId;
	}

	public PpnCdmColumnLength(Integer colBreakpointSum, String colLength) {
		this.colBreakpointSum = colBreakpointSum;
		this.colLength = colLength;
	}

	/**
	 * @return the colBreakpointSum
	 */
	public Integer getColBreakpointSum() {
		return this.colBreakpointSum;
	}
	
	/**
	 * @param colBreakpointSum the colBreakpointSum to set
	 */
	public void setColBreakpointSum(Integer value) {
		this.colBreakpointSum = value;
	}

	/**
	 * @return the colId
	 */
	public String getColId() {
		return this.colId;
	}
	
	/**
	 * @param colId the colId to set
	 */
	public void setColId(String value) {
		this.colId = value;
	}

	/**
	 * @return the colLength
	 */
	public String getColLength() {
		return this.colLength;
	}
	
	/**
	 * @param colLength the colLength to set
	 */
	public void setColLength(String value) {
		this.colLength = value;
	}

	/**
	 * @return the lenId
	 */
	public String getLenId() {
		return this.lenId;
	}
	
	/**
	 * @param lenId the lenId to set
	 */
	public void setLenId(String value) {
		this.lenId = value;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnCdmColumnLength)) {
			return false;
		}
		PpnCdmColumnLength other = (PpnCdmColumnLength)o;
		if (null == this.lenId) {
			if (other.lenId != null)
				return false;
		} else if (!this.lenId.equals(other.lenId))
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
		result = prime * result + ((lenId == null) ? 0 : lenId.hashCode());
		return result;
	}
	
}