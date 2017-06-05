package jetsennet.jue2.business;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jcom.util.StringIdsUtils;
import jetsennet.jdlm.beans.PpnRentCheck;
import jetsennet.jdlm.beans.PpnRentOut;
import jetsennet.jdlm.beans.PpnRentOutItem;
import jetsennet.jue2.beans.PpnResAssignTechuser;
import jetsennet.jue2.beans.PpnResAssignment;
import jetsennet.jue2.beans.PpnRm2Resource;
import jetsennet.jue2.beans.PpnStorDir;
import jetsennet.jue2.beans.PpnStorGroupMember;
import jetsennet.jue2.beans.PpnStorStorage;
import jetsennet.jue2.beans.PpnStorUser;
import jetsennet.jue2.beans.PpnStorUsergroup;
import jetsennet.jue2.beans.PpnStorWorkspace;
import jetsennet.jue2.beans.PpnTaskPhase;
import jetsennet.jue2.beans.PpnTaskPhaseDef;
import jetsennet.jue2.beans.PpnTaskStorage;
import jetsennet.jue2.util.SshInfo;
import jetsennet.juum.schema.User;
import jetsennet.net.WSResult;
import jetsennet.util.SerializerUtil;
import jetsennet.util.StringUtil;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.uorm.dao.common.ICommonDao;

/**
 * 任务分配管理
 */
public class PpnAssginBusiness extends BaseBusiness
{
	private static int SSH_PORT = SshInfo.sshPort;//22;
	private static String SSH_CHARSET = SshInfo.sshCharset;//"utf-8";
	private static String DEFAULT_PASSWORD = SshInfo.defaultPassword;//"1";
	private static String ROOT_USER = SshInfo.rootUser;//"root";
	private static String ROOT_PASSWORD = SshInfo.rootPassword;//"cctv";
	private static String ADMIN_USER = SshInfo.adminUser;//"ue2";
	private static String SUB_DIRS = SshInfo.subDirs;//Production,Resources,Workspace
	private static String DST_DIR = SshInfo.dstDir;//Production
	private static String SERVLET_URL = SshInfo.servletUrl;//http://192.168.1.108/RSMWEB/requestRecever
	
	private String taskId;
	private boolean isSshConnect = true;
	protected Logger logger = Logger.getLogger(PpnAssginBusiness.class);
	
	/**
	 * 启动阶段流程
	 * @param phaseIDS
	 * @param taskIDS
	 */
	public void startPhase(String phaseIDS, String taskIDS) throws Exception{
		String[] taskIDArray = taskIDS.split(",");
		phaseIDS = "'" + phaseIDS.replaceAll(",", "','") + "'";
		try {
			getDao().beginTransation();
			
			for (String taskID : taskIDArray) {
				String phaseSql = String.format("SELECT * FROM PPN_TASK_PHASE_DEF ");
				
				//查看任务是否是直送
				String directlySentSql = String.format("SELECT TASK_FIELD1 FROM PPN_TASK WHERE "
						+ "TASK_ID = '%s'", taskID);
				Map<String, Object> dsFlagM = getDao().queryForMap(directlySentSql);
				String dsFlagI = (String)dsFlagM.get("TASK_FIELD1");
				
				if (dsFlagI != null && dsFlagI.equals("1")) {
					//查看是否已经添加了"直送通知"阶段
					String queryTaskPhase = String.format("SELECT t.PHASE_ID FROM PPN_TASK_PHASE t "
					 		+ "where  t.TASK_ID = '%s' and t.PHASE_TYPE = '2'", taskID);
					Map<String, Object> queryForMap = getDao().queryForMap(queryTaskPhase);
					if (queryForMap == null) {
						phaseSql += " WHERE PHASE_TYPE IN('2','0')";
					}
					else{
						phaseSql += " WHERE PHASE_TYPE = '0'";
					}
				}
				else{
					phaseSql += " WHERE PHASE_TYPE = '0'";
				}
				
				//暂时默认插入所有的
				
				List<PpnTaskPhaseDef> queryBusinessDefObjs = getDao().queryBusinessObjs(PpnTaskPhaseDef.class, phaseSql);
				int index = -1;
				for (PpnTaskPhaseDef ppnTaskPhaseDef : queryBusinessDefObjs) {
					PpnTaskPhase ppnTaskPhase = new PpnTaskPhase();
					ppnTaskPhase.setTaskId(taskID);
					ppnTaskPhase.setPhaseName(ppnTaskPhaseDef.getPhaseName());
					ppnTaskPhase.setPhaseCode(ppnTaskPhaseDef.getPhaseCode());
					ppnTaskPhase.setPhaseStatus(ppnTaskPhaseDef.getPhaseIndex() == 1?"3":"0");
					ppnTaskPhase.setPhaseUrl(ppnTaskPhaseDef.getPhaseUrl());
					ppnTaskPhase.setPhaseIndex(ppnTaskPhaseDef.getPhaseIndex());
					ppnTaskPhase.setPhaseType(ppnTaskPhaseDef.getPhaseType());
					getDao().saveBusinessObjs(ppnTaskPhase);
				}
				
				/*修改任务状态*/
				StringBuilder updateTask = new StringBuilder("update PPN_TASK t ");
				updateTask.append("set t.TASK_EXEC_STATUS = 2 ");//执行状态（1-待执行，2-执行中，3-已完成，4-已终止）
				updateTask.append("where t.TASK_ID = '").append(taskID).append("'");
				getDao().execute(updateTask.toString());
			}
			
			getDao().commitTransation();
			
		} catch (Exception e) {
			getDao().rollbackTransation();
			throw e;
		}
	}
	
	/**
	 * 当有直送通知单下发时,为任务创建"直送阶段"
	 * @throws SQLException 
	 */
	public static void addSentDirectlyPhase(String pgm_code, ICommonDao dao) throws SQLException{
		String queryTaskPhase = String.format("SELECT t.PHASE_ID FROM PPN_TASK_PHASE t "
		 		+ "inner join PPN_TASK a on t.TASK_ID = a.TASK_ID "
		 		+ "INNER JOIN PPN_PGM_PROGRAM b on a.PGM_ID = b.PGM_ID "
		 		+ "where b.PGM_CODE = '%s' and t.PHASE_TYPE = '2'", pgm_code);
		 Map<String, Object> queryForMap = dao.queryForMap(queryTaskPhase);
		 if (queryForMap == null) {
			String queryTaskId = String.format("SELECT t.TASK_ID FROM PPN_TASK t "
					+ "inner join PPN_PGM_PROGRAM a on t.PGM_ID = a.PGM_ID "
					+ "WHERE a.PGM_CODE = '%s'", pgm_code);
			
			Map<String, Object> taskIDMap = dao.queryForMap(queryTaskId);
			if (taskIDMap != null) {
				String taskId = (String)taskIDMap.get("TASK_ID");
				
				String phaseSql = String.format("SELECT * FROM PPN_TASK_PHASE_DEF WHERE PHASE_TYPE = '2'");
				PpnTaskPhaseDef ppnTaskPhaseDef = dao.querySingleObject(PpnTaskPhaseDef.class, phaseSql);
				if (ppnTaskPhaseDef != null) {
					PpnTaskPhase ppnTaskPhase = new PpnTaskPhase();
					ppnTaskPhase.setTaskId(taskId);
					ppnTaskPhase.setPhaseName(ppnTaskPhaseDef.getPhaseName());
					ppnTaskPhase.setPhaseCode(ppnTaskPhaseDef.getPhaseCode());
					ppnTaskPhase.setPhaseStatus("0");
					ppnTaskPhase.setPhaseUrl(ppnTaskPhaseDef.getPhaseUrl());
					ppnTaskPhase.setPhaseIndex(ppnTaskPhaseDef.getPhaseIndex());
					ppnTaskPhase.setPhaseType(ppnTaskPhaseDef.getPhaseType());
					dao.saveBusinessObjs(ppnTaskPhase);
				}
			}
		}
	}
	
