/**
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
 */
package jetsennet.jue2.util;

import org.uorm.orm.annotation.KeyGenertator;
import org.uorm.pojo.generator.PojoGenerator;

/**
 * POJO 生成工具 Mapping对应的类生成工具
 * @author <a href="mailto:xunchangguo@gmail.com">郭训长</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2012-1-31       郭训长            创建<br/>
 */
public class Generator {
	//TODO edit below value
	/** 数据库driver */
	private String driver = "oracle.jdbc.driver.OracleDriver";//"oracle.jdbc.driver.OracleDriver";
	/**连接字串 */
	private String url = "jdbc:oracle:thin:@127.0.0.1:1521:orcl";//"jdbc:oracle:thin:@127.0.0.1:1521:orcl";
	/** 数据库用户名 */
	private String username = "ue2admin";//"cctv";//"root";
	/** 数据库密码 */
	private String password = "password";//"1";//"root";
	/** 生成的POJO类包名 */
	private String packageName = "jetsennet.jue2.beans";
    /** 生成表对应的POJO类名需要去除的表名前缀，如 “T_”, “DVN_”等 */
	private String prefix = "";//DVN_
	/** 生成类的目标地，默认为当前路径的 /src下，即 "./src" */
	private String destination = "./src";
	
	/**
	 * 生成指定表对应的 pojo类
	 * @param tableName 表名
	 * @param idgenerator 主键生成方式 {@link KeyGenertator}
	 */
	public void pojoGen (String tableName, String idgenerator) {
		PojoGenerator generator = new PojoGeneratorPpn(driver, url, username, password, packageName, destination);
		if(prefix != null){
			generator.setPrefix(prefix);
		}
		generator.createDatabaseEntities(tableName, idgenerator);
	}
	
	public static void main(String[] args) {
		Generator generator = new Generator();
//		generator.pojoGen("UUM_USER", KeyGenertator.INCREMENT);//TODO edit this
		//generator.pojoGen("UUM_USERTEMPLATE", KeyGenertator.INCREMENT);
		//generator.pojoGen("URM_SYSCLASS", KeyGenertator.UUID);
//		generator.pojoGen("uum_function", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_person", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_persontogroup", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_role", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_roleauthority", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_usergroup", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_usertogroup", KeyGenertator.INCREMENT);
//		generator.pojoGen("uum_usertorole", KeyGenertator.INCREMENT);
//		generator.pojoGen("DMP_SERVICEINFO", KeyGenertator.INCREMENT);
//		generator.pojoGen("DMP_CTRLCLASS", KeyGenertator.INCREMENT);
//		generator.pojoGen("DMP_MANUFACTURER", KeyGenertator.INCREMENT);
		//generator.pojoGen("NET_CTRLCLASS", KeyGenertator.INCREMENT);
		//generator.pojoGen("DVN_PROGRAM", KeyGenertator.SELECT);
		generator.pojoGen("PPN_RM2_RESOURCE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BUSINESSWORD", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_BC_CHANGE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_CHANGE_2_ITEM", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_ITEM", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_ITEM_AD", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_ITEM_CTRL", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_ITEM_MEDIA", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_ITEM_PlAY_DEV", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_LIST", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_PROG", KeyGenertator.UUID);
//		generator.pojoGen("PPN_BC_PROG_SECTION", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_CDM_CHANNEL", KeyGenertator.UUID);
//		generator.pojoGen("PPN_CDM_COLUMN", KeyGenertator.UUID);
//		generator.pojoGen("PPN_CDM_COLUMN_LENGTH", KeyGenertator.UUID);
//		generator.pojoGen("PPN_CDM_COL_PLAY_PLAN", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_PGM_BPOINT", KeyGenertator.UUID);
//		generator.pojoGen("PPN_PGM_PROGRAM", KeyGenertator.UUID);
//		generator.pojoGen("PPN_PGM_SEG", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_RES_ASSIGNMENT", KeyGenertator.UUID);
//		generator.pojoGen("PPN_RES_ASSIGN_TECHUSER", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_STOR_DIR", KeyGenertator.UUID);
//		generator.pojoGen("PPN_STOR_DIR_TEMPLATE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_STOR_GROUP_MEMBER", KeyGenertator.UUID);
//		generator.pojoGen("PPN_STOR_STORAGE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_STOR_USER", KeyGenertator.UUID);
//		generator.pojoGen("PPN_STOR_USERGROUP", KeyGenertator.UUID);
//		generator.pojoGen("PPN_STOR_WORKSPACE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_CATA", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_CATA_2_FILE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_EXEC_LOG", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_FILE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_FILE_AV", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_FILE_CATA", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_FILE_CATA_CONTRIBUTOR", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_FILE_CATA_SCENE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_FILE_DERIVE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_MEMBER", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_PHASE", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_PHASE_DEF", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_PLAN", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_PROD_DEST", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_RES_ASSIGN", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TASK_STORAGE", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_TRANS_DS", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TRANS_DS_MEDIA", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TRANS_DS_USER", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TRANS_MDT", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TRANS_MDT_DEST", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TRANS_MDT_USER", KeyGenertator.UUID);
		
//		generator.pojoGen("PPN_TSB_TASK", KeyGenertator.UUID);
//		generator.pojoGen("PPN_TSB_TASK2FILE", KeyGenertator.UUID);


		
	}
}
