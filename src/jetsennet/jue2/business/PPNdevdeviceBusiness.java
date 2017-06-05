package jetsennet.jue2.business;


import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.frame.business.Business;
import jetsennet.jcom.channel.PpnCdmChannel;
import jetsennet.jue2.beans.PpnDevCtrl;
import jetsennet.jue2.beans.PpnDevDevice;
import jetsennet.jue2.beans.PpnDevInetAddr;
import jetsennet.jue2.beans.PpnPgmProgram;
import jetsennet.jue2.beans.PpnTaskFile;
import jetsennet.jue2.beans.PpnTransMdt;
import jetsennet.jue2.beans.PpnTsbTask;
import jetsennet.jue2.beans.TransMdtDest;
import jetsennet.jue2.beans.TransMdtUser;
import jetsennet.jue2.util.PingThread;
import jetsennet.jue2.util.PingUtil;
import jetsennet.util.SerializerUtil;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.dom4j.Document;
import org.dom4j.DocumentException;
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
public class PPNdevdeviceBusiness extends BaseBusiness
{
	protected Logger logger = Logger.getLogger(PPNdevdeviceBusiness.class);
	private static final int timeOut = 3000; //超时应该在3钞以上  
	@SuppressWarnings("unchecked")
	public int insertObjecsPpn(String xml) throws Exception {
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		Element devDevice = elements.get(0);
		Element devCtrl = elements.get(1);
		String devDevices = devDevice.asXML().replaceAll("TABLE","PPN_DEV_DEVICE");
		String devCtrls = devCtrl.asXML().replaceAll("TABLE","PPN_DEV_CTRL");
		PpnDevDevice ppnDevDevice = SerializerUtil.deserialize(PpnDevDevice.class, devDevices);
		PpnDevCtrl ppnDevCtrl = SerializerUtil.deserialize(PpnDevCtrl.class, devCtrls);
		//设置系统当前时间的
		ppnDevDevice.setDevCreateTime(new Timestamp(System.currentTimeMillis()));
		int saveppnDevDevice = getDao().saveBusinessObjs(ppnDevDevice);
		if(saveppnDevDevice==-2){
			String devId = ppnDevDevice.getDevId();
			ppnDevCtrl.setDevId(devId);
			int saveppnDevCtrl = getDao().saveBusinessObjs(ppnDevCtrl);
			return saveppnDevCtrl;
		}
		return 0;
	}
   //修改设备控制信息
	@SuppressWarnings("unchecked")
	public int devctrObjsUpdate(String xml) throws Exception {
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		Element devCtrl = elements.get(0);
		String devCtrls = devCtrl.asXML().replaceAll("TABLE","PPN_DEV_CTRL");
		PpnDevCtrl ppnDevCtrl = SerializerUtil.deserialize(PpnDevCtrl.class, devCtrls);
		int c = getDao().updateBusinessObjs(true,ppnDevCtrl);
			return c;
		}

	@SuppressWarnings("unchecked")
	public int devObjsUpdate(String xml) throws Exception {
		Document doc = DocumentHelper.parseText(xml);
		Element rootElement = doc.getRootElement();
		List <Element>elements = rootElement.elements("TABLE");
		Element devDevice = elements.get(0);
		String devDevices = devDevice.asXML().replaceAll("TABLE","PPN_DEV_DEVICE");
		PpnDevDevice ppnDevDevice = SerializerUtil.deserialize(PpnDevDevice.class, devDevices);
		int updateBusinessObjs = getDao().updateBusinessObjs(true,ppnDevDevice);
		//判断是否修改控制信息
		if(elements.size()>1){
			Element devCtrl = elements.get(1);
			String devCtrls = devCtrl.asXML().replaceAll("TABLE","PPN_DEV_CTRL");
			PpnDevCtrl ppnDevCtrl = SerializerUtil.deserialize(PpnDevCtrl.class, devCtrls);
			if(updateBusinessObjs==-2){
				String dev_id = ppnDevDevice.getDevId();
				ppnDevCtrl.setDevId(dev_id);
				int c = getDao().updateBusinessObjs(true,ppnDevCtrl);
				return c;
			}
			
		}
		return 0;
	}
	
	
	
	
	public String deleteDevObjecs(String ids) throws Exception {
		String id_s="";
		String[] split = ids.split(",");
		for (int i = 0; i < split.length; i++) {
			id_s += ","+"'"+split[i]+"'";
		}
		String substring = id_s.substring(1);
		getDao().beginTransation();
		getDao().execute("DELETE FROM PPN_DEV_ALARM a WHERE a.DEV_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_DEV_CTRL b WHERE b.DEV_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_DEV_INET_ADDR c WHERE c.DEV_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_DEV_KEYWORDS d WHERE d.DEV_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_DEV_OPERATE_LOG e WHERE e.DEV_ID IN("+substring+")");
		getDao().execute("DELETE FROM PPN_DEV_DEVICE f WHERE f.DEV_ID IN("+substring+")");
		getDao().commitTransation();
		return ids;
	}
	 //查询设备状态并返回结果
	    public Map<String,Boolean> SelectDevStatus(String xmlid) throws Exception {
	    	int flag=1;
	    	//查询ip
	    	//  List<PpnDevInetAddr> addr = getDao().queryBusinessObjs(PpnDevInetAddr.class,"select * from  PPN_DEV_INET_ADDR where DEV_ID='"+xmlid+ "'");
	    	//if(addr.size()>0){
	    	String dev_id[]=xmlid.split(",");
	    	PingThread  pt=new PingThread();
	    	Map<String,Boolean> pingMap=pt.doPing(dev_id);
	        return pingMap;
	    }
	    
	    
	 public boolean ping(String ip){
	    	boolean status = false;  
	        if(ip != null)  
	        {
	            try  
	            {
	                status = InetAddress.getByName(ip).isReachable(timeOut);  
	            }
	            catch(UnknownHostException e)  
	            {
	                 e.printStackTrace(); 
	            }
	            catch(IOException e)  
	            {
	                 e.printStackTrace(); 
	            }
	        }
	        return status;  
	    }
}