	/**
	 * 当有迁移系统调单下发时,为任务创建"迁移协调"阶段
	 * @throws SQLException 
	 */
	public static void addMediaDataTransferPhase(String pgm_code, ICommonDao dao) throws SQLException{
		String queryTaskPhase = String.format("SELECT t.PHASE_ID FROM PPN_TASK_PHASE t "
		 		+ "inner join PPN_TASK a on t.TASK_ID = a.TASK_ID "
		 		+ "INNER JOIN PPN_PGM_PROGRAM b on a.PGM_ID = b.PGM_ID "
		 		+ "where b.PGM_CODE = '%s' and t.PHASE_TYPE = '1'", pgm_code);
		 Map<String, Object> queryForMap = dao.queryForMap(queryTaskPhase);
		 if (queryForMap == null) {
			String queryTaskId = String.format("SELECT t.TASK_ID FROM PPN_TASK t "
					+ "inner join PPN_PGM_PROGRAM a on t.PGM_ID = a.PGM_ID "
					+ "WHERE a.PGM_CODE = '%s'", pgm_code);
			
			Map<String, Object> taskIDMap = dao.queryForMap(queryTaskId);
			if (taskIDMap != null) {
				String taskId = (String)taskIDMap.get("TASK_ID");
				
				String phaseSql = String.format("SELECT * FROM PPN_TASK_PHASE_DEF WHERE PHASE_TYPE = '1'");
				PpnTaskPhaseDef ppnTaskPhaseDef = dao.querySingleObject(PpnTaskPhaseDef.class, phaseSql);
				if (ppnTaskPhaseDef != null) {
					PpnTaskPhase ppnTaskPhase = new PpnTaskPhase();
					ppnTaskPhase.setTaskId(taskId);
					ppnTaskPhase.setPhaseName(ppnTaskPhaseDef.getPhaseName());
					ppnTaskPhase.setPhaseCode(ppnTaskPhaseDef.getPhaseCode());
					ppnTaskPhase.setPhaseStatus("0");
					ppnTaskPhase.setPhaseUrl(ppnTaskPhaseDef.getPhaseUrl());
					ppnTaskPhase.setPhaseIndex(ppnTaskPhaseDef.getPhaseIndex());
					ppnTaskPhase.setPhaseType(ppnTaskPhaseDef.getPhaseType());
					dao.saveBusinessObjs(ppnTaskPhase);
				}
			}
		}
	}
	
	/**
	 * 为资源指派人员
	 * 
	 * @param assignIds
	 * @param userIds
	 * @return
	 */
	public String assignUsersToRes(String assignIds, String userIds) {
		String retVal = "OK";
		
		String[] aIds = assignIds.split(",");
		String[] uIds = userIds.split(",");
		String[] aIdsStr = new String[aIds.length];
		for(int n=0; n<aIds.length; n++){
			aIdsStr[n] = new StringBuilder().append("'").append(aIds[n]).append("'").toString();
		}
		try {
			Timestamp currentTime = new Timestamp(new Date().getTime());
			getDao().beginTransation();
			getDao().execute("DELETE FROM ppn_res_assign_techuser WHERE ASSIGN_ID IN("+StringUtils.join(aIdsStr,",")+")");
			for(int i=0; i<aIds.length; i++){
				PpnResAssignment ra = new PpnResAssignment();
				ra.setAssignId(aIds[i]);
				ra.setAssignField1("0");
				getDao().updateBusinessObjs(true, ra);//更新状态,标识未同步
				for(int j=0; j<uIds.length; j++){
					PpnResAssignTechuser rat = new PpnResAssignTechuser();
					rat.setTuId(this.getUUID());
					rat.setAssignId(aIds[i]);
					rat.setTuUsercode(uIds[j]);
					rat.setTuCreateTime(currentTime);
					getDao().saveBusinessObjs(rat);
				}
			}
			getDao().commitTransation();
		} catch (SQLException e) {
			try {
				getDao().rollbackTransation();
			} catch (SQLException e1) {
				retVal = "Error";
				logger.error(e1);
			}
			retVal = "Error";
			logger.error(e);
		}
		return retVal;
	}
	
	/**
	 * 追加指派人员
	 * 
	 * @param assignIds
	 * @param userIds
	 * @return
	 */
	public String assignAddUsersToRes(String assignIds, String userIds) {
		String retVal = "OK";
		
		String[] aIds = assignIds.split(",");
		String[] uIds = userIds.split(",");
		try {
			Timestamp currentTime = new Timestamp(new Date().getTime());
			getDao().beginTransation();
			for(int i=0; i<aIds.length; i++){
				PpnResAssignment ra = new PpnResAssignment();
				ra.setAssignId(aIds[i]);
				ra.setAssignField1("0");
				getDao().updateBusinessObjs(true, ra);//更新状态,标识未同步
				for(int j=0; j<uIds.length; j++){
					PpnResAssignTechuser rat = new PpnResAssignTechuser();
					rat.setTuId(this.getUUID());
					rat.setAssignId(aIds[i]);
					rat.setTuUsercode(uIds[j]);
					rat.setTuCreateTime(currentTime);
					getDao().saveBusinessObjs(rat);
				}
			}
			getDao().commitTransation();
		} catch (SQLException e) {
			try {
				getDao().rollbackTransation();
			} catch (SQLException e1) {
				retVal = "Error";
				logger.error(e1);
			}
			retVal = "Error";
			logger.error(e);
		}
		return retVal;
	}
	
	public String deleteUsersToRes(String assignIds, String userIds) {
		String retVal = "OK";
		
		return retVal;
	}
	
	/**
	 * 更换设备
	 * 
	 * @param assignIds
	 * @param resCode
	 * @return
	 */
	public String assignChange(String assignIds, String resCode) {
		String retVal = "OK";
		
		String[] aIds = assignIds.split(",");
		String[] aIdsStr = new String[aIds.length];
		
		try {
			for(int n=0; n<aIds.length; n++){
				aIdsStr[n] = new StringBuilder().append("'").append(aIds[n]).append("'").toString();
			}
			StringBuilder updateAssign = new StringBuilder("update PPN_RES_ASSIGNMENT a ");
			updateAssign.append("set a.ASSIGN_ACC_RES_CODE = '").append(resCode).append("', ");
			updateAssign.append("a.ASSIGN_FIELD1 = '0' ");
			updateAssign.append("where a.ASSIGN_ID in (").append(StringUtil.join(aIdsStr, ",")).append(")");
			
			getDao().beginTransation();
			getDao().execute(updateAssign.toString());
			getDao().commitTransation();
		} catch (SQLException e) {
			try {
				getDao().rollbackTransation();
			} catch (SQLException e1) {
				retVal = "Error";
				logger.error(e1);
			}
			retVal = "Error";
			logger.error(e);
		}
		
		return retVal;
	}
	
	/**
	 * 启动任务
	 * 
	 * @param taskId
	 * @return
	 */
	public String startTask(String taskId) {
		String retVal = "OK";
		//设置当前任务
		this.setTaskId(taskId);
		
		try {
			//按设备指派
			StringBuilder resSql = new StringBuilder("select distinct a.ASSIGN_ACC_RES_CODE from PPN_RES_ASSIGNMENT a ");
			resSql.append("join PPN_TASK_RES_ASSIGN ta on ta.ASSIGN_ID=a.ASSIGN_ID ");
			resSql.append("where ta.TASK_ID = '").append(taskId).append("'");
			List<PpnResAssignment> list = getDao().queryBusinessObjs(PpnResAssignment.class,resSql.toString());
			for(int i=0; i<list.size(); i++){
				String res = assignByRes((list.get(i)).getAssignAccResCode());
				if("Error".equals(res)){
					retVal = "Error";
					break;
				}
			}
		} catch (SQLException e) {
			retVal = "Error";
			logger.error(e);
		}
		
		//启动任务成功
		if("OK".equals(retVal)){
			/*
			try {//改变任务状态
				StringBuilder updateTask = new StringBuilder("update PPN_TASK t ");
				updateTask.append("set t.TASK_EXEC_STATUS = 2 ");//执行状态（1-待执行，2-执行中，3-已完成，4-已终止）
				updateTask.append("where t.TASK_ID = '").append(taskId).append("'");
				getDao().beginTransation();
				getDao().execute(updateTask.toString());
				getDao().commitTransation();
			} catch (SQLException e) {
				try {
					getDao().rollbackTransation();
				} catch (SQLException e1) {
					retVal = "Error";
					logger.error(e1);
				}
				retVal = "Error";
				logger.error(e);
			}
			*/
			
			//资源排班同步
			//TrmBusiness.getInstance().sysPpnTaskAssign(taskId);
		}
		
		if(isSshConnect==false){
			retVal = "No";
		}
		
		return retVal;
	}
	
	/**
	 * 资源排班同步
	 * 
	 * @param taskId
	 * @return
	 */
	public String syncTask(String taskId) {
		String retVal = "OK";
		
		//资源排班同步
		//TrmBusiness.getInstance().sysPpnTaskAssign(taskId);
		
		return retVal;
	}
	
	/**
	 * 按照预约分配人员
	 * 
	 * @param assignId
	 * @return
	 */
	public String modifyAssign(String assignId) {
		String retVal = "OK";
		String ip = "";
		String group = "";
		String dir = "";
		String[] users = null;
		
		try {
			StringBuilder ipSql = new StringBuilder("select r.RES_LOCATION from PPN_RM2_RESOURCE r ");
			ipSql.append("join PPN_RES_ASSIGNMENT a on a.ASSIGN_ACC_RES_CODE=r.RES_CODE ");
			ipSql.append("where a.ASSIGN_ID = '").append(assignId).append("'");
			Map<String,Object> ipMap = getDao().queryForMap(ipSql.toString());
			if(ipMap!=null){
				ip = (String)ipMap.get("RES_LOCATION");
			}
			
			StringBuilder groupSql = new StringBuilder("select p.PGM_CODE from PPN_PGM_PROGRAM p ")
				.append("join PPN_TASK t on t.PGM_ID=p.PGM_ID ")
				.append("join PPN_TASK_RES_ASSIGN ta on ta.TASK_ID=t.TASK_ID ")
				.append("join PPN_RES_ASSIGNMENT a on a.ASSIGN_ID=ta.ASSIGN_ID ")
				.append("where a.ASSIGN_ID = '").append(assignId).append("'");
			Map<String,Object> groupMap = getDao().queryForMap(groupSql.toString());
			if(groupMap!=null){
				group = (String)groupMap.get("PGM_CODE");
			}
			
			StringBuilder storSql = new StringBuilder("select s.STOR_SHARE_PATH from PPN_STOR_STORAGE s where s.STOR_HOST = '").append(ip).append("'");
			Map<String,Object> storMap = getDao().queryForMap(storSql.toString());
			if(storMap!=null){
				dir = (String)storMap.get("STOR_SHARE_PATH");
			}
			
			StringBuilder userSql = new StringBuilder("select TU_USERCODE from PPN_RES_ASSIGN_TECHUSER where ASSIGN_ID = '").append(assignId).append("'");
			List<PpnResAssignTechuser> list = getDao().queryBusinessObjs(PpnResAssignTechuser.class,userSql.toString());
			users = new String[list.size()];
			for(int i=0; i<list.size(); i++){
				users[i] = (list.get(i)).getTuUsercode();
			}
			
			//设置当前任务
			StringBuilder taskSql = new StringBuilder("select ta.TASK_ID from PPN_TASK_RES_ASSIGN ta ")
			.append("where ta.ASSIGN_ID = '").append(assignId).append("'");
			Map<String,Object> taskMap = getDao().queryForMap(taskSql.toString());
			if(taskMap!=null){
				this.setTaskId((String)taskMap.get("TASK_ID"));
			}
		} catch (SQLException e) {
			retVal = "Error";
			logger.error(e);
		}
		
		//调接口处理权限
		String res = createWorkspace(ip, group, dir, users);
		if("Error".equals(res)){
			retVal = "Error";
		}
		
		if("OK".equals(retVal)){
			//资源排班同步
			//TrmBusiness.getInstance().sysPpnTaskAssign(this.getTaskId());
		}
		
		if(isSshConnect==false){
			retVal = "No";
		}
		return retVal;
	}
	
	/**
	 * 变更
	 * 
	 * @param taskId
	 * @return
	 */
	public String changeAssign(String taskId,String assignIds) {
		String retVal = "OK";
		String ip = "";
		String group = "";
		String dir = "";
		String[] users = null;
		//设置当前任务
		this.setTaskId(taskId);
		
		try {
			StringBuilder groupSql = new StringBuilder("select p.PGM_CODE from PPN_PGM_PROGRAM p ");
			groupSql.append("join PPN_TASK t on t.PGM_ID=p.PGM_ID ");
			groupSql.append("where t.TASK_ID = '").append(taskId).append("'");
			Map<String,Object> groupMap = getDao().queryForMap(groupSql.toString());
			if(groupMap!=null){
				group = (String)groupMap.get("PGM_CODE");
			}
			
			StringBuilder sbAIds = new StringBuilder("'").append(assignIds.replaceAll("\\,", "','")).append("'");
			StringBuilder ipSql = new StringBuilder("select distinct r.RES_CODE,r.RES_LOCATION from PPN_RM2_RESOURCE r ");
			ipSql.append("join PPN_RES_ASSIGNMENT a on a.ASSIGN_ACC_RES_CODE=r.RES_CODE ");
			ipSql.append("where a.ASSIGN_ID in (").append(sbAIds.toString()).append(")");
			List<PpnRm2Resource> ipList = getDao().queryBusinessObjs(PpnRm2Resource.class,ipSql.toString());
			for(int i=0; i<ipList.size(); i++){
				ip = ipList.get(i).getResLocation();
				
				StringBuilder storSql = new StringBuilder("select s.STOR_SHARE_PATH from PPN_STOR_STORAGE s where s.STOR_HOST = '").append(ip).append("'");
				Map<String,Object> storMap = getDao().queryForMap(storSql.toString());
				if(storMap!=null){
					dir = (String)storMap.get("STOR_SHARE_PATH");
				}
				
				StringBuilder userSql = new StringBuilder("select TU_USERCODE from PPN_RES_ASSIGN_TECHUSER at ");
				userSql.append("join PPN_RES_ASSIGNMENT a on a.ASSIGN_ID=at.ASSIGN_ID ");
				userSql.append("where at.ASSIGN_ID in (").append(sbAIds.toString()).append(") ");
				userSql.append("and a.ASSIGN_ACC_RES_CODE = '").append(ipList.get(i).getResCode()).append("' ");
				List<PpnResAssignTechuser> list = getDao().queryBusinessObjs(PpnResAssignTechuser.class,userSql.toString());
				users = new String[list.size()];
				for(int j=0; j<list.size(); j++){
					users[j] = (list.get(j)).getTuUsercode();
				}
				
				//调接口处理权限
				String res = createWorkspace(ip, group, dir, users);
				if("Error".equals(res)){
					retVal = "Error";
				}
			}
			
			if("OK".equals(retVal)){
				//资源排班同步
				//TrmBusiness.getInstance().sysPpnTaskAssign(this.getTaskId());
			}
			
			if(isSshConnect==false){
				retVal = "No";
			}
		} catch (SQLException e) {
			retVal = "Error";
			logger.error(e);
		}
		
		return retVal;
	}
	
