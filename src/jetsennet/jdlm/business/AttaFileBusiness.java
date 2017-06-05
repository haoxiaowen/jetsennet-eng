package jetsennet.jdlm.business;

import java.sql.SQLException;
import java.util.List;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.business.Business;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jdlm.beans.PpnDevMaint;
import jetsennet.jdlm.beans.PpnRentFile;
import jetsennet.jdlm.beans.PpnRentMaint2Obj;
import jetsennet.jdlm.beans.PpnRentOrdAttach;
import jetsennet.jdlm.beans.PpnRentOutAttach;
import jetsennet.jdlm.beans.PpnRentReturnAttach;
import jetsennet.jue2.beans.PpnMsg;
import jetsennet.util.SerializerUtil;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;


@SuppressWarnings("unused")
public class AttaFileBusiness extends BaseBusiness
{
	protected Logger logger = Logger.getLogger(AttaFileBusiness.class);
	
	
	@SuppressWarnings("unchecked")
	@Business(trans = false, log = false)
	/**
	 * 新增文件，附件关系表
	 * @param xml
	 * @param code
	 * @param type
	 * @param codestyle
	 * @return
	 * @throws SQLException
	 */
	public int insertObjecsPpn(String xml,String code,int type,int codestyle) throws SQLException {
		int result=0;
		IDao dao=getDao();
		try {
			dao.beginTransation();
			Document doc = DocumentHelper.parseText(xml);
			Element rootElement = doc.getRootElement();
			List<Element> elements = rootElement.elements("TABLE");
			for(int i=0;i<elements.size();i++){
				String replaceDs = elements.get(i).asXML().replaceAll("TABLE","PPN_RENT_FILE"); 
				PpnRentFile rentFile=SerializerUtil.deserialize(PpnRentFile.class, replaceDs);
				getDao().saveBusinessObjs(rentFile);			
				if(codestyle==1){//申请单
				PpnRentOrdAttach or = new PpnRentOrdAttach();
				or.setFileId(rentFile.getFileId());
				or.setOrdId(code);
				or.setAttaType(type);
				or.setAttaStatus(1);
				dao.saveBusinessObjs(or);	
			}
				else if(codestyle==2){//出库单
					PpnRentOutAttach or = new PpnRentOutAttach();
					or.setFileId(rentFile.getFileId());
					or.setOutId(code);
					or.setAttaType(type);
					or.setAttaStatus(1);
					dao.saveBusinessObjs(or);	
					}
				else{
					PpnRentReturnAttach or = new PpnRentReturnAttach();
					or.setFileId(rentFile.getFileId());
					or.setRetuId(code);
					or.setAttaType(type);
					or.setAttaStatus(1);
					dao.saveBusinessObjs(or);	
				}
				}
			dao.commitTransation();
		} catch (SQLException e) {
			dao.rollbackTransation();
			result=-1;
			e.printStackTrace();
		} catch (DocumentException e) {			
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 编辑附件
	 * @param xml
	 * @param type
	 * @param codestyle
	 * @return
	 * @throws SQLException
	 */
	public int update(String xml ,int type,int codestyle) throws SQLException {
		int result=0;
		IDao dao=getDao();
		try {
			dao.beginTransation();
			Document doc = DocumentHelper.parseText(xml);
			Element rootElement = doc.getRootElement();
			List<Element> elements = rootElement.elements("TABLE");
			for(int i=0;i<elements.size();i++){
				String replaceDs = elements.get(0).asXML().replaceAll("TABLE","PPN_RENT_FILE");
				PpnRentFile rentFile=SerializerUtil.deserialize(PpnRentFile.class, replaceDs);
				dao.updateBusinessObjs(true, rentFile);			
				if(codestyle==1){//申请单
				PpnRentOrdAttach or = new PpnRentOrdAttach();
				or.setFileId(rentFile.getFileId());			
				or.setAttaType(type);
				dao.updateBusinessObjs(true, or);
			}
				else if(codestyle==2){//出库单
					PpnRentOutAttach or = new PpnRentOutAttach();
					or.setFileId(rentFile.getFileId());					
					or.setAttaType(type);				
					dao.updateBusinessObjs(true, or);
					}
				else{
					PpnRentReturnAttach or = new PpnRentReturnAttach();
					or.setFileId(rentFile.getFileId());
					or.setAttaType(type);
					dao.updateBusinessObjs(true, or);
				}
				}
			dao.commitTransation();
		} catch (SQLException e) {
			dao.rollbackTransation();
			result=-1;
			e.printStackTrace();
		} catch (DocumentException e) {			
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 删除附件
	 * @param ids
	 * @param codestyle
	 * @return
	 * @throws SQLException
	 */
	public int delete(String ids,int codestyle) throws SQLException{
		IDao dao =getDao();
		String id_s="";
		 int retval = -1;
		String[] split = ids.split(",");
		for (int i = 0; i < split.length; i++) {
			id_s += ","+"'"+split[i]+"'";
		}
		String substring = id_s.substring(1);
		try {
			dao.beginTransation();
			dao.execute("DELETE FROM PPN_RENT_FILE ds WHERE ds.FILE_ID IN("+substring+")");
			if(codestyle==1){
			dao.execute("DELETE FROM PPN_RENT_ORD_ATTACH dt WHERE dt.FILE_ID IN("+substring+")");}
			else if(codestyle==2){
				dao.execute("DELETE FROM PPN_RENT_OUT_ATTACH dt WHERE dt.FILE_ID IN("+substring+")");}
			else{
				dao.execute("DELETE FROM PPN_RENT_RETURN_ATTACH dt WHERE dt.FILE_ID IN("+substring+")");
			}
			dao.commitTransation();
	
			retval = 0;
		} catch (SQLException e) {
			
				dao.rollbackTransation();
		
			e.printStackTrace();
		}
		return retval;
	}
	/**
	 * 插入维保记录
	 * @param xml
	 * @param ids
	 * @return
	 * @throws SQLException
	 */
public int insertDevMaints(String xml,String ids) throws SQLException {
	int state=0;
	String id_s="";
	String[] split = ids.split(",");
	for (int i = 0; i < split.length; i++) {
		id_s += ","+"'"+split[i]+"'";
	}
	String substring = id_s.substring(1);
	int result=0;
	IDao dao=getDao();
	try {
		dao.beginTransation();
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List<Element> elements = rootElement.elements("TABLE");
			String replaceDs = elements.get(0).asXML().replaceAll("TABLE","PPN_DEV_MAINT");
			PpnDevMaint ppnDev=SerializerUtil.deserialize(PpnDevMaint.class, replaceDs);
			dao.saveBusinessObjs(ppnDev);						
				if(ppnDev.getMaintType().equals("1")){
					state=2;
				}
				else{
					state=3;
				}
		
				for(int i = 0; i < split.length; i++){				
					dao.execute("UPDATE PPN_RENT_OBJ ds SET ds.OBJ_STATUS= "+state+" WHERE ds.OBJ_ID ='"+split[i]+"'");
					PpnRentMaint2Obj maint2Obj=new PpnRentMaint2Obj();
					maint2Obj.setMaintId(ppnDev.getMaintId());
					maint2Obj.setObjId(split[i]);
					dao.saveBusinessObjs(maint2Obj);							
				}
		dao.commitTransation();
	} catch (SQLException e) {
		dao.rollbackTransation();
		result=-1;
		e.printStackTrace();
	} catch (DocumentException e) {			
		e.printStackTrace();
	}
	return result;
}

/**
 * 更新维保记录
 * @param xml
 * @param ids
 * @return
 * @throws SQLException
 */
public int updateDev(String xml,String ids) throws SQLException {
int state=0;
String id_s="";
String[] split = ids.split(",");
for (int i = 0; i < split.length; i++) {
	id_s += ","+"'"+split[i]+"'";
}
String substring = id_s.substring(1);
int result=0;
IDao dao=getDao();
try {
	dao.beginTransation();
	Document doc = DocumentHelper.parseText(xml);
	Element rootElement = doc.getRootElement();
	List<Element> elements = rootElement.elements("TABLE");
		String replaceDs = elements.get(0).asXML().replaceAll("TABLE","PPN_DEV_MAINT");
		PpnDevMaint ppnDev=SerializerUtil.deserialize(PpnDevMaint.class, replaceDs);
		dao.updateBusinessObjs(true, ppnDev);						
		if(ppnDev.getMaintType().equals("1")){
				state=2;
			}
		else{
				state=3;
			}
		for(int i = 0; i < split.length; i++){
				dao.execute("UPDATE PPN_RENT_OBJ ds SET ds.OBJ_STATUS= "+state+" WHERE ds.OBJ_ID ='"+split[i]+"'");
			}	
	dao.commitTransation();
} catch (SQLException e) {
	dao.rollbackTransation();
	result=-1;
	e.printStackTrace();
} catch (DocumentException e) {			
	e.printStackTrace();
}
return result;
}
}
