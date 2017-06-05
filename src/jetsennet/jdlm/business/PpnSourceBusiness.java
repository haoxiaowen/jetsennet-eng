package jetsennet.jdlm.business;

import java.util.List;
import java.util.Map;
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
	 * 保存资源出库单并提交审核
	 * */
	public String submitSource(String outid,WSResult retObj)throws Exception{
		IDao dao = getDao();
		String retVal = "OK";
			dao.beginTransation();
			String[] outId = outid.split(",");
			String[] itemStr = new String[outId.length];
			for(int i = 0;i<outId.length;i++){
				itemStr[i] = new StringBuilder().append("'").append(outId[i]).append("'").toString();
			}
			List<PpnRentOut> proilist =getDao().queryBusinessObjs(PpnRentOut.class, "SELECT t.* FROM PPN_RENT_OUT t WHERE t.out_id IN ("+StringUtils.join(itemStr,",")+") ");
			try{
				for(int i = 0;i<proilist.size();i++){
					PpnRentCheck ppr = new PpnRentCheck();
					ppr.setCheckId(UUID.randomUUID().toString());
					ppr.setCheckObjCode((proilist.get(i)).getOutCode());
					ppr.setCheckStatus((proilist.get(i)).getOutStatus());
					ppr.setCheckObjType(2);
					dao.saveBusinessObjs(ppr);
				}
					dao.commitTransation();
					retVal = "OK";
			}catch(Exception e){
				e.printStackTrace();
				retVal = "Error";
			}
		return retVal;
	}
	
	/**
	 * 提交审核
	 * */
	public String exeSubmit(String outCode,String outStatus,WSResult retObj)throws Exception{
		IDao dao = getDao();
		String retVal = "OK";
			dao.beginTransation();
			try{
					PpnRentCheck ppr = new PpnRentCheck();
					ppr.setCheckId(UUID.randomUUID().toString());
					ppr.setCheckObjCode(outCode);
					ppr.setCheckStatus(Integer.parseInt(outStatus));
					ppr.setCheckObjType(2);
					dao.saveBusinessObjs(ppr);
					
					String objSql = "select p.item_obj_code from PPN_RENT_OUT t left join PPN_RENT_OUT_ITEM p on t.out_id = p.out_id where t.out_code = '"+outCode+"'";
					List<Map<String,Object>> list = getDao().queryForListMap(objSql.toString());
					/*修改对象状态*/
					if(list.size()>0){
						for(int i = 0;i<list.size();i++){
							StringBuilder updateObj = new StringBuilder("update PPN_RENT_OBJ t ");
							updateObj.append("set t.OBJ_STATUS = '6' ");//执行状态（1-在库，2-保养，3-维修，4-报废，5-丢失，6-出库，7-预约）
							updateObj.append("where t.OBJ_CODE = '").append((list.get(i)).get("ITEM_OBJ_CODE")).append("'");
							getDao().execute(updateObj.toString());
						}
					}
					dao.commitTransation();
					retVal = "OK";
			}catch(Exception e){
				e.printStackTrace();
				retVal = "Error";
			}
		return retVal;
	}
	
	/**
	 * 更改资源状态
	 * */
	public String submitSour(String outCode,String outStatus,WSResult retObj)throws Exception{
		IDao dao = getDao();
		String retVal = "OK";
			dao.beginTransation();
			try{
					String objSql = "select p.ITEM_CODE from PPN_RENT_OUT t left join PPN_RENT_OUT_ITEM p on t.out_id = p.out_id where t.out_code = '"+outCode+"'";
					List<Map<String,Object>> list = getDao().queryForListMap(objSql.toString());
					/*修改对象状态*/
					if(list.size()>0){
						for(int i = 0;i<list.size();i++){
							StringBuilder updateObj = new StringBuilder("update PPN_RENT_OBJ t ");
							updateObj.append("set t.OBJ_STATUS = '6' ");//执行状态（1-在库，2-保养，3-维修，4-报废，5-丢失，6-出库，7-预约）
							updateObj.append("where t.OBJ_CODE = '").append((list.get(i)).get("ITEM_CODE")).append("'");
							getDao().execute(updateObj.toString());
						}
					}
					dao.commitTransation();
					retVal = "OK";
			}catch(Exception e){
				e.printStackTrace();
				retVal = "Error";
			}
		return retVal;
	}
	
}
