package jetsennet.jue2.util;


public class PathConvert {
	
	public static String path4Windows(String srcPath){
		String destPath = "";
		if(srcPath.startsWith(Jppn2Config.sys_storage_path_unc)){
			destPath =Jppn2Config.sys_storage_map_path +
					            srcPath.replace(Jppn2Config.sys_storage_path_unc, "").replaceAll("\\\\", "/");
		}else if(srcPath.startsWith(Jppn2Config.sys_storage_path_ftp)){
			destPath= Jppn2Config.sys_storage_map_path +
					   			srcPath.replace(Jppn2Config.sys_storage_path_ftp, "");
		}else if(srcPath.startsWith(Jppn2Config.sys_storage_map_path.substring(0, 2))){
			// startwih  Z:\ || Z:/
			destPath = srcPath;
		}else if(srcPath.startsWith(Jppn2Config.sys_linux_map_path)){
			destPath = Jppn2Config.sys_storage_map_path + 
								srcPath.replace(Jppn2Config.sys_linux_map_path, "");
		}else if(srcPath.startsWith(Jppn2Config.sys_apple_map_path)){
			destPath = Jppn2Config.sys_storage_map_path + 
					srcPath.replace(Jppn2Config.sys_apple_map_path, "");
		}
		return destPath ;
	}
	
	public static String path4Apple(String srcPath){
		String destPath = "" ;
		if(srcPath.startsWith(Jppn2Config.sys_storage_path_unc)){
			destPath =Jppn2Config.sys_apple_map_path + 
					            srcPath.replace(Jppn2Config.sys_storage_path_unc, "").replaceAll("\\\\", "/");
									
		}else if(srcPath.startsWith(Jppn2Config.sys_storage_path_ftp)){
			destPath= Jppn2Config.sys_apple_map_path +
					   			srcPath.replace(Jppn2Config.sys_storage_path_ftp, "");
		}else if(srcPath.startsWith(Jppn2Config.sys_storage_map_path.substring(0, 2))){
			// startwih  Z:\ || Z:/
			destPath = Jppn2Config.sys_apple_map_path + srcPath.replace(Jppn2Config.sys_storage_map_path, "");
		}
		
		return destPath ;
	}
	
	public static String path4Linux(String srcPath){
		
		return null ;
	}
	
	/**
	 * 将所绑定的源文路径转换成部署环境所识别的路径
	 * @param srcPath
	 * @return
	 */
	public static String path4Deploy(String srcPath){
		String destPath = srcPath;
//		String mamTranscodePath = PpnBusinessWordUtil.getBwordData("MAM_PATH", "MAM_TRANSCODE_PATH");
		String mamFtpPath = PpnBusinessWordUtil.getBwordData("MAM_PATH", "MAM_PATH");
		if(srcPath.startsWith(Jppn2Config.sys_storage_path_unc)){
			destPath =Jppn2Config.sys_was_map_path + "/" +
					            srcPath.replace(Jppn2Config.sys_storage_path_unc, "").replaceAll("\\\\", "/");
		}else if(srcPath.startsWith(Jppn2Config.sys_storage_path_ftp)){
			destPath= Jppn2Config.sys_was_map_path + "/" +
					   			srcPath.replace(Jppn2Config.sys_storage_path_ftp, "");
		}else if(srcPath.startsWith(Jppn2Config.sys_storage_map_path.substring(0, 2))){
			// startwih  Z:\ || Z:/
			destPath = Jppn2Config.sys_was_map_path +"/" + srcPath.replace(Jppn2Config.sys_storage_map_path, "");//srcPath.substring(3).replaceAll("\\\\", "/");
		}else if(srcPath.startsWith(Jppn2Config.sys_linux_map_path)){
			destPath = Jppn2Config.sys_was_map_path + "/" + 
								srcPath.replace(Jppn2Config.sys_linux_map_path, "");
		}else if(srcPath.startsWith(Jppn2Config.sys_apple_map_path)){
			destPath = Jppn2Config.sys_was_map_path + "/" + 
					srcPath.replace(Jppn2Config.sys_apple_map_path, "");
		}
		//TODO 如果是uqc导入媒资，需要进行对应的路径转化
		else if(srcPath.startsWith(mamFtpPath) ) {
			destPath = srcPath.replace(mamFtpPath, PpnBusinessWordUtil.getBwordData("MAM_PATH", "MAM_TRANSCODE_PATH"));
			destPath = destPath.replaceAll("\\\\", "/");
		}
		return destPath ;
	}
	
	/**
	 * 将路径转为ftp路径
	 * @param path
	 * @return
	 */
	public static String path4Ftp(String path)
	{
		String pathHead = Jppn2Config.sys_storage_path_unc;
		String mamTranscodePath = PpnBusinessWordUtil.getBwordData("MAM_PATH", "MAM_TRANSCODE_PATH");
		if (path.startsWith(pathHead))
		{
			// UNC
			path = path.replace(pathHead, Jppn2Config.sys_storage_path_ftp);
			path = path.replace("\\", "/");
		}
		else if (path.startsWith(Jppn2Config.sys_storage_map_path.substring(0, 2)))
		{
			// filesystem start with Z:/
			String tmpPath = null;
			tmpPath = path.replace(Jppn2Config.sys_storage_map_path, Jppn2Config.sys_storage_path_ftp);
			if (tmpPath.equals(path))
			{
				tmpPath = tmpPath.replace("\\", "/");
				tmpPath = tmpPath.replace(Jppn2Config.sys_storage_map_path, Jppn2Config.sys_storage_path_ftp);
			}
			path = tmpPath;
		}
		else if (path.startsWith(Jppn2Config.sys_apple_map_path))
		{
			// MAC
			path = path.replace(Jppn2Config.sys_apple_map_path, Jppn2Config.sys_storage_path_ftp);
			path = path.replace("\\", "/");
		}
		else if (path.startsWith(Jppn2Config.sys_linux_map_path))
		{
			path = path.replace(Jppn2Config.sys_linux_map_path, Jppn2Config.sys_storage_path_ftp);
			path = path.replace("\\", "/");
		}
		//TODO 如果是uqc导入媒资，需要进行对应的路径转化
		else if(path.startsWith(mamTranscodePath) ) {
			path = path.replace(mamTranscodePath, PpnBusinessWordUtil.getBwordData("MAM_PATH", "MAM_PATH"));
			path = path.replace("/","\\");
		}

		return path;
	}
	
	public static void main(String[] args) {
		String path ="\\\\10.122.6.97\\ue2\\Program\\2016M00281076\\Jetsen\\测试2(72ku).MOV";
		System.out.println(path4Ftp(path));
		
		path ="D:/ue2/Program/2016M00281076/Jetsen/测试2(72ku).MOV";
		System.out.println(path4Ftp(path));
		
		path ="Z:/Program/2015M00280067/Production/";
		System.out.println(path4Ftp(path));
				
	}
}


