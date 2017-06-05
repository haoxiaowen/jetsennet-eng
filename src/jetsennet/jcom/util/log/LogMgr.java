package jetsennet.jcom.util.log;

import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jcom.bean.PpnWslog;
import jetsennet.jcom.bean.PpnWslogdata;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.uorm.dao.common.ICommonDao;

public class LogMgr {
	private IDao dao = null;

	public void insertSoapLog(String serviceCode, String servcieName,
			String servcieMethod, String sourceSys, String targetSys,
			String soapStr) {
		try {
			dao.beginTransation();

			PpnWslog ppnLog = new PpnWslog();
			ppnLog.setWslogCode(serviceCode);
			ppnLog.setWslogSourcesys(sourceSys);
			ppnLog.setWslogTargetsys(targetSys);
			ppnLog.setWslogServicename(servcieName);
			ppnLog.setWslogCreatetime(new Timestamp(Calendar.getInstance().getTimeInMillis()));
			dao.saveBusinessObjs(new Object[] { ppnLog });

			PpnWslogdata ppnLogData = new PpnWslogdata();
			ppnLogData.setWslogId(ppnLog.getWslogId());
			ppnLogData.setWslogRequestdata(soapStr);
			dao.saveBusinessObjs(new Object[] { ppnLogData });
			
			dao.commitTransation();
		} catch (Exception ex) {
			if (dao != null) {
				try {
					dao.rollbackTransation();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			ex.printStackTrace();
		} finally {
			//关闭数据库连接
		}
	}

	public void updateSoapLog(String wslogID, String serviceID, String soapStr) {
		try {
			dao.beginTransation();

			PpnWslogdata ppnLogData = new PpnWslogdata();
			ppnLogData.setWslogId(wslogID);
			ppnLogData.setWslogResponsedata(soapStr);
			dao.updateBusinessObjs(true, new Object[] { ppnLogData });

			dao.commitTransation();
		} catch (Exception ex) {
			if (dao != null) {
				try {
					dao.rollbackTransation();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			ex.printStackTrace();
		} finally {
		}
	}

	public void insertOrUpdateSoapLog(String serviceCode, String serviceName,String soapStr) throws Exception {
		try {
			String getServerIDStr = "SELECT WSLOG_ID FROM PPN_WSLOG WHERE WSLOG_CODE = '"+ serviceCode + "'";
			Object obj = getDao().querySingleObject(String.class, getServerIDStr);
			if (obj != null) {
				updateSoapLog(obj.toString(), serviceCode, soapStr);
			} else {
				Document doc = DocumentHelper.parseText(soapStr);
				Element rootEle = doc.getRootElement();
				Element headerEle = rootEle.element("Header");
				Element eleHeadr = headerEle.element("RequestHead");
				String sourceSys = eleHeadr.elementText("SourceSysID");
				String targetSys = eleHeadr.elementText("TargetSysID");

				insertSoapLog(serviceCode, serviceName, "", sourceSys,
						targetSys, soapStr);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
		}
	}

	public IDao getDao() {
		return dao;
	}

	public void setDao(IDao dao) {
		this.dao = dao;
	}

}