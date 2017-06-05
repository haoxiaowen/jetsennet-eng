package jetsennet.jdlm.business;

import java.sql.SQLException;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.dataaccess.IDao;
import jetsennet.jdlm.beans.PpnRentOrd;
import jetsennet.jdlm.beans.PpnRentOrdItem;
import jetsennet.jue2.util.factory.DaoFactory;
import jetsennet.net.WSResult;
import jetsennet.util.SerializerUtil;




/**
 * 
 */
public class PpnRentOrdBusiness extends BaseBusiness
{
	public WSResult addSource(String xml) {
		WSResult retObj = new WSResult();
		IDao dao = DaoFactory.getPpnCommonDao();;
		Document doc = null;
		try {
			doc = DocumentHelper.parseText(xml);
		} catch (DocumentException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		try {
			dao.beginTransation();
			PpnRentOrd PpnRentOrd = SerializerUtil.deserialize(PpnRentOrd.class, doc);
			dao.saveBusinessObjs(PpnRentOrd);
			retObj.setResultVal(PpnRentOrd.getOrdId().toString());
			dao.commitTransation();
		} catch (Exception e) {
			retObj.setErrorCode(-1);
			try {
				dao.rollbackTransation();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return retObj;
	}
	public WSResult delSource(String id) {
		WSResult retObj = new WSResult();
		IDao dao = DaoFactory.getPpnCommonDao();
		try {
			
			dao.beginTransation();
			dao.execute("delete from PPN_RENT_ORD where ORD_ID = '"+id+"'");
			dao.execute("delete from PPN_RENT_ORD_ITEM where ORD_ID = '"+id+"'");
			dao.commitTransation();
			retObj.setErrorCode(0);
		} catch (Exception e) {
			retObj.setErrorCode(-1);
			try {
				dao.rollbackTransation();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return retObj;
	}

}
