package jetsennet.jcom.channel;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jcom.util.StringIdsUtils;
import jetsennet.jue2.beans.PpnMsg;
import jetsennet.jue2.beans.PpnMsgReceive;
import jetsennet.jue2.beans.PpnPgmCata;
import jetsennet.jue2.beans.PpnPgmCataContributor;
import jetsennet.jue2.beans.PpnPgmProgram;
import jetsennet.jue2.beans.PpnTaskFile;
import jetsennet.jue2.beans.PpnTaskFileCata;
import jetsennet.jue2.beans.PpnTaskFileGroup2File;
import jetsennet.jue2.business.PpnAssginBusiness;
import jetsennet.jue2.util.SshInfo;
import jetsennet.jue2.util.factory.DaoFactory;
import jetsennet.juum.schema.User;
import jetsennet.net.WSResult;
import jetsennet.util.SerializerUtil;
import jetsennet.util.StringUtil;

import org.apache.commons.lang.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

public class ChannalBusiness extends BaseBusiness {

	private ChannalBusiness channalBusiness;

	public ChannalBusiness getChannalBusiness() {
		return channalBusiness;
	}

	public void setChannalBusiness(ChannalBusiness channalBusiness) {
		this.channalBusiness = channalBusiness;
	}
//新增修改频道信息
	public WSResult saveSchs2Objs(String objXml, WSResult retObj)
			throws Exception {
		IDao dao = getDao();
		try {
			Document doc = DocumentHelper.parseText(objXml);
			Element rootEle = doc.getRootElement();
			dao.beginTransation();
			String star_time = rootEle.element("CHAN_BEGIN_DATE").getText();
			String end_time = rootEle.element("CHAN_END_DATE").getText();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			
			PpnCdmChannel sch = SerializerUtil.deserialize(PpnCdmChannel.class,
					objXml);
			sch.setChanBeginDate(df.parse(star_time));
			sch.setChanEndDate(df.parse(end_time));

			if (!StringUtil.isNullOrEmpty(sch.getChanId())) {
				dao.updateBusinessObjs(true, sch);
			} else {
				List<PpnCdmChannel> list = dao.queryBusinessObjs(PpnCdmChannel.class,"select * from  PPN_CDM_CHANNEL where CHAN_CODE='"
								+ sch.getChanCode() + "'");
				if (list.size() > 0) {
					retObj.setErrorCode(9);
					retObj.setErrorString("频道代码已存在，请重新设置");
					dao.commitTransation();
					return retObj;
				}
				sch.setCreateTime(new Timestamp(System.currentTimeMillis()));
				sch.setChanId(null);
				dao.saveBusinessObjs(sch);
			}

			PpnMsg ppnMsg = new PpnMsg();
			
				ppnMsg.setMsgSendTo("123");
				ppnMsg.setMsgSendToName("kanyixia");
				ppnMsg.setMsgStatus(2);//改为发送状态
				ppnMsg.setMsgDesc("ceshizhong");
				ppnMsg.setMsgLevel(1);
				ppnMsg.setMsgType(Integer.valueOf(1));
				ppnMsg.setMsgTime(new Date());
				ppnMsg.setMsgObjName("ceshi");
				ppnMsg.setMsgUser("admin");
				ppnMsg.setMsgObjValue("123");	
				dao.saveBusinessObjs(ppnMsg);
			
				PpnMsgReceive mr=new PpnMsgReceive();
				mr.setMsgId(ppnMsg.getMsgId());		
				mr.setRecUser("admin");
				mr.setRecStatus(1);
				mr.setRecTime(new Date());
				mr.setRecRead(0);
				mr.setRecStick(0);
				dao.saveBusinessObjs(mr);
				
			
			dao.commitTransation();
			retObj.setErrorCode(0);
		} catch (Exception e) {
			dao.rollbackTransation();
			retObj.setErrorCode(1);
			throw e;
		}
		return retObj;
	}

	
	public WSResult saveCOL(String objXml, WSResult retObj) throws Exception {
		IDao dao = getDao();
		try {
			Document doc = DocumentHelper.parseText(objXml);
			Element rootEle = doc.getRootElement();
			dao.beginTransation();
			
			PpnCdmColumn sch = SerializerUtil.deserialize(PpnCdmColumn.class,
					objXml);

			if (null != sch.getColId() && !"".equals(sch.getColId())) {
				dao.updateBusinessObjs(true, sch);
			} else {
				List<PpnCdmColumn> list = dao.queryBusinessObjs(PpnCdmColumn.class,"select * from  PPN_CDM_COLUMN where COL_CODE='"
								+ sch.getColCode() + "'");
				if (list.size() > 0) {
					retObj.setErrorCode(9);
					retObj.setErrorString("栏目代码已存在，请重新设置");
					dao.commitTransation();
                    return retObj;
				}else{
                sch.setColCreateTime(new Timestamp(System.currentTimeMillis()));
				sch.setColId(null);
			    sch.setColThroughType(1);
			    dao.saveBusinessObjs(sch);
			    retObj.setErrorCode(0);
				}
			}
			dao.commitTransation();
			
		} catch (Exception e) {
			dao.rollbackTransation();
			e.printStackTrace();
			throw e;
		}
		return retObj;
	}

