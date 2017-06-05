package jetsennet.jdlm.business;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jetsennet.frame.dataaccess.IDao;
import jetsennet.jdlm.beans.PpnRentMonCfg;
import jetsennet.jdlm.beans.PpnRentMonProcDef;
import jetsennet.jue2.util.factory.DaoFactory;

/**
 * xml导出servlet
 * @author <a href="mailto:jianghaisheng@jetsen.cn">蒋海生</a>
 * @version 1.0.0
 * ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br/>
 * 修订日期                 修订人            描述<br/>
 * 2016-12-30       jhs          创建<br/>
 */
public class XMLExportServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	Map<String, Object> sourMap;//资源表
	List<PpnRentMonProcDef> proList;//监控进程配量表
	PpnRentMonCfg ppnRConfig;//管控配置表
	Map<String, Object> rentOutItemMap;
	Map<String, Object> rentOutMap;
	String Valuetime="";
	String assUid = "";
	String supperCode="";
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, 
			IOException 
	{
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	*/
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{
		//资源ID
		String objId = request.getParameter("objId");
		String mac = "34-02-86-E1-B6-D0";
		response.setDateHeader("Expires", 0);
		response.setCharacterEncoding("utf-8");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setContentType("application/vnd.ms-excel;charset=UTF-8");//gb2312
		//xml文件名称
		String filename="config";
		response.setHeader("Content-Disposition", "attachment;  filename=" + URLEncoder.encode(filename, "utf-8") + ".xml");
		ServletOutputStream out = response.getOutputStream();
		StringBuffer sb = new StringBuffer();  
		sb.append("<?xml version='1.0' encoding='utf-8' ?>");
		sb.append("\n");
		IDao dao = DaoFactory.getPpnCommonDao();
		//资源表数据与类型表数据一对一
		String souSql = "select p.OBJ_TYPE_ID,t.OBJ_ASS_UID,t.OBJ_CODE from ppn_rent_obj t left join ppn_rent_obj_type p on t.obj_type_id = p.obj_type_id  where t.OBJ_MAC_ADDRESS ='"+mac+"'";
		//监控进程配量表
		String ipSql = "select * from PPN_RENT_MON_CFG";
		try {
			sourMap = dao.queryForMap(souSql.toString());
			if(sourMap != null){
				String proSql = "select * from ppn_rent_mon_proc_def d where d.obj_type_id in ('"+sourMap.get("OBJ_TYPE_ID")+"') and d.PROC_STATUS ='1'";
				proList = dao.queryBusinessObjs(PpnRentMonProcDef.class, proSql);
				ppnRConfig = dao.querySingleObject(PpnRentMonCfg.class, ipSql);
				String outitem = "select * from PPN_RENT_OUT_ITEM where ITEM_CODE in ('"+sourMap.get("OBJ_CODE")+"')";
				
				rentOutItemMap = dao.queryForMap(outitem.toString());
				supperCode = rentOutItemMap.get("ITEM_MATH_CODE")+"";
				String rentout = "select * from PPN_RENT_OUT where OUT_ID in ('"+rentOutItemMap.get("OUT_ID")+"')";
				rentOutMap = dao.queryForMap(rentout.toString());
				Valuetime = String.valueOf(rentOutMap.get("OUT_END_TIME")).substring(2,4)+String.valueOf(rentOutMap.get("OUT_END_TIME")).substring(5,7)+String.valueOf(rentOutMap.get("OUT_END_TIME")).substring(8,10);
				
				
				if(ppnRConfig != null){
					assUid = "\""+String.valueOf(sourMap.get("OBJ_ASS_UID"))+"\"";
					String times = "\""+String.valueOf(ppnRConfig.getMonServerTimer())+"\"";
					String port = "\""+ppnRConfig.getMonServerPort()+"\"";
					String address = "\""+ppnRConfig.getMonServerHost()+"\"";
					String ctlport = "\""+ppnRConfig.getMonServerCtlport()+"\"";
					String imgport = "\""+ppnRConfig.getMonServerImgport()+"\"";
					String bashpath = "\""+ppnRConfig.getBashpath1()+"\"";
					sb.append("<root>");
					sb.append("\n").append("  ");
					sb.append("<configuration id="+assUid+"  timer="+times+" port="+port+" bash-path="+bashpath+">");
					sb.append("\n").append("  ");
					sb.append("<server address="+address+" ctl-port="+ctlport+" img-port="+imgport+"/>");
				}
				sb.append("\n").append("  ");
				sb.append("<process-config>");
				if(!proList.isEmpty()){
					for(int i = 0;i<proList.size();i++){
						String index = "\""+(proList.get(i)).getProcIndex()+"\"";
						String name = "\""+(proList.get(i)).getProcName()+"\"";
						sb.append("\n").append(" ").append(" ").append(" ");
						sb.append("<item index="+index+" name="+name+"/>");
					}
				}
				sb.append("\n").append("  ");
				sb.append("</process-config>");
				sb.append("\n");
				sb.append("</configuration>");
				sb.append("<register>");
				sb.append("\n").append("  ");
				
				String supcode = "\""+supperCode+"\"";
				String SupperCode = "\""+"SupperCode"+"\"";
				String Message = "\""+"Message"+"\"";
				String messagephone = "\""+"LX:13898766789"+"\"";
				String loginName = "\""+"LoginName"+"\"";
				String loginvalue = "\""+"administrator"+"\"";
				String lock = "\""+"Lock"+"\"";
				String lockvalue = "\""+"0"+"\"";
				String timev = "\""+"Value"+"\"";
				String timevalue = "\""+Valuetime+"\"";
				String id = "\""+"ID"+"\"";
				String idv = Integer.toHexString(Integer.valueOf(String.valueOf(sourMap.get("OBJ_ASS_UID"))));
				if(idv.length()==1){
					idv="0"+idv;
				}else{
					idv=idv;
				}
				String idvalue = "\""+idv+"\"";
				String path="\""+"HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Authentication\\Code"+"\"";
				sb.append("<reg-item path="+path+" item="+timev+" value="+timevalue+"/>");
				sb.append("\n");
				sb.append("<reg-item path="+path+" item="+lock+" value="+lockvalue+"/>");
				sb.append("\n");
				sb.append("<reg-item path="+path+" item="+id+" value="+idvalue+"/>");
				sb.append("\n");
				sb.append("<reg-item path="+path+" item="+loginName+" value="+loginvalue+"/>");
				sb.append("\n");
				sb.append("<reg-item path="+path+" item="+SupperCode+" value="+supcode+"/>");
				sb.append("\n");
				sb.append("<reg-item path="+path+" item="+Message+" value="+messagephone+"/>");
				sb.append("\n");
				sb.append("</register>");
				sb.append("</root>");
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		if(null != out){
			String str = sb.toString();
			out.write(str.getBytes());
			out.flush();
			out.close();
		}
	}
}
