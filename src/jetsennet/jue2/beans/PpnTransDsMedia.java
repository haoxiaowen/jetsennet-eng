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
 * 文件：jetsennet.jue2.beans.PpnTransDsMedia.java
 * 日 期：Thu Aug 04 14:47:00 CST 2016
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
@ClassMapping(tableName = "PPN_TRANS_DS_MEDIA", keyGenerator = "uuid")
public class PpnTransDsMedia implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	public static String PROP_DS_ID = "DS_ID";
	public static String PROP_MEDIA_CODE = "MEDIA_CODE";
	public static String PROP_MEDIA_ID = "MEDIA_ID";
	public static String PROP_MEDIA_SEG_INDEX = "MEDIA_SEG_INDEX";
	
	/** primary key field of mediaId */
	@FieldMapping(columnName = "MEDIA_ID", columnType = 12, primary = true)
	private String mediaId;
	/** foreign key field of PPN_TRANS_DS.DS_ID */
	@FieldMapping(columnName = "DS_ID", columnType = 12)
	private String dsId;
	@FieldMapping(columnName = "MEDIA_CODE", columnType = 12)
	private String mediaCode;
	@FieldMapping(columnName = "MEDIA_SEG_INDEX", columnType = 12)
	private String mediaSegIndex;
	
	public PpnTransDsMedia() {
		super();
	}

	public PpnTransDsMedia(String mediaId) {
		this.mediaId = mediaId;
	}

	public PpnTransDsMedia(String mediaCode, String mediaSegIndex) {
		this.mediaCode = mediaCode;
		this.mediaSegIndex = mediaSegIndex;
	}

	/**
	 * @return the dsId
	 */
	public String getDsId() {
		return this.dsId;
	}
	
	/**
	 * @param dsId the dsId to set
	 */
	public void setDsId(String value) {
		this.dsId = value;
	}

	/**
	 * @return the mediaCode
	 */
	public String getMediaCode() {
		return this.mediaCode;
	}
	
	/**
	 * @param mediaCode the mediaCode to set
	 */
	public void setMediaCode(String value) {
		this.mediaCode = value;
	}

	/**
	 * @return the mediaId
	 */
	public String getMediaId() {
		return this.mediaId;
	}
	
	/**
	 * @param mediaId the mediaId to set
	 */
	public void setMediaId(String value) {
		this.mediaId = value;
	}

	/**
	 * @return the mediaSegIndex
	 */
	public String getMediaSegIndex() {
		return this.mediaSegIndex;
	}
	
	/**
	 * @param mediaSegIndex the mediaSegIndex to set
	 */
	public void setMediaSegIndex(String value) {
		this.mediaSegIndex = value;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object o) {
		if ((o == null) || !(o instanceof PpnTransDsMedia)) {
			return false;
		}
		PpnTransDsMedia other = (PpnTransDsMedia)o;
		if (null == this.mediaId) {
			if (other.mediaId != null)
				return false;
		} else if (!this.mediaId.equals(other.mediaId))
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
		result = prime * result + ((mediaId == null) ? 0 : mediaId.hashCode());
		return result;
	}
	
}