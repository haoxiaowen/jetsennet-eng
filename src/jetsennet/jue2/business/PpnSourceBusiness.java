package jetsennet.jue2.business;

import java.util.List;
import java.util.UUID;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jcom.util.StringIdsUtils;
import jetsennet.jdlm.beans.PpnRentCheck;
import jetsennet.jdlm.beans.PpnRentOut;
import jetsennet.jdlm.beans.PpnRentOutItem;
import jetsennet.juum.schema.User;
import jetsennet.net.WSResult;
import jetsennet.util.SerializerUtil;

import org.apache.commons.lang.StringUtils;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;

/**
 * 任务分配管理
 */
public class PpnSourceBusiness extends BaseBusiness
{
	
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
	
}