	/**
	 * 按照设备处理任务分配
	 * 
	 * @param resCode
	 * @return
	 */
	private String assignByRes(String resCode){
		String retVal = "OK";
		String ip = "";
		String group = "";
		String dir = "";
		String[] users = null;
		
		try {
			StringBuilder ipSql = new StringBuilder("select r.RES_LOCATION from PPN_RM2_RESOURCE r ");
			ipSql.append("where r.RES_CODE = '").append(resCode).append("'");
			Map<String,Object> ipMap = getDao().queryForMap(ipSql.toString());
			if(ipMap!=null){
				ip = (String)ipMap.get("RES_LOCATION");
			}
			
			StringBuilder groupSql = new StringBuilder("select p.PGM_CODE from PPN_PGM_PROGRAM p ")
				.append("join PPN_TASK t on t.PGM_ID=p.PGM_ID ")
				.append("where t.TASK_ID = '").append(this.getTaskId()).append("'");
			Map<String,Object> groupMap = getDao().queryForMap(groupSql.toString());
			if(groupMap!=null){
				group = (String)groupMap.get("PGM_CODE");
			}
			
			StringBuilder storSql = new StringBuilder("select s.STOR_SHARE_PATH from PPN_STOR_STORAGE s where s.STOR_HOST = '").append(ip).append("'");
			Map<String,Object> dirMap = getDao().queryForMap(storSql.toString());
			if(dirMap!=null){
				dir = (String)dirMap.get("STOR_SHARE_PATH");
			}
			
			StringBuilder userSql = new StringBuilder("select distinct at.TU_USERCODE from PPN_RES_ASSIGN_TECHUSER at ");
			userSql.append("join PPN_RES_ASSIGNMENT a on a.ASSIGN_ID=at.ASSIGN_ID ");
			userSql.append("join PPN_TASK_RES_ASSIGN ra on ra.ASSIGN_ID=a.ASSIGN_ID ");
			userSql.append("where a.ASSIGN_ACC_RES_CODE = '").append(resCode).append("' ");
			userSql.append("and ra.TASK_ID = '").append(this.getTaskId()).append("'");
			List<PpnResAssignTechuser> list = getDao().queryBusinessObjs(PpnResAssignTechuser.class,userSql.toString());
			users = new String[list.size()];
			for(int i=0; i<list.size(); i++){
				users[i] = (list.get(i)).getTuUsercode();
			}
		} catch (SQLException e) {
			retVal = "Error";
			logger.error(e);
		}
		
		//调接口处理权限
		String res = createWorkspace(ip, group, dir, users);
		if("Error".equals(res)){
			retVal = "Error";
		}
		
		return retVal;
	}
	
	/**
	 * servlet请求调用
	 * 
	 * @param url
	 * @param postData
		{
		    "requestCode": "RSM201600001", 
		    "server": {
		        "host": "192.168.1.108", 
		        "port": 22, 
		        "account": "root", 
		        "password": "cctv", 
		        "charset": "utf-8", 
		        "endChars": null
		    },
		    "params": {
		        "userName": "wangtao", 
		        "password": "cctv", 
		        "uid": null, 
		        "groupName": null, 
		        "groupNewName": null, 
		        "gid": null, 
		        "dirPath": null, 
		        "right": null
		    }
		}
		
		uid：501-999
		gid：1000-100000
		
		RSM201600001 - 创建用户  userName,uid,password
		RSM201600002 - 删除用户  userName
		RSM201600003 - 更新用户密码 userName,password
		RSM201600004 - 创建用户组 groupName
		RSM2016000041 -删除用户组 groupName
		RSM201600005 - 更新用户组名 groupName, groupNewName,NG
		RSM201600006 - 添加用户到用户组 userName,groupName
		RSM201600007 - 删除用户从用户组 userName,groupName
		RSM201600008 - 创建目录 dirPath
		RSM201600009 - 删除目录 dirPath
		RSM201600010 - 设置目录属组 dirPath ,groupName;
		RSM201600011 - 设置目录权限 dirPath ,right;
		RSM201600012 - 同时设置目录属组和权限 dirPath,groupName,right;
	 * @return
	*/
    public String GetResponseDataByID(String url, String postData) {
        String data = null;
        try {
        	isSshConnect = true;
            URL dataUrl = new URL(url);
            HttpURLConnection con = (HttpURLConnection) dataUrl.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Proxy-Connection", "Keep-Alive");
            con.setDoOutput(true);
            con.setDoInput(true);
            
            OutputStream os = con.getOutputStream();
            DataOutputStream dos = new DataOutputStream(os);
            dos.write(postData.getBytes());
            dos.flush();
            dos.close();
            
            InputStream is = con.getInputStream();
            DataInputStream dis = new DataInputStream(is);
            byte d[] = new byte[dis.available()];
            dis.read(d);
            data = new String(d);
            con.disconnect();
        } catch (Exception ex) {
        	isSshConnect = false;
        	logger.error(ex);
        }
        if("".equals(data)){
        	data = "{\"error\":\"\",\"responseCode\":\"0\",\"resultVal\":\"\"}";
        }
        return data;
    }
    
