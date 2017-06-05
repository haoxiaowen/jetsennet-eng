package jetsennet.jue2.business;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.business.Business;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jue2.beans.PpnPgmProgram;
import jetsennet.jue2.beans.PpnTransDs;
import jetsennet.jue2.beans.PpnTransDsUser;
import jetsennet.jue2.beans.PpnTransDsMedia;
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
 * @version 直送通知单
 * 
 */
@SuppressWarnings("unused")
public class PPNtransDsBusiness extends BaseBusiness
{
	protected Logger logger = Logger.getLogger(PPNtransDsBusiness.class);
	/**
	 * @param id
	 * @return  String
	 * 功能：  查询表格     直送协调人
	 */
	public String createTransDsUserById(String id) throws Exception {
		String sql="SELECT b.user_id,b.ds_id,b.user_code,b.user_name,b.user_role,b.user_tel"
				+ ",b.user_mobile_tel FROM PPN_TRANS_DS_USER b"
				+ "  WHERE b.DS_ID= '"+id+"'";
		Document fill = getDao().fill(sql);
	    return fill.asXML();
		
	}
	/**
	 * 功能：  查询表格 PPN_TRANS_DS_MEDIA 直送介质
	 */
	public String createTransDsMediaById(String id) throws Exception {
		String sql="SELECT c.media_id,c.ds_id,c.media_seg_index,c.media_code"
				
				+ " FROM PPN_TRANS_DS_MEDIA c WHERE c.DS_ID='"+id+"'";
		
		Document fill = getDao().fill(sql);
	    return fill.asXML();
	}
	
	@SuppressWarnings("unchecked")
	@Business(trans = false, log = false)
	public int insertObjecsPpn(String xml) throws Exception {
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		
		Element transDs = elements.get(0);
		
		Element transDsUser = elements.get(1);
		
		Element transDsMedia = elements.get(2);
		
		String replaceDs = transDs.asXML().replaceAll("TABLE","PPN_TRANS_DS");
		
		String replaceDsUser = transDsUser.asXML().replaceAll("TABLE","PPN_TRANS_DS_USER");
		
		String replaceDsMedia = transDsMedia.asXML().replaceAll("TABLE","PPN_TRANS_DS_MEDIA");
		
		PpnTransDsMedia ppnTransDsMedia = SerializerUtil.deserialize(PpnTransDsMedia.class, replaceDsMedia);
		
		PpnTransDs ppnTransDs = SerializerUtil.deserialize(PpnTransDs.class, replaceDs);
		
		//设置系统当前时间的
		ppnTransDs.setDsCreateTime(new Timestamp(System.currentTimeMillis()));
		
		PpnTransDsUser ppntransDsUser = SerializerUtil.deserialize(PpnTransDsUser.class, replaceDsUser);
		
		int saveBusinessObjs = getDao().saveBusinessObjs(ppnTransDs);
		if(saveBusinessObjs==-2){
			String ds_ID = ppnTransDs.getDsId();
			//=============
			ppntransDsUser.setDsId(ds_ID);
			getDao().saveBusinessObjs(ppntransDsUser);
			ppnTransDsMedia.setDsId(ds_ID);
			int c = getDao().saveBusinessObjs(ppnTransDsMedia);
			return c;
		}
		return 0;
	}
	
	//=========================================================================
	
