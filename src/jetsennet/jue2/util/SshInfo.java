package jetsennet.jue2.util;

import java.util.Properties;
import com.w.util.prop.PropertiesUtil;

public class SshInfo {
	public static Properties loginProperties = PropertiesUtil.getProperties(SshInfo.class, "/ssh-info.properties");
	
	public static int sshPort = Integer.parseInt(loginProperties.getProperty("SSH_PORT"));//SSH连接的默认端口
	public static String sshCharset = loginProperties.getProperty("SSH_CHARSET");//SSH连接的默认字符集
	public static String defaultPassword = loginProperties.getProperty("DEFAULT_PASSWORD");//新建账户的默认密码
	public static String rootUser = loginProperties.getProperty("ROOT_USER");//root账户
	public static String rootPassword = loginProperties.getProperty("ROOT_PASSWORD");//root密码
	public static String adminUser = loginProperties.getProperty("ADMIN_USER");//admin账户,共享挂载账户
	public static String subDirs = loginProperties.getProperty("SUB_DIRS");//子目录
	public static String dstDir = loginProperties.getProperty("DST_DIR");//成品目录
	public static String servletUrl = loginProperties.getProperty("SERVLET_URL");//servlet地址
	
	public static String engUrl = loginProperties.getProperty("EngRemoteAddress");//eng servlet地址
	public static String redisIp = loginProperties.getProperty("REDIS_IP");//redis
	public static String redisPort = loginProperties.getProperty("REDIS_PORT");
	public static String redisPassword = loginProperties.getProperty("REDIS_PASSWORD");
}
