package jetsennet.jue2.business;


import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.business.Business;
import jetsennet.jue2.beans.PpnPgmProgram;
import jetsennet.jue2.beans.PpnTransMdt;
import jetsennet.jue2.beans.PpnTsbTask;
import jetsennet.jue2.beans.TransMdtDest;
import jetsennet.jue2.beans.TransMdtUser;
import jetsennet.util.SerializerUtil;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

/**
 * 通用业务类
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">zjb</a>
 * @version 媒体协调阿
 * 
 * 
 * 
 */
@SuppressWarnings("unused")
public class PPNtransMadtBusiness extends BaseBusiness
{
	protected Logger logger = Logger.getLogger(PPNtransMadtBusiness.class);
	/**
	 * @param id
	 * @return  String
	 * 功能：  查询表格 协调人
	 * 
	 */
	public String createTransDsUserById(String id) throws Exception {
		String sql="SELECT b.user_id,b.mdt_id,b.user_code,b.user_name,b.user_role,b.user_tel"
				+ ",b.user_mobile_tel FROM PPN_TRANS_MDT_USER b"
				+ "  WHERE b.MDT_ID= '"+id+"'";
		Document fill = getDao().fill(sql);
	    return fill.asXML();
		
	}
	/**
	 * @param id
	 * @return  String
	 * 功能：  查询表格 PPN_TRANS_MDT_DEST 系统
	 * 
	 */
	public String createTransMdtDestById(String id) throws Exception {
		String sql="SELECT c.dest_id,c.mdt_id,c.dest_sys_code,c.dest_column_code,c.dest_column_name,"
				+ "c.dest_pgm_code,c.dest_pgm_audio,c.dest_pgm_subtitle,c.dest_pgm_name,"
				+ "c.dest_prod_task_code,c.dest_field1,c.dest_studio_dev_code,"
				+ "c.dest_studio_dev_name FROM PPN_TRANS_MDT_DEST c WHERE c.MDT_ID='"+id+"'";
		Document fill = getDao().fill(sql);
	    return fill.asXML();
	}
	@SuppressWarnings("unchecked")
	@Business(trans = false, log = false)
	public int insertObjecsPpn(String xml) throws Exception {
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		Element transMdt = elements.get(0);
		Element transDsUser = elements.get(1);
		Element transMdtDest = elements.get(2);
		String replaceMdt = transMdt.asXML().replaceAll("TABLE","PPN_TRANS_MDT");
		String replaceDsUser = transDsUser.asXML().replaceAll("TABLE","PPN_TRANS_MDT_USER");
		String replaceMdtDest = transMdtDest.asXML().replaceAll("TABLE","PPN_TRANS_MDT_DEST");
		TransMdtDest ppnTransMdtDest = SerializerUtil.deserialize(TransMdtDest.class, replaceMdtDest);
		PpnTransMdt ppnTransMdt = SerializerUtil.deserialize(PpnTransMdt.class, replaceMdt);
		//设置系统当前时间的
		ppnTransMdt.setMdtCreateTime(new Timestamp(System.currentTimeMillis()));
		TransMdtUser transMdtUser = SerializerUtil.deserialize(TransMdtUser.class, replaceDsUser);
		int saveBusinessObjs = getDao().saveBusinessObjs(ppnTransMdt);
		if(saveBusinessObjs==-2){
			String mdt_ID = ppnTransMdt.getMdtId();
			transMdtUser.setMdtId(mdt_ID);
			getDao().saveBusinessObjs(transMdtUser);
			ppnTransMdtDest.setMdtId(mdt_ID);
			int c = getDao().saveBusinessObjs(ppnTransMdtDest);
			return c;
		}
		return 0;
	}
	public String createObjecsMdOrUserOrDest(String id) throws Exception {
		String sql="select a.mdt_id,a.mdt_code,a.mdt_src_sys_code,a.mdt_begin_date,a.mdt_begin_time"
				+ ",a.mdt_end_date,a.mdt_column_code,a.mdt_column_name,a.mdt_pgm_code,a.mdt_pgm_audio"
				+ ",a.mdt_pgm_subtitle,a.mdt_pgm_name,a.mdt_studio_dev_code,a.mdt_studio_dev_name"
				+ ",a.mdt_prod_task_code,a.mdt_create_time,a.mdt_create_time,a.mdt_create_type,a.mdt_field1"
				+ ",b.user_id,b.mdt_id,b.user_code,b.user_name,b.user_role,b.user_tel,b.user_mobile_tel"
				+ ",c.dest_id,c.mdt_id,c.dest_sys_code,c.dest_column_code,c.dest_column_name,"
				+ "c.dest_pgm_code,c.dest_pgm_audio,c.dest_pgm_subtitle,c.dest_pgm_name,"
				+ "c.dest_prod_task_code,c.dest_field1,c.dest_studio_dev_code,c.dest_studio_dev_name"
				+ " from ppn_trans_mdt a left join ppn_trans_mdt_user  b  on a.MDT_ID=b.mdt_id "
				+ " left join ppn_trans_mdt_dest  c  on a.mdt_id = c.mdt_id  WHERE a.mdt_id='"+id+"'";
		Document fill = getDao().fill(sql);
	    return fill.asXML();
	}
	@SuppressWarnings("unchecked")
	public int updataObjecsMdsOrUserOrDest(String xml) throws Exception {
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		Element transMdt = elements.get(0);
		Element transDsUser = elements.get(1);
		Element transMdtDest = elements.get(2);
		String replaceMdt = transMdt.asXML().replaceAll("TABLE","PPN_TRANS_MDT");
		String replaceDsUser = transDsUser.asXML().replaceAll("TABLE","PPN_TRANS_MDT_USER");
		String replaceMdtDest = transMdtDest.asXML().replaceAll("TABLE","PPN_TRANS_MDT_DEST");
		TransMdtDest ppnTransMdtDest = SerializerUtil.deserialize(TransMdtDest.class, replaceMdtDest);
		PpnTransMdt ppnTransMdt = SerializerUtil.deserialize(PpnTransMdt.class, replaceMdt);
		TransMdtUser transMdtUser = SerializerUtil.deserialize(TransMdtUser.class, replaceDsUser);
		int saveBusinessObjs = getDao().updateBusinessObjs(true,ppnTransMdt);
		if(saveBusinessObjs==-2){
			String mdt_ID = ppnTransMdt.getMdtId();
			transMdtUser.setMdtId(mdt_ID);
			getDao().updateBusinessObjs(true,transMdtUser);
			ppnTransMdtDest.setMdtId(mdt_ID);
			int c = getDao().updateBusinessObjs(true,ppnTransMdtDest);
			return c;
		}
		
		return 0;
	}
	public String deleteObjecsAllMUD(String ids) throws Exception {
		String id_s="";
		String[] split = ids.split(",");
		for (int i = 0; i < split.length; i++) {
			id_s += ","+"'"+split[i]+"'";
		}
		String substring = id_s.substring(1);
		getDao().beginTransation();
		getDao().execute("DELETE FROM PPN_TRANS_MDT_USER ds WHERE ds.MDT_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_TRANS_MDT_DEST dt WHERE dt.MDT_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_TRANS_MDT mt WHERE mt.MDT_ID IN("+substring+")");
		getDao().commitTransation();
		return ids;
	}
}