	public String createObjecsDsOrUserOrMedia(String id) throws Exception {
		
		String sql="select a.ds_id,a.ds_code,a.ds_channel_code,a.ds_play_date,a.ds_play_time"
				
				+ ",a.ds_column_code,a.ds_pgm_code,a.ds_pgm_audio,a.ds_pgm_subtitle,a.ds_pgm_name"
				
				+ ",a.ds_pgm_seg_sum,a.ds_type,a.ds_reason,a.ds_comment"
				
				+ ",a.ds_create_time,a.ds_create_type,a.ds_field1"
				
				+ ",b.user_code,b.user_name,b.user_role,b.user_tel,b.user_mobile_tel,b.user_id"
																				
				+ ",c.media_id,c.media_seg_index,c.media_code"
				
				+ " from ppn_trans_ds a left join ppn_trans_ds_user  b  on a.DS_ID=b.ds_id "
				
				+ " left join ppn_trans_ds_media  c  on a.ds_id = c.ds_id  WHERE a.ds_id='"+id+"'";
		
		Document fill = getDao().fill(sql);
	    return fill.asXML();
	}
	
	
	@SuppressWarnings("unchecked")
	public int updataObjecsDsOrUserOrMedia(String xml) throws Exception {
		IDao dao =getDao();
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		
		Element transDs = elements.get(0);
		Element transDsUser = elements.get(1);
		Element transDsMedia = elements.get(2);
		dao.beginTransation();
		String replaceDs = transDs.asXML().replaceAll("TABLE","PPN_TRANS_DS");
		String replaceDsUser = transDsUser.asXML().replaceAll("TABLE","PPN_TRANS_DS_USER");
		String replaceDsMedia = transDsMedia.asXML().replaceAll("TABLE","PPN_TRANS_DS_MEDIA");
		
		PpnTransDsMedia ppnTransDsMedia = SerializerUtil.deserialize(PpnTransDsMedia.class, replaceDsMedia);
		PpnTransDs ppnTransDs = SerializerUtil.deserialize(PpnTransDs.class, replaceDs);
		PpnTransDsUser ppntransDsUser = SerializerUtil.deserialize(PpnTransDsUser.class, replaceDsUser);
		
		   
		   dao.updateBusinessObjs(true,ppntransDsUser);
		   dao.updateBusinessObjs(true,ppnTransDsMedia);
		   dao.updateBusinessObjs(true,ppnTransDs);
		   dao.commitTransation();
			
		
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
		getDao().execute("DELETE FROM PPN_TRANS_DS_USER ds WHERE ds.DS_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_TRANS_DS_MEDIA dt WHERE dt.DS_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_TRANS_DS mt WHERE mt.DS_ID IN("+substring+")");
		getDao().commitTransation();
		return ids;
	}
	/**
	 * zjb  201612-31
	 * @param stateTime
	 * @param endTime
	 * @return
	 * @throws Exception
	 */
	public String selectTj(String stateTime,String endTime) throws Exception {
		IDao dao =getDao();
		String sateTimes=stateTime+" 00:00:00";
		String endTimes=stateTime+" 23:59:59";
		StringBuffer querySb = new StringBuffer();
		querySb.append(" select  sum(ITEM_OBJ_UOM_SUM) sums,ITEM_OBJ_TYPE objType from ( SELECT t.* FROM PPN_RENT_IN_ITEM t INNER JOIN PPN_RENT_RETURN au ON t.RETU_ID = au.RETU_ID WHERE (au.RETU_TIME >= to_date('"+sateTimes+"','YYYY-MM-DD HH24:MI:SS')) AND (au.RETU_TIME <= to_date('"+endTimes+"','YYYY-MM-DD HH24:MI:SS')) ) GROUP by  ITEM_OBJ_TYPE  ");
		querySb.append(" union all ");
		querySb.append(" select sum(ITEM_OBJ_UOM_SUM) sums ,'单元总数' objType from ( SELECT t.* FROM PPN_RENT_IN_ITEM t INNER JOIN PPN_RENT_RETURN au ON t.RETU_ID = au.RETU_ID WHERE (au.RETU_TIME >= to_date('"+sateTimes+"','YYYY-MM-DD HH24:MI:SS')) AND (au.RETU_TIME <= to_date('"+endTimes+"','YYYY-MM-DD HH24:MI:SS')) ) where 1=1");
		querySb.append(" union all ");
		querySb.append(" select count(*)  sums,'设备总数' objType from  ( SELECT t.* FROM PPN_RENT_IN_ITEM t INNER JOIN PPN_RENT_RETURN au ON t.RETU_ID = au.RETU_ID WHERE (au.RETU_TIME >= to_date('"+sateTimes+"','YYYY-MM-DD HH24:MI:SS')) AND (au.RETU_TIME <= to_date('"+endTimes+"','YYYY-MM-DD HH24:MI:SS')) ) where 1=1");
		querySb.append(" union all ");
		querySb.append(" select count(*) sums,  ITEM_OBJ_TYPE  objType from  ( SELECT t.* FROM PPN_RENT_IN_ITEM t INNER JOIN PPN_RENT_RETURN au ON t.RETU_ID = au.RETU_ID WHERE (au.RETU_TIME >= to_date('"+sateTimes+"','YYYY-MM-DD HH24:MI:SS')) AND (au.RETU_TIME <= to_date('"+endTimes+"','YYYY-MM-DD HH24:MI:SS')) ) GROUP by ITEM_OBJ_TYPE");
		/*String sqlobjNum ="select  sum(ITEM_OBJ_UOM_SUM) sums,ITEM_OBJ_TYPE objType from ( SELECT t.* FROM PPN_RENT_IN_ITEM t INNER JOIN PPN_RENT_RETURN au ON t.RETU_ID = au.RETU_ID WHERE (au.RETU_TIME >= to_date('"+sateTimes+"','YYYY-MM-DD HH24:MI:SS')) " +
				"AND (au.RETU_TIME <= to_date('"+endTimes+"','YYYY-MM-DD HH24:MI:SS')) ) GROUP by  ITEM_OBJ_TYPE union all ";*/
	    Document fill = dao.fill(querySb.toString());
		return fill.asXML();
	}
}