	/**
	 * 创建用户组，创建目录，设置目录所属组(单个设备)
	 * 添加用户到组(可能多个用户)
	 * 
	 * @param ip
	 * @param group
	 * @param dir
	 * @param users
	 * @return
	 */
	private String createWorkspace(String ip, String group, String dir, String[] users){
		String retVal = "OK";
		int retSSH = 0;//0,成功; 1,失败
		String dirPath = new StringBuilder(dir).append("/").append(group).toString();
		String groupName = new StringBuilder("G").append(group).toString();
		try {
			JSONObject server = new JSONObject();
			server.accumulate("host", ip);
			server.accumulate("port", SSH_PORT);
			server.accumulate("account", ROOT_USER);
			server.accumulate("password", ROOT_PASSWORD);
			server.accumulate("charset", SSH_CHARSET);
			server.accumulate("endChars", null);
			JSONObject params = new JSONObject();
			params.accumulate("userName", ADMIN_USER);
			params.accumulate("password", DEFAULT_PASSWORD);
			params.accumulate("uid", 501);//501-999
			params.accumulate("groupName", groupName);
			params.accumulate("gid", 1000);//1000-100000
			params.accumulate("dirPath", dirPath);
			params.accumulate("right", 770);
			JSONObject reqJson;
			String postData;
			JSONObject retObj;
			String retData;
			
			int uid = 600;
			int gid = 2000;
			StringBuilder storSql = new StringBuilder("select s.STOR_FIELD1 as UID_INDEX,s.STOR_FIELD2 as GID_INDEX from PPN_STOR_STORAGE s where s.STOR_HOST = '").append(ip).append("'");
			Map<String,Object> dirMap = getDao().queryForMap(storSql.toString());
			if(dirMap!=null){
				uid = Integer.parseInt(dirMap.get("UID_INDEX").toString());
				gid = Integer.parseInt(dirMap.get("GID_INDEX").toString());
			}
			
			//判断是否已经存此用户组
			StringBuilder sugSql = new StringBuilder("select t.* from PPN_STOR_USERGROUP t ");
			sugSql.append("where t.GROUP_NAME = '").append(group).append("' ");
			sugSql.append("and t.GROUP_SCOPE = '").append(ip).append("' ");
			List<PpnStorUsergroup> sugList = getDao().queryBusinessObjs(PpnStorUsergroup.class,sugSql.toString());
			if(sugList.size()==0){//不存在则创建
				/**
				 * 创建用户组
				 */
				params = new JSONObject();
				params.accumulate("groupName", groupName);
				params.accumulate("gid", ++gid);
				reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600004");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        postData = reqJson.toString();
		        retData = GetResponseDataByID(SERVLET_URL, postData);
		        retObj = new JSONObject().fromObject(retData);
		        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "Error";
		        	logger.error("--------创建用户组失败--------"+groupName);
		        	return retVal;
		        }else{
		        	try {//gid自增
		    			StringBuilder updateSql = new StringBuilder("update PPN_STOR_STORAGE s ");
		    			updateSql.append("set s.STOR_FIELD2 = '").append(gid).append("' ");
		    			updateSql.append("where s.STOR_HOST = '").append(ip).append("'");
		    			getDao().beginTransation();
		    			getDao().execute(updateSql.toString());
		    			getDao().commitTransation();
		    		} catch (SQLException e) {
		    			try {
		    				getDao().rollbackTransation();
		    			} catch (SQLException e1) {
		    				retVal = "Error";
		    				logger.error(e1);
		    			}
		    			retVal = "Error";
		    			logger.error(e);
		    		}
		        }
			}
			
			//判断是否已经存主目录
			StringBuilder dirSql = new StringBuilder("select t.* from PPN_STOR_DIR t ");
			dirSql.append("where t.DIR_NAME = '").append(group).append("' ");
			dirSql.append("and t.GROUP_ID in (select g.GROUP_ID from PPN_STOR_USERGROUP g ");
			dirSql.append("where g.GROUP_NAME = '").append(group).append("' ");
			dirSql.append("and g.GROUP_SCOPE = '").append(ip).append("') ");
			
			List<PpnStorDir> dirList = getDao().queryBusinessObjs(PpnStorDir.class,dirSql.toString());
			if(dirList.size()==0){//不存在则创建
				/**
				 * 创建目录/子目录
				 */
				params = new JSONObject();
				params.accumulate("dirPath", dirPath);
				reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600008");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        postData = reqJson.toString();
		        retData = GetResponseDataByID(SERVLET_URL, postData);
		        retObj = new JSONObject().fromObject(retData);
		        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "Error";
		        	logger.error("--------创建目录失败--------"+dirPath);
		        	return retVal;
		        }
		        String[] subDirs = SUB_DIRS.split(",");
		        for(int i=0; i<subDirs.length; i++){
		        	String subDir = new StringBuilder(dirPath).append("/").append(subDirs[i]).toString();
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600008");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------创建子目录失败--------"+subDir);
			        	return retVal;
			        }
		        }
		        for(int i=0; i<users.length; i++){
		        	String subDir = new StringBuilder(dirPath).append("/").append(users[i]).toString();
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600008");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------创建子目录失败--------"+subDir);
			        	return retVal;
			        }
		        }
		        
				/**
				 * 设置目录/子目录的属组/权限/所属账户
				 */
		        params = new JSONObject();
				params.accumulate("dirPath", dirPath);
				params.accumulate("groupName", groupName);
				params.accumulate("right", 770);
				reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600012");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        postData = reqJson.toString();
		        retData = GetResponseDataByID(SERVLET_URL, postData);
		        retObj = new JSONObject().fromObject(retData);
		        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "Error";
		        	logger.error("--------设置目录权限失败--------"+dirPath);
		        	return retVal;
		        }
	        	params = new JSONObject();
				params.accumulate("dirPath", dirPath);
				params.accumulate("userName", ADMIN_USER);
				reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600014");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        postData = reqJson.toString();
		        retData = GetResponseDataByID(SERVLET_URL, postData);
		        retObj = new JSONObject().fromObject(retData);
		        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "Error";
		        	logger.error("--------设置目录所属用户失败--------"+dirPath);
		        	return retVal;
		        }
		        for(int i=0; i<subDirs.length; i++){
		        	int right = 770;
		        	if(subDirs[i].equals(DST_DIR)){
		        		right = 750;
		        	}
		        	String subDir = new StringBuilder(dirPath).append("/").append(subDirs[i]).toString();
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					params.accumulate("groupName", groupName);
					params.accumulate("right", right);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600012");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------设置子目录权限失败--------"+subDir);
			        	return retVal;
			        }
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					params.accumulate("userName", ADMIN_USER);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600014");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------设置子目录所属用户失败--------"+subDir);
			        	return retVal;
			        }
		        }
		        for(int i=0; i<users.length; i++){
		        	String subDir = new StringBuilder(dirPath).append("/").append(users[i]).toString();
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					params.accumulate("groupName", groupName);
					params.accumulate("right", 750);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600012");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------设置账户子目录权限失败--------"+subDir);
			        	return retVal;
			        }
			        
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					params.accumulate("userName", users[i]);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600014");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------设置账户子目录所属用户失败--------"+subDir);
			        	return retVal;
			        }
		        }
			}else{//主目录存在，则判断是否有新的用户，有则创建对应的子目录
				StringBuilder subDirSql = new StringBuilder("select t.* from PPN_STOR_DIR t ");
				subDirSql.append("where t.DIR_PARENT_ID = '").append(dirList.get(0).getDirId()).append("' ");
				subDirSql.append("and t.GROUP_ID in (select g.GROUP_ID from PPN_STOR_USERGROUP g ");
				subDirSql.append("where g.GROUP_NAME = '").append(group).append("' ");
				subDirSql.append("and g.GROUP_SCOPE = '").append(ip).append("') ");
				
				List<PpnStorDir> subDirList = getDao().queryBusinessObjs(PpnStorDir.class,subDirSql.toString());
		        for(int i=0; i<users.length; i++){
		        	boolean userDirExist = false;
		        	for(int j=0; j<subDirList.size(); j++){
		        		if(users[i].equals(subDirList.get(j).getDirName())){
		        			userDirExist = true;
		        			break;
		        		}
		        	}
		        	if(userDirExist){//存在则处理下一条，不存在则追加
		        		continue;
		        	}
		        	String subDir = new StringBuilder(dirPath).append("/").append(users[i]).toString();
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600008");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------追加子目录失败--------"+subDir);
			        	return retVal;
			        }
			        
		        	params = new JSONObject();
					params.accumulate("dirPath", subDir);
					params.accumulate("groupName", groupName);
					params.accumulate("right", 750);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600012");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------追加子目录权限失败--------"+subDir);
			        	return retVal;
			        }
			        
			        params = new JSONObject();
					params.accumulate("dirPath", subDir);
					params.accumulate("userName", users[i]);
					reqJson = new JSONObject();
					reqJson.accumulate("requestCode", "RSM201600014");
					reqJson.accumulate("server", server);
					reqJson.accumulate("params", params);
			        postData = reqJson.toString();
			        retData = GetResponseDataByID(SERVLET_URL, postData);
			        retObj = new JSONObject().fromObject(retData);
			        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
			        if(retSSH==-1){
			        	retVal = "Error";
			        	logger.error("--------追加子目录设置所属用户失败--------"+subDir);
			        	return retVal;
			        }
		        }
			}
			
			/**
			 * 添加用户到组
			 */
			for(int i=0; i<users.length; i++){
		        params = new JSONObject();
				params.accumulate("userName", users[i]);
				params.accumulate("groupName", groupName);
				reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600006");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        postData = reqJson.toString();
		        retData = GetResponseDataByID(SERVLET_URL, postData);
		        retObj = new JSONObject().fromObject(retData);
		        retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "Error";
		        	logger.error("--------添加用户到组失败--------"+users[i]+","+groupName);
		        	return retVal;
		        }
			}
        	
			//数据存库
			String ret = saveStor(ip, group, users);
			if("Error".equals(ret)){
				retVal = "Error";
			}
		} catch (Exception e) {
			retVal = "Error";
			logger.error(e);
		}
		return retVal;
	}
	
	/**
	 * 存库
	 * PPN_STOR_USERGROUP
	 * PPN_TASK_STORAGE
	 * PPN_STOR_WORKSPACE
	 * PPN_STOR_DIR
	 * --PPN_STOR_USER
	 * PPN_STOR_GROUP_MEMBER
	 * 
	 * @param ip
	 * @param group
	 * @param dir
	 * @param users
	 * @return
	 */
	private String saveStor(String ip, String group, String[] users){
		String retVal = "OK";
		
		try {
			getDao().beginTransation();
			PpnStorUsergroup sug = null;//用户组
			//判断是否已经存在设备数据
			StringBuilder sugSql = new StringBuilder("select t.* from PPN_STOR_USERGROUP t ");
			sugSql.append("where t.GROUP_NAME = '").append(group).append("' ");
			sugSql.append("and t.GROUP_SCOPE = '").append(ip).append("' ");
			List<PpnStorUsergroup> list = getDao().queryBusinessObjs(PpnStorUsergroup.class,sugSql.toString());
			if(list.size()==0){//不存在则创建用户组，存储，空间，目录
				//添加用户组
				sug = new PpnStorUsergroup();
				sug.setGroupId(this.getUUID());
				sug.setGroupName(group);
				sug.setGroupType(1);//组类型（1-本地用户，2-网络用户）
				sug.setGroupScope(ip);
				getDao().saveBusinessObjs(sug);
				
				//添加存储
				String storId = "";
				StringBuilder storSql = new StringBuilder("select s.STOR_ID,s.STOR_SHARE_PATH,s.STOR_CAPACITY from PPN_STOR_STORAGE s where s.STOR_HOST = '").append(ip).append("'");
				Map<String,Object> storMap = getDao().queryForMap(storSql.toString());
				if(storMap!=null){
					storId = (String)storMap.get("STOR_ID");
					PpnTaskStorage ts = new PpnTaskStorage();
					ts.setStorId(this.getUUID());
					ts.setTaskId(this.getTaskId());
					ts.setStorPath((String)storMap.get("STOR_SHARE_PATH"));
					ts.setStorQuota(Integer.parseInt(storMap.get("STOR_CAPACITY").toString()));
					getDao().saveBusinessObjs(ts);
				}
				
				//添加空间
				PpnStorWorkspace sw = new PpnStorWorkspace();
				sw.setWsId(this.getUUID());
				//sw.setTmplId("");
				sw.setStorId(storId);
				sw.setWsName(group);
				sw.setWsStatus(1);
				getDao().saveBusinessObjs(sw);
				
				//添加目录
				PpnStorDir sd = new PpnStorDir();
				sd.setDirId(this.getUUID());
				sd.setWsId(sw.getWsId());
				sd.setDirParentId("0");
				sd.setGroupId(sug.getGroupId());
				sd.setDirName(group);
				sd.setDirStatus(1);
				getDao().saveBusinessObjs(sd);
				
		        String[] subDirs = SUB_DIRS.split(",");
		        for(int i=0; i<subDirs.length; i++){
					//添加固定子目录
					PpnStorDir sd1 = new PpnStorDir();
					sd1.setDirId(this.getUUID());
					sd1.setWsId(sw.getWsId());
					sd1.setDirParentId(sd.getDirId());
					sd1.setGroupId(sug.getGroupId());
					sd1.setDirName(subDirs[i]);
					sd1.setDirStatus(1);
					getDao().saveBusinessObjs(sd1);
		        }
		        for(int i=0; i<users.length; i++){
					//添加工号子目录
					PpnStorDir sd1 = new PpnStorDir();
					sd1.setDirId(this.getUUID());
					sd1.setWsId(sw.getWsId());
					sd1.setDirParentId(sd.getDirId());
					sd1.setGroupId(sug.getGroupId());
					sd1.setDirName(users[i]);
					sd1.setDirStatus(1);
					getDao().saveBusinessObjs(sd1);
		        }
		        
		        StringBuilder userIds = new StringBuilder("'").append(StringUtils.join(users,"','")).append("'");
				StringBuilder userSql = new StringBuilder("select u.* from PPN_STOR_USER u ");
				userSql.append("where u.USER_LOGIN_NAME in (").append(userIds.toString()).append(")");
				List<PpnStorUser> userList = getDao().queryBusinessObjs(PpnStorUser.class, userSql.toString());
				for(int i=0; i<userList.size(); i++){
					//添加用户所属组
					PpnStorGroupMember sgm = new PpnStorGroupMember();
					sgm.setMemId(this.getUUID());
					sgm.setGroupId(sug.getGroupId());
					sgm.setUserId(userList.get(i).getUserId());
					getDao().saveBusinessObjs(sgm);
				}
			}else{
				//取用户组
				sug = list.get(0);
				
				//取空间
				StringBuilder wsSql = new StringBuilder("select t.* from PPN_STOR_WORKSPACE t ");
				wsSql.append("where t.WS_NAME = '").append(group).append("' ");
				List<PpnStorWorkspace> wsList = getDao().queryBusinessObjs(PpnStorWorkspace.class,wsSql.toString());
				
				//取主目录
				StringBuilder dirSql = new StringBuilder("select t.* from PPN_STOR_DIR t ");
				dirSql.append("where t.DIR_NAME = '").append(group).append("' ");
				List<PpnStorDir> dirList = getDao().queryBusinessObjs(PpnStorDir.class,dirSql.toString());
		        
		        StringBuilder userIds = new StringBuilder("'").append(StringUtils.join(users,"','")).append("'");
		        
		        //取账户
				StringBuilder userSql = new StringBuilder("select u.* from PPN_STOR_USER u ");
				userSql.append("where u.USER_LOGIN_NAME in (").append(userIds.toString()).append(")");
				List<PpnStorUser> userList = getDao().queryBusinessObjs(PpnStorUser.class, userSql.toString());
				
				//取子目录
				StringBuilder subDirSql = new StringBuilder("select t.* from PPN_STOR_DIR t ");
				subDirSql.append("where t.DIR_PARENT_ID = '").append(dirList.get(0).getDirId()).append("' ");
				List<PpnStorDir> subDirList = getDao().queryBusinessObjs(PpnStorDir.class, subDirSql.toString());
				
				for(int i=0; i<userList.size(); i++){
					boolean userExist = false;
					for(int j=0; j<subDirList.size(); j++){
						if(userList.get(i).getUserLoginName().equals(subDirList.get(j).getDirName())){
							userExist = true;
							break;
						}
					}
					if(userExist){//存在则处理下一条，不存在则追加
						continue;
					}
					//添加工号子目录
					PpnStorDir sd1 = new PpnStorDir();
					sd1.setDirId(this.getUUID());
					sd1.setWsId(wsList.get(0).getWsId());
					sd1.setDirParentId(dirList.get(0).getDirId());
					sd1.setGroupId(sug.getGroupId());
					sd1.setDirName(userList.get(i).getUserLoginName());
					sd1.setDirStatus(1);
					getDao().saveBusinessObjs(sd1);
					
					//添加用户所属组
					PpnStorGroupMember sgm = new PpnStorGroupMember();
					sgm.setMemId(this.getUUID());
					sgm.setGroupId(sug.getGroupId());
					sgm.setUserId(userList.get(i).getUserId());
					getDao().saveBusinessObjs(sgm);
				}
			}
			
			getDao().commitTransation();
		} catch (SQLException e) {
			try {
				getDao().rollbackTransation();
			} catch (SQLException e1) {
				retVal = "Error";
				logger.error(e1);
			}
			retVal = "Error";
			logger.error(e);
		}
		return retVal;
	}
	
	/**
	 * 批量创建账户
	 * @param userIds
	 * @param storIds
	 * @return
	 */
	public String createUsers(String userIds,String storIds){
		String retVal = "OK";
		StringBuilder errIps = new StringBuilder();
		
		StringBuilder sbUsers = new StringBuilder("'").append(userIds.replaceAll("\\,", "','")).append("'");
		StringBuilder userSql = new StringBuilder("select u.* from PPN_STOR_USER u ");
		userSql.append("where u.USER_ID in (").append(sbUsers.toString()).append(")");
		List<PpnStorUser> userList = null;
		
		StringBuilder sbIps = new StringBuilder("'").append(storIds.replaceAll("\\,", "','")).append("'");
		StringBuilder ipSql = new StringBuilder("select s.* from PPN_STOR_STORAGE s ");
		ipSql.append("where s.STOR_ID in (").append(sbIps.toString()).append(")");
		List<PpnStorStorage> ipList = null;
		
		try {
			userList = getDao().queryBusinessObjs(PpnStorUser.class, userSql.toString());
			ipList = getDao().queryBusinessObjs(PpnStorStorage.class, ipSql.toString());
		} catch (SQLException e) {
			retVal = "Error";
			logger.error(e);
			return retVal;
		}
		
		for(int i=0; i<ipList.size(); i++){//遍历所有工作站
			for(int j=0; j<userList.size(); j++){//遍历所有账户
				JSONObject server = new JSONObject();
				server.accumulate("host", ipList.get(i).getStorHost());
				server.accumulate("port", SSH_PORT);
				server.accumulate("account", ROOT_USER);
				server.accumulate("password", ROOT_PASSWORD);
				server.accumulate("charset", SSH_CHARSET);
				server.accumulate("endChars", null);
				JSONObject params = new JSONObject();
				params = new JSONObject();
				params.accumulate("uid", userList.get(j).getUserUid());//uid
				params.accumulate("userCode", userList.get(j).getUserLoginName());//usercode
				params.accumulate("userName", userList.get(j).getUserScope());//username
				//params.accumulate("userName", userList.get(j).getUserLoginName());//username
				params.accumulate("password", userList.get(j).getUserLoginPwd());//password
				JSONObject reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600001");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        String postData = reqJson.toString();
		        String retData = GetResponseDataByID(SERVLET_URL, postData);
		        JSONObject retObj = new JSONObject().fromObject(retData);
		        int retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "No";
		        	StringBuilder msg = new StringBuilder();
		        	msg.append("--------批量添加账户失败--------");
		        	msg.append(ipList.get(i).getStorName());
		        	msg.append(",");
		        	msg.append(ipList.get(i).getStorHost());
		        	logger.error(msg.toString());
		        	errIps.append(ipList.get(i).getStorName()).append(",");
		        	break;
		        }
			}
		}
		if("No".equals(retVal)){//把出问题的设备列表返回去
			String retStr = errIps.toString();
			retVal = retStr.substring(0,retStr.length()-1);
		}
        return retVal;
	}
	
	/**
	 * 批量删除账户
	 * @param userIds
	 * @param storIds
	 * @return
	 */
	public String deleteUsers(String userIds,String storIds){
		String retVal = "OK";
		StringBuilder errIps = new StringBuilder();
		
		StringBuilder sbUsers = new StringBuilder("'").append(userIds.replaceAll("\\,", "','")).append("'");
		StringBuilder userSql = new StringBuilder("select u.* from PPN_STOR_USER u ");
		userSql.append("where u.USER_ID in (").append(sbUsers.toString()).append(")");
		List<PpnStorUser> userList = null;
		
		StringBuilder sbIps = new StringBuilder("'").append(storIds.replaceAll("\\,", "','")).append("'");
		StringBuilder ipSql = new StringBuilder("select s.* from PPN_STOR_STORAGE s ");
		ipSql.append("where s.STOR_ID in (").append(sbIps.toString()).append(")");
		List<PpnStorStorage> ipList = null;
		
		try {
			userList = getDao().queryBusinessObjs(PpnStorUser.class, userSql.toString());
			ipList = getDao().queryBusinessObjs(PpnStorStorage.class, ipSql.toString());
		} catch (SQLException e) {
			retVal = "Error";
			logger.error(e);
			return retVal;
		}
		
		for(int i=0; i<ipList.size(); i++){//遍历所有工作站
			for(int j=0; j<userList.size(); j++){//遍历所有账户
				JSONObject server = new JSONObject();
				server.accumulate("host", ipList.get(i).getStorHost());
				server.accumulate("port", SSH_PORT);
				server.accumulate("account", ROOT_USER);
				server.accumulate("password", ROOT_PASSWORD);
				server.accumulate("charset", SSH_CHARSET);
				server.accumulate("endChars", null);
				JSONObject params = new JSONObject();
				params = new JSONObject();
				params.accumulate("userName", userList.get(j).getUserLoginName());//username
				JSONObject reqJson = new JSONObject();
				reqJson.accumulate("requestCode", "RSM201600002");
				reqJson.accumulate("server", server);
				reqJson.accumulate("params", params);
		        String postData = reqJson.toString();
		        String retData = GetResponseDataByID(SERVLET_URL, postData);
		        JSONObject retObj = new JSONObject().fromObject(retData);
		        int retSSH = Integer.parseInt(retObj.get("responseCode").toString());
		        if(retSSH==-1){
		        	retVal = "No";
		        	StringBuilder msg = new StringBuilder();
		        	msg.append("--------批量删除账户失败--------");
		        	msg.append(ipList.get(i).getStorName());
		        	msg.append(",");
		        	msg.append(ipList.get(i).getStorHost());
		        	logger.error(msg.toString());
		        	errIps.append(ipList.get(i).getStorName()).append(",");
		        	break;
		        }
			}
		}
		if("No".equals(retVal)){//把出问题的设备列表返回去
			String retStr = errIps.toString();
			retVal = retStr.substring(0,retStr.length()-1);
		}
        return retVal;
	}
	
	/**
	 * 文件迁移
	 * @param ip
	 * @param srcPath
	 * @param dstPath
	 * @return
	 */
	public String moveFile(String ip, String srcPath, String dstPath){
		String retVal = "OK";
		JSONObject server = new JSONObject();
		server.accumulate("host", ip);
		server.accumulate("port", SSH_PORT);
		server.accumulate("account", ROOT_USER);
		server.accumulate("password", ROOT_PASSWORD);
		server.accumulate("charset", SSH_CHARSET);
		server.accumulate("endChars", null);
		JSONObject params = new JSONObject();
		params.accumulate("filePath", srcPath);
		params.accumulate("dirPath", dstPath);
		
		JSONObject reqJson = new JSONObject();
		reqJson.accumulate("requestCode", "RSM201600013");
		reqJson.accumulate("server", server);
		reqJson.accumulate("params", params);
        String postData = reqJson.toString();
        String retData = GetResponseDataByID(SERVLET_URL, postData);
        JSONObject retObj = new JSONObject().fromObject(retData);
        int retSSH = Integer.parseInt(retObj.get("responseCode").toString());
        if(retSSH==-1){
        	retVal = "Error";
        	logger.error(retObj.get("error").toString());
        }
        
		return retVal;
	}
	
	
	/**
	 * 删除文件
	 * @param ip
	 * @param srcPath
	 * @param dstPath
	 * @return
	 */
	public String removeFile(String ip,String dstPath){
		String retVal = "OK";
		JSONObject server = new JSONObject();
		server.accumulate("host", ip);
		server.accumulate("port", SSH_PORT);
		server.accumulate("account", ROOT_USER);
		server.accumulate("password", ROOT_PASSWORD);
		server.accumulate("charset", SSH_CHARSET);
		server.accumulate("endChars", null);
		JSONObject params = new JSONObject();
	    params.accumulate("dirPath", dstPath);
		JSONObject reqJson = new JSONObject();
		reqJson.accumulate("requestCode", "RSM201600009");
		reqJson.accumulate("server", server);
		reqJson.accumulate("params", params);
        String postData = reqJson.toString();
        String retData = GetResponseDataByID(SERVLET_URL, postData);
        JSONObject retObj = new JSONObject().fromObject(retData);
        int retSSH = Integer.parseInt(retObj.get("responseCode").toString());
        if(retSSH==-1){
        	retVal = "Error";
        	logger.error(retObj.get("error").toString());
        }
        
		return retVal;
	}
	
	//设置节目编目
	public WSResult selectUsers(String userIds, WSResult retObj) throws Exception {
		try {
			String[] users = userIds.split(",");
			for(int i = 0;i<users.length;i++){
				users[i] = new StringBuilder().append("'").append(users[i]).append("'").toString();
			}
			List<User> userlist =getDao().queryBusinessObjs(User.class, "SELECT t.ID , t.USER_NAME FROM UUM_USER t WHERE t.login_name IN ("+StringUtils.join(users,",")+") ");
			String[] uumUserArr = new String[userlist.size()];
			for(int j = 0;j<userlist.size();j++){
				uumUserArr[j] = String.valueOf(userlist.get(j).getUserName());
			}
			String username = StringUtils.join(uumUserArr,",");
			retObj.setErrorCode(0);
			retObj.setResultVal(username);
				} catch (Exception e) {
					throw e;
				}
				return retObj;
			}	
	
	/**
	 * 保存资源出库单
	 * */
	public WSResult saveSource(String xml,WSResult retObj)throws Exception{
		Document doc = DocumentHelper.parseText(xml);
		PpnRentOut ppnROunt = SerializerUtil.deserialize(PpnRentOut.class, doc);
		try{
			getDao().beginTransation();
			if(ppnROunt.getOutId() != null && ppnROunt.getOutId() != ""){
				getDao().updateBusinessObjs(true,ppnROunt);
			}else{
				getDao().saveBusinessObjs(ppnROunt);
			}
			getDao().commitTransation();
			retObj.setErrorCode(0);
			retObj.setResultVal(ppnROunt.getOutId());
		} catch (Exception e) {
			getDao().rollbackTransation();
			throw e;
		}
		return retObj;
		
	}
	
	
	public void removeSource(String objXml) throws Exception {
	  IDao dao = getDao();
	  try {
		dao.beginTransation();
		dao.execute("DELETE FROM PPN_RENT_OUT_ITEM t WHERE t.OUT_ID  IN ("
				+ StringIdsUtils.getSqlIds(objXml) + ")");
		dao.execute("DELETE FROM PPN_RENT_OUT t WHERE t.OUT_ID IN ("
							+ StringIdsUtils.getSqlIds(objXml) + ")");
		dao.commitTransation();
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}

	}	
	
	/**
	 * 保存资源出库单
	 * */
	public String submitSource(String itemId,WSResult retObj)throws Exception{
		IDao dao = getDao();
		String retVal = "OK";
			dao.beginTransation();
			String[] itemid = itemId.split(",");
			String[] itemStr = new String[itemid.length];
			for(int i = 0;i<itemid.length;i++){
				itemStr[i] = new StringBuilder().append("'").append(itemid[i]).append("'").toString();
			}
			List<PpnRentOutItem> proilist =getDao().queryBusinessObjs(PpnRentOutItem.class, "SELECT t.* FROM PPN_RENT_OUT_ITEM t WHERE t.item_id IN ("+StringUtils.join(itemStr,",")+") ");
			String proSql = "select * from ppn_rent_out where out_id = '"+(proilist.get(0)).getOutId()+"'";
			try{
				PpnRentOut pro = getDao().querySingleObject(PpnRentOut.class, proSql);
				if(pro != null){
					PpnRentCheck ppr = new PpnRentCheck();
					ppr.setCheckId(UUID.randomUUID().toString());
					ppr.setCheckObjCode(pro.getOutCode());
					ppr.setCheckStatus(pro.getOutStatus());
					dao.saveBusinessObjs(ppr);
					retVal = "OK";
					dao.commitTransation();
				}else{
					retVal = "Error";
				}
			}catch(Exception e){
				e.printStackTrace();
				retVal = "Error";
			}
		return retVal;
	}
	
	/**
	 * UUID
	 * @return
	 */
	private String getUUID(){
		return UUID.randomUUID().toString();
	}
	
	public String getTaskId() {
		return taskId;
	}
	
	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}
	
	public static void main(String[] args){
		PpnAssginBusiness bus = new PpnAssginBusiness();
		bus.moveFile("192.168.1.100", "/media/2016M00281076/Workspace/有故事的人.avi", "/media");
	}
}
