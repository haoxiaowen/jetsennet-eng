package jetsennet.jue2.util;

import java.util.Properties;
import java.util.UUID;

import com.w.util.prop.PropertiesUtil;


// ybh 2012-5-2 增加技审单版本，时间属性
public class Jppn2Config {
	
	public static Properties sysProperties = PropertiesUtil.getProperties(Jppn2Config.class, "/cctvinterface.properties");;

	public static String system_code = sysProperties.getProperty("source_system");
	
	public static String taskListenerTimeConfig = sysProperties.getProperty("TASK_LISTENER_TIME_CONFIG");
	

	public static String sys_storage_path_ftp = Jppn2Config.sysProperties.getProperty("sys_storage_path_ftp");
	public static String sys_storage_path_unc = Jppn2Config.sysProperties.getProperty("sys_storage_path_unc");
	public static String sys_storage_map_path = Jppn2Config.sysProperties.getProperty("sys_storage_map_path");
	public static String blue_right_path = Jppn2Config.sysProperties.getProperty("blue_right_path");
	
	//从配置文件中读取WAS 映射路径
	public static String sys_was_map_path = Jppn2Config.sysProperties.getProperty("sys_was_map_path");
	public static String sys_apple_map_path =Jppn2Config.sysProperties.getProperty("sys_apple_map_path");
	public static String sys_linux_map_path =Jppn2Config.sysProperties.getProperty("sys_linux_map_path");
	public static String sys_windows_map_path =Jppn2Config.sysProperties.getProperty("sys_windows_map_path");
	
	//文件操作服务类
	public static String file_common_operater_service_url = sysProperties.getProperty("File_Common_Operater_Service");
	
	
	//添加推送任务服务
	public static String addPpnTaskService = sysProperties.getProperty("Add_PpnTask_Service");
	//向推送模块调用导入允许
	public static String ppnContentImportService = sysProperties.getProperty("Ppn_ContentImport_Service");
	public static String ppnEmbCallBackService = sysProperties.getProperty("Ppn_EmbCallBack_Service");
	public static String ppnAuditResultService = sysProperties.getProperty("Ppn_AuditResult_Service");
	public static String ppnImportCallbackService = sysProperties.getProperty("Ppn_ImportCallback_Service");
	public static String ppnFileDeliveryCallbackService = sysProperties.getProperty("Ppn_FileDeliveryCallback_Service");
	public static String ppnTaskCallBackUrl = sysProperties.getProperty("PpnTaskCallBackUrl");
	
	public static String ppnTurboService = sysProperties.getProperty("Ppn_TurboService");

	/**  转码任务分组   */
	public final static String MTS_TASK_GROUP = sysProperties.getProperty("MTS_TASK_GROUP");
	
	public static String getUuidString()
	{
		return UUID.randomUUID().toString();
	}
	
}