	// 保存栏目时长
	public WSResult saveCOLlength(String objXml, WSResult retObj)
			throws Exception {
		IDao dao = getDao();
		try {
			dao.beginTransation();

			PpnCdmColumnLength sch = SerializerUtil.deserialize(
					PpnCdmColumnLength.class, objXml);

			if (null != sch.getLenId() && !"".equals(sch.getLenId())) {
				dao.updateBusinessObjs(true, sch);
			} else {
                sch.setLenId(null);
				dao.saveBusinessObjs(sch);
			}
			dao.commitTransation();
			retObj.setErrorCode(0);
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}
		return retObj;
	}
 //删除栏目
	public void removecol(String objXml) throws Exception {

		IDao dao = getDao();
		try {
			// Element rootEle = doc.getRootElement();
			dao.beginTransation();
			dao.execute("DELETE FROM PPN_CDM_COL_PLAY_PLAN t WHERE t.COL_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.execute("DELETE FROM PPN_CDM_COLUMN_LENGTH t WHERE t.COL_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.execute("DELETE FROM PPN_CDM_COLUMN t WHERE t.COL_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.commitTransation();
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}

	}
//删除频道
	public void removechan(String objXml) throws Exception {

		IDao dao = getDao();
		try {
			// Element rootEle = doc.getRootElement();
			dao.beginTransation();
			dao.execute("DELETE FROM PPN_CDM_COLUMN_LENGTH t WHERE t.COL_ID  IN (select COL_ID from PPN_CDM_COLUMN where COL_CHAN_CODE in (select CHAN_CODE from PPN_CDM_CHANNEL where CHAN_ID in ("+ StringIdsUtils.getSqlIds(objXml) + ")))");
			dao.execute("DELETE FROM PPN_CDM_COL_PLAY_PLAN t WHERE t.COL_ID  IN (select COL_ID from PPN_CDM_COLUMN where COL_CHAN_CODE in (select CHAN_CODE from PPN_CDM_CHANNEL where CHAN_ID in ("+ StringIdsUtils.getSqlIds(objXml) + ")))");
			dao.execute("DELETE FROM PPN_CDM_COLUMN t WHERE t.COL_CHAN_CODE  IN (select CHAN_CODE from PPN_CDM_CHANNEL where CHAN_ID in ("+ StringIdsUtils.getSqlIds(objXml) + "))");
			dao.execute("DELETE FROM PPN_CDM_CHANNEL t WHERE t.CHAN_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			// dao.execute("DELETE FROM PPN_CDM_COLUMN_LENGTH t WHERE t.栏目ID  IN ("+objXml+")");
			dao.commitTransation();
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}

	}

	// 保存播出计划
	public WSResult saveCOLplan(String objXml, WSResult retObj)
			throws Exception {
		IDao dao = getDao();
		try {
			dao.beginTransation();
			PpnCdmColPlayPlan sch = SerializerUtil.deserialize(
					PpnCdmColPlayPlan.class, objXml);
			if (null != sch.getPlanId() && !"".equals(sch.getPlanId())) {
				dao.updateBusinessObjs(true, sch);
			} else {
				sch.setPlanId(null);
				// sch.setLenId(null);
				dao.saveBusinessObjs(sch);
			}
			dao.commitTransation();
			retObj.setErrorCode(0);
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}
		return retObj;
	}

	// 保存文件
	public WSResult savefile(String objXml,String groupid,WSResult retObj) throws Exception
	{
		IDao dao = getDao();
		try
		{
			dao.beginTransation();
			PpnTaskFile sch = SerializerUtil.deserialize(PpnTaskFile.class, objXml);
			String filecode = UUID.randomUUID().toString();
			sch.setFileCreateTime(new Timestamp(System.currentTimeMillis()));
			// 判断视频是否修改
			List<PpnTaskFile> listup = dao.queryBusinessObjs(PpnTaskFile.class,
					" select * from  PPN_TASK_FILE where FILE_LOC_PATH='" + sch.getFileLocPath() + "' and FILE_ID='" + sch.getFileId() + "'");
			String target_path = null;
			// 判断是成品文件
			String filelocpath = sch.getFileLocPath();
			if (sch.getFileClass().equals("2"))
			{
				// 查找目标文件路径
				String path = new SshInfo().dstDir;
				// 根据任务ID 查询节目ID根据节目ID拼接目标路径
				List<PpnPgmProgram> list = dao.queryBusinessObjs(PpnPgmProgram.class,
						" select * from PPN_PGM_PROGRAM  where PGM_ID =(select PGM_ID from PPN_TASK where TASK_ID='" + sch.getTaskId() + "')");
				String pgm_code = list.get(0).getPgmCode();
				// 判断文件原路径中是否有已节目代码命名的文件夹
				if (sch.getFileLocPath().contains(pgm_code + "/Workspace"))
				{
					// 目标路径
					target_path = StringUtils.substringBefore(sch.getFileLocPath(), pgm_code) + pgm_code + "/" + path + "/";
					
				} else
				{
					retObj.setErrorCode(9);
					retObj.setErrorString("选择的文件应在以节目代码+/Workspace命名的文件夹中");
					dao.commitTransation();
					return retObj;
				}
				sch.setFileLocPath(target_path + sch.getFileName());
			}

//			if (null != sch.getFileId() && !"".equals(sch.getFileId()))
//			{
//				// 视频未修改
//				if (listup.size() > 0)
//				{
//					dao.updateBusinessObjs(true, sch);
//				} else
//				{
//					// 判断修改后的视频是否已存在
//					List<PpnTaskFile> list2 = dao.queryBusinessObjs(PpnTaskFile.class,
//							"select * from  PPN_TASK_FILE where FILE_LOC_PATH='" + sch.getFileLocPath()
//									+ "' and FILE_CLASS=" + sch.getFileClass());
//					// 视频存在
//					if (list2.size() > 0)
//					{
//						retObj.setErrorCode(9);
//						retObj.setErrorString("该文件已存在，请重新设置");
//						dao.commitTransation();
//						return retObj;
//					} else
//					{
//						/**
//						 * 判断是否为成品文件，如果是成品文件，将成品文件移动到指定的路径下
//						 */
//						if (sch.getFileClass().equals("2"))
//						{
//
//							String flag = new PpnAssginBusiness().moveFile(sch.getFileLocHost(), filelocpath, target_path);
//							if (flag.equals("OK"))
//							{
//
//							} else
//							{
//								retObj.setErrorCode(9);
//								retObj.setErrorString("移动文件错误:" + flag);
//								dao.rollbackTransation();
//								return retObj;
//							}
//						}
//						dao.updateBusinessObjs(true, sch);
//					}
//				}
//			} else
//			{
				// 查看视频是否存在
				List<PpnTaskFile> listds = dao.queryBusinessObjs(PpnTaskFile.class,
						"select * from  PPN_TASK_FILE where FILE_LOC_PATH='" + sch.getFileLocPath()
								+ "' and FILE_CLASS=" + sch.getFileClass());
				if (listds.size() > 0)
				{
					retObj.setErrorCode(9);
					retObj.setErrorString("该文件已存在，请重新设置");
					dao.commitTransation();
					return retObj;
				} else
				{ 
					sch.setFileCode(filecode);
					sch.setFileId(filecode);
					dao.saveBusinessObjs(sch);
					//将文件保存到文件组
					PpnTaskFileGroup2File ptfg=new PpnTaskFileGroup2File();
					ptfg.setGroupId(groupid);
					ptfg.setFileId(sch.getFileId());
					dao.saveBusinessObjs(ptfg);
					if (sch.getFileClass().equals("2"))
					{
						dao.execute("update  PPN_TASK_PHASE t set PHASE_STATUS =3 WHERE TASK_ID='" + sch.getTaskId() + "' and PHASE_CODE='BIND'");
					}
					/**
					 * 判断是否为成品文件，如果是成品文件，将成品文件移动到指定的路径下
					 */
					if (sch.getFileClass().equals("2"))
					{
						String flag = new PpnAssginBusiness().moveFile(sch.getFileLocHost(), filelocpath, target_path);
						if (flag.equals("OK"))
						{

						} else
						{
							retObj.setErrorCode(9);
							retObj.setErrorString("移动文件错误:" + flag);
							dao.rollbackTransation();
							return retObj;
						}
					}
					retObj.setResultVal(sch.getFileId());
				}
		//	}
			dao.commitTransation();
			retObj.setErrorCode(0);
		} catch (Exception e)
		{
			e.printStackTrace();
			dao.rollbackTransation();
			throw e;
		}
		return retObj;
	}

//删除文件
	public void removeflie(String objXml) throws Exception {

		IDao dao = getDao();
		try {
			// Element rootEle = doc.getRootElement();
			dao.beginTransation();
			List<PpnTaskFile> listds = dao.queryBusinessObjs(PpnTaskFile.class,"select * from  PPN_TASK_FILE where FILE_ID in ("
					+ StringIdsUtils.getSqlIds(objXml) + ") and FILE_CLASS='2'");
			for(int i=0;i<listds.size();i++){
			new PpnAssginBusiness().removeFile(listds.get(i).getFileLocHost(),listds.get(i).getFileLocPath());
			}
			dao.execute("DELETE FROM PPN_TASK_FILE_AV t WHERE t.FILE_ID IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.execute("DELETE FROM PPN_TASK_FILE t WHERE t.FILE_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			
			dao.commitTransation();
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}

	}
//设置编目
	public WSResult savecate(String objXml, WSResult retObj) throws Exception {
		IDao dao = getDao();
		try {
			
			Document doc = DocumentHelper.parseText(objXml);
			Element rootEle = doc.getRootElement();
		    String time = rootEle.element("CATA_WHEN").getText();
			dao.beginTransation();
			PpnTaskFileCata sch = SerializerUtil.deserialize(PpnTaskFileCata.class,
					objXml);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
			 sch.setCataWhen(df.parse(time));
		   if (null != sch.getCataId() && !"".equals(sch.getCataId())) {
				//sch.setCataWhen(Timestamp.valueOf(time));
				dao.updateBusinessObjs(true, sch);
			} else {
			    sch.setCataId(null);
			    //保存编目
				dao.saveBusinessObjs(sch);
				//成品文件设置成品编目
				String file_ids = rootEle.element("CP_IDS").getText();
				String  cata_id=sch.getCataId();
				dao.execute("update  PPN_TASK_FILE t set CATA_ID ="+StringIdsUtils.getSqlIds(cata_id)+" WHERE t.FILE_ID  IN ("
						+ StringIdsUtils.getSqlIds(file_ids)+ ")");
				dao.execute("update PPN_TASK_FILE_CATA set CATA_PGM_CODE =(select PGM_CODE from PPN_PGM_PROGRAM where PGM_ID in(select PGM_ID from PPN_TASK where TASK_ID in (select TASK_ID from PPN_TASK_FILE where FILE_ID in ("+StringIdsUtils.getSqlIds(file_ids)+"))))  where CATA_ID="+StringIdsUtils.getSqlIds(cata_id));
			}
		    dao.commitTransation();
			retObj.setErrorCode(0);
			retObj.setResultVal(sch.getCataId());
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}
		return retObj;
	}

	public WSResult selecttask(String ids, WSResult retObj) throws SQLException {
		IDao dao = getDao();
		//查看视频是否存在
		 List<PpnTaskFile> list = dao.queryBusinessObjs(PpnTaskFile.class," select TASK_ID from  PPN_TASK_FILE where FILE_ID  in ("
				+ StringIdsUtils.getSqlIds(ids) + ")group by  TASK_ID ");
		 if(list.size()>1){
			 retObj.setErrorCode(9);
		     retObj.setErrorString("选中成品文件的所属任务不同，不能进行绑定成品编目");
		     return retObj;
		 }
		 
		return retObj;
	}
//删除编目
	public void removecata(String objXml) throws Exception {

		IDao dao = getDao();
		try {
			// Element rootEle = doc.getRootElement();
			dao.beginTransation();
			
			dao.execute("DELETE FROM PPN_TASK_FILE_CATA_SCENE t WHERE t.CLIP_CATA_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.execute("DELETE FROM PPN_TASK_FILE_CATA_CONTRIBUTOR t WHERE t.CATA_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.execute("DELETE FROM PPN_TASK_FILE_CATA t WHERE t.CATA_ID  IN ("
					+ StringIdsUtils.getSqlIds(objXml) + ")");
			dao.commitTransation();
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}

	}
	//成品文件设置成品编目
	public WSResult savefileAndcata(String objXml, WSResult retObj) throws Exception {
		IDao dao = getDao();
		try {
			
			Document doc = DocumentHelper.parseText(objXml);
			Element rootEle = doc.getRootElement();
		     String file_ids = rootEle.element("FILE_ID").getText();
		     String cata_id=rootEle.element("CATA_ID").getText();
		    dao.beginTransation();
			dao.execute("update  PPN_TASK_FILE t set CATA_ID ="+StringIdsUtils.getSqlIds(cata_id)+" WHERE t.FILE_ID  IN ("
					+ StringIdsUtils.getSqlIds(file_ids)+ ")");
			dao.execute("update PPN_TASK_FILE_CATA set CATA_PGM_CODE =(select PGM_CODE from PPN_PGM_PROGRAM where PGM_ID in(select PGM_ID from PPN_TASK where TASK_ID in (select TASK_ID from PPN_TASK_FILE where FILE_ID in ("+StringIdsUtils.getSqlIds(file_ids)+"))))  where CATA_ID="+StringIdsUtils.getSqlIds(cata_id));
			dao.commitTransation();
			retObj.setErrorCode(0);
			
		} catch (Exception e) {
			dao.rollbackTransation();
			throw e;
		}
		return retObj;
	}
	
	
	//设置节目编目
		public WSResult savepgmcate(String objXml, WSResult retObj) throws Exception {
			IDao dao = getDao();
			try {
				
				Document doc = DocumentHelper.parseText(objXml);
				Element rootEle = doc.getRootElement();
			    String time = rootEle.element("CATA_WHEN").getText();
				dao.beginTransation();
				PpnPgmCata sch = SerializerUtil.deserialize(PpnPgmCata.class,
						objXml);
				PpnPgmCataContributor canyu = SerializerUtil.deserialize(PpnPgmCataContributor.class,
						objXml);
				
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				 sch.setCataWhen(df.parse(time));
				 sch.setCataTime(new Timestamp(System.currentTimeMillis()).toString());
			   if (null != sch.getCataId() && !"".equals(sch.getCataId())) {
				   dao.updateBusinessObjs(true, sch);
				} else {
				    sch.setCataId(null);
				    //保存编目
				    dao.saveBusinessObjs(sch);
				    canyu.setCataId(sch.getCataId());
				    dao.saveBusinessObjs(canyu);
					dao.execute("update  PPN_TASK_PHASE t set PHASE_STATUS =3 WHERE TASK_ID=(select TASK_ID from PPN_TASK where PGM_ID='"+sch.getPgmId()+"') and PHASE_CODE='CATA'");
				}
			    dao.commitTransation();
				retObj.setErrorCode(0);
				retObj.setResultVal(sch.getCataId());
			} catch (Exception e) {
				dao.rollbackTransation();
				throw e;
			}
			return retObj;
		}	
	
		//删除节目编目
		public void removepgmcata(String objXml) throws Exception {
             IDao dao = getDao();
			try {
				// Element rootEle = doc.getRootElement();
				dao.beginTransation();
				dao.execute("DELETE FROM PPN_PGM_CATA_CONTRIBUTOR t WHERE t.CATA_ID IN ("
						+ StringIdsUtils.getSqlIds(objXml) + ")");
				dao.execute("DELETE FROM PPN_PGM_CATA t WHERE t.CATA_ID  IN ("
						+ StringIdsUtils.getSqlIds(objXml) + ")");

				dao.commitTransation();
			} catch (Exception e) {
				dao.rollbackTransation();
				throw e;
			}

		}
	
		public WSResult getselectTj(String group_type,String startdate,String enddate,WSResult retObj) throws Exception
		{
			String res = "";
			try
			{
				//convertTimeToLong
				IDao dao = DaoFactory.getPpnCommonDao();
				StringBuffer querySb = new StringBuffer();
				querySb.append(" select sum(t.group_duration) GROUP_DURATION,  get_control_word_name('PPN_TASK_FILEGROUP','GROUP_MEDIA_TYPE',t.GROUP_MEDIA_TYPE) as GROUP_TJNAME from PPN_TASK_FILEGROUP t where 1=1 ");
				if(null!=group_type&&!"".equals(group_type)){
					querySb.append(" and t.GROUP_TYPE="+group_type+" ");
				}
				if(null!=startdate&&!"".equals(startdate)){
					querySb.append(" and  to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')>='"+startdate+"' ");
				}
				if(null!=startdate&&!"".equals(startdate)){
					querySb.append(" and  to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')<='"+enddate+"' ");
				}
					querySb.append(" group by GROUP_MEDIA_TYPE ");
					//来源统计
//					querySb.append(" union all ");
//					querySb.append(" select sum(t.group_duration) GROUP_DURATION,'源系统-'|| t.GROUP_SOURCE as GROUP_TJNAME  from PPN_TASK_FILEGROUP t where 1=1");
//					if(null!=group_type&&!"".equals(group_type)){
//					querySb.append(" and  t.GROUP_TYPE="+group_type+" ");
//				}
//				if(null!=startdate&&!"".equals(startdate)){
//					querySb.append(" and to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')>='"+startdate+"' ");
//				}
//				if(null!=startdate&&!"".equals(startdate)){
//					querySb.append(" and to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')<='"+enddate+"' ");
//				}
//				querySb.append(" group by GROUP_SOURCE ");
				
//				//素材统计
//					querySb.append(" union all ");
//					querySb.append(" select sum(t.group_duration) GROUP_DURATION,decode(t.GROUP_TYPE,1,'素材总时长','成品总时长') as GROUP_TJNAME  from PPN_TASK_FILEGROUP t where 1=1 ");
//				if(null!=group_type&&!"".equals(group_type)){
//					querySb.append(" and t.GROUP_TYPE="+group_type+" ");
//				}
//				if(null!=startdate&&!"".equals(startdate)){
//					querySb.append(" and  to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')>='"+startdate+"' ");
//				}
//				if(null!=startdate&&!"".equals(startdate)){
//					querySb.append(" and  to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')<='"+enddate+"' ");
//				}
//				querySb.append(" group by GROUP_TYPE ");
				Document doc = dao.fill(querySb.toString());
				
				res = doc.asXML();
				retObj.setResultVal(res);
			} catch (Exception e)
			{
				e.printStackTrace();
				throw new Exception("获取任务列表异常", e);
			}
			return retObj;
		}
		
		
		public WSResult selectTjSource(String group_type,String startdate,String enddate,WSResult retObj) throws Exception
		{
			String res = "";
			try
			{
				//convertTimeToLong
				IDao dao = DaoFactory.getPpnCommonDao();
				StringBuffer querySb = new StringBuffer();
			

					querySb.append(" select sum(t.group_duration) GROUP_DURATION,'源系统-'|| t.GROUP_SOURCE as GROUP_TJNAME  from PPN_TASK_FILEGROUP t where 1=1");
					if(null!=group_type&&!"".equals(group_type)){
					querySb.append(" and  t.GROUP_TYPE="+group_type+" ");
				}
				if(null!=startdate&&!"".equals(startdate)){
					querySb.append(" and to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')>='"+startdate+"' ");
				}
				if(null!=startdate&&!"".equals(startdate)){
					querySb.append(" and to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')<='"+enddate+"' ");
				}
				querySb.append(" group by GROUP_SOURCE ");
				
//				//素材统计
//					querySb.append(" union all ");
//					querySb.append(" select sum(t.group_duration) GROUP_DURATION,decode(t.GROUP_TYPE,1,'素材总时长','成品总时长') as GROUP_TJNAME  from PPN_TASK_FILEGROUP t where 1=1 ");
//				if(null!=group_type&&!"".equals(group_type)){
//					querySb.append(" and t.GROUP_TYPE="+group_type+" ");
//				}
//				if(null!=startdate&&!"".equals(startdate)){
//					querySb.append(" and  to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')>='"+startdate+"' ");
//				}
//				if(null!=startdate&&!"".equals(startdate)){
//					querySb.append(" and  to_char(t.GROUP_CREATE_TIME,'yyyy-mm-dd')<='"+enddate+"' ");
//				}
//				querySb.append(" group by GROUP_TYPE ");
				Document doc = dao.fill(querySb.toString());
				
				res = doc.asXML();
				retObj.setResultVal(res);
			} catch (Exception e)
			{
				e.printStackTrace();
				throw new Exception("获取任务列表异常", e);
			}
			return retObj;
		}
}
