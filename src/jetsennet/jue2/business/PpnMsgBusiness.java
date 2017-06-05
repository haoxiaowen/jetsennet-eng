package jetsennet.jue2.business;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.business.Business;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jcom.bean.PpnWslog;
import jetsennet.jcom.bean.PpnWslogdata;
import jetsennet.jue2.beans.PpnMsg;
import jetsennet.jue2.beans.PpnMsgReceive;
import jetsennet.jue2.beans.PpnPgmProgram;
import jetsennet.jue2.beans.PpnTransDs;
import jetsennet.jue2.beans.PpnTransDsUser;
import jetsennet.jue2.beans.PpnTransDsMedia;
import jetsennet.jue2.beans.PpnTransMdt;
import jetsennet.jue2.beans.PpnTsbTask;
import jetsennet.jue2.beans.TransMdtDest;
import jetsennet.jue2.beans.TransMdtUser;
import jetsennet.juum.schema.User;
import jetsennet.juum.schema.Usertorole;
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
public class PpnMsgBusiness extends BaseBusiness
{
	protected Logger logger = Logger.getLogger(PpnMsgBusiness.class);
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
		
		Element log = elements.get(0);
		Element logdata = elements.get(1);

		dao.beginTransation();
		String replaceDs = log.asXML().replaceAll("TABLE","PPN_WSLOG");
		String replaceDsUser = logdata.asXML().replaceAll("TABLE","PPN_WSLOGDATA");

		

		PpnWslog ppnTransDs = SerializerUtil.deserialize(PpnWslog.class, replaceDs);
		PpnWslogdata ppntransDsUser = SerializerUtil.deserialize(PpnWslogdata.class, replaceDsUser);
		   dao.updateBusinessObjs(true,ppntransDsUser);
		   dao.updateBusinessObjs(true,ppnTransDs);
		   dao.commitTransation();
		return 0;
	}
	public int sendmsg(String id,String msgsendto) throws Exception {
		
		String id_s="";
		String[] split = msgsendto.split(",");
		getDao().beginTransation();
		getDao().execute("UPDATE PPN_MSG ds SET ds.MSG_STATUS= 2 WHERE ds.MSG_ID ='"+id+"'");
		for (int i = 0; i < split.length; i++) {
		PpnMsgReceive mr=new PpnMsgReceive();
		mr.setMsgId(id);
		mr.setRecUser(split[i]);
		mr.setRecStatus(1);
		mr.setRecTime(new Date());
		mr.setRecRead(0);
		mr.setRecStick(0);
		getDao().saveBusinessObjs(mr);
		}		
		getDao().commitTransation();
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
	
	public String getusers(String xml)throws Exception{
		Document doc = DocumentHelper.parseText(xml);		
		PpnMsg ppnMsg = SerializerUtil.deserialize(PpnMsg.class, doc);
		String ids=ppnMsg.getMsgSendTo();
		String[] split = ids.split(",");
		String XML="<RecordSet>";
		for (int i = 0; i < split.length; i++) {
			List<User> userlist = getDao().queryBusinessObjs(User.class, "SELECT t.ID , t.USER_NAME FROM UUM_USER t WHERE t.ID='"+split[i]+"'");
			
		  //  Document fill = getDao().fill("SELECT t.ID , t.USER_NAME FROM UUM_USER t WHERE t.ID='"+split[i]+"'");
		    XML+="<Record><ID>"+userlist.get(0).getId()+"</ID><NAME>"+userlist.get(0).getUserName()+"</NAME></Record>";
		}				
		return XML+"</RecordSet>";
	}
	
	public String getRoleToUser(String id)throws Exception{
		
		String XML="<RecordSet>";
		
			List<Usertorole> urlist = getDao().queryBusinessObjs(Usertorole.class, "SELECT * FROM UUM_USERTOROLE t WHERE t.ROLE_ID='"+id+"'");
			for(int i=0;i<urlist.size();i++){
				List<User> u=getDao().queryBusinessObjs(User.class, "SELECT * FROM UUM_USER t WHERE t.ID='"+urlist.get(i).getUserId()+"'");
				XML+="<Record><ID>"+u.get(0).getId()+"</ID><NAME>"+u.get(0).getUserName()+"</NAME></Record>";
			}
		
		return XML+"</RecordSet>";
	}
	
	public String deleteMsg(String ids) throws Exception {
		String id_s="";
		String[] split = ids.split(",");
		for (int i = 0; i < split.length; i++) {
			id_s += ","+"'"+split[i]+"'";
		}
		String substring = id_s.substring(1);
		getDao().beginTransation();
		getDao().execute("UPDATE PPN_MSG  t SET t.MSG_STATUS=3 WHERE t. MSG_ID  IN("+substring+")");
		getDao().commitTransation();
		return ids;
	}
}
 