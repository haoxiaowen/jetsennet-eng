package jetsennet.jue2.util.fileoperater;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.security.MessageDigest;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

/**
 * 文件（夹）相关操作工具类
 * 
 * @author 杨裕发
 * 
 */
public class FileUtil {
	
	public static char[] hexChar = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
	
	/**
	 * 检查资源是否合法
	 * 
	 * @param sourcePath 源资源路径
	 * @param targetPath 目标资源路径
	 * @param resourceName 资源名称
	 * @return 源资源引用
	 * @throws ResourceNotFoundException
	 */
	public static  File checkPath(String sourcePath, String targetPath,
			String resourceName) throws Exception {
		File sourceResDir = new File(sourcePath);
		if (!sourceResDir.exists()) {
			throw new Exception("没有找到目录:" + sourcePath);
		}
		if (!sourceResDir.isDirectory()) {
			throw new Exception("资源:" + sourcePath + "不是一个目录");
		}
		File sourceRes = new File(sourcePath + "/" + resourceName);
		if (!sourceRes.exists()) {
			throw new Exception("没有找到资源:"
					+ sourceRes.getAbsolutePath());
		}
		File targetRes = new File(targetPath);
		if (!targetRes.exists()) {
			throw new Exception("没有找到目标位置:" + targetPath);
		}
		if (!targetRes.isDirectory()) {
			throw new Exception("目标位置:" + targetPath
					+ "不是一个目录!");
		}
		return sourceRes;
	}
	
	/**
	 * 判断文件是否存在
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static boolean isFileExists(File file) throws Exception {
		if (file.isDirectory()) {
			throw new Exception("传入的参数不表示一个文件!");
		}
		return file.exists();
	}
	
	/**
	 * 创建文件夹
	 * @param path  文件夹路径
	 * @return 创建结果
	 */
	public static boolean makeDirectory(String path) {
		boolean isSuccess = true;
		try {
			File dir = new File(path);
			if (!dir.mkdirs()) {
				isSuccess = false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			isSuccess = false;
		}
		return isSuccess;

	}

	/**
	 * 删除文件夹
	 * @param dir 文件夹路径
	 */
	public static void deleteDirectory(File dir) throws Exception {
		File[] listFiles = dir.listFiles();
		for (File file : listFiles) {
			if (file.isFile()) {
				file.delete();
			} else {
				deleteDirectory(file);
			}
		}
		dir.delete();
	}

	/**
	 * 获取一个目录的大小
	 * @param dir  要获取的目录
	 * @return 目录大小
	 * @throws Exception
	 */
	public static double getDirecotrySize(File dir) throws Exception {
		if (!dir.isDirectory()) {
			throw new Exception("传入的参数不表示一个目录!");
		}
		double result = 0.0;
		for (File subRes : dir.listFiles()) {
			if (subRes.isFile()) {
				result += subRes.length();
			} else {
				result += getDirecotrySize(subRes);
			}
		}
		return result;
	}

	/**
	 * 获取一个文件的大小
	 * @param file 要获取的文件
	 * @return 文件大小
	 * @throws Exception
	 */
	public static double getFileSize(File file) throws Exception {
		if (file.isDirectory()) {
			throw new Exception("传入的参数不表示一个文件!");
		}
		if(!file.exists()){
			throw new Exception("文件不存在!");
		}
		double result = 0.0;
		result = file.length();
		return result;
	}

	/**
	 * 转换文件大小 显示
	 * @param fileS
	 * @return
	 */
	public static String FormetFileSize(long fileS) {
		DecimalFormat df = new DecimalFormat("#.00");
		String fileSizeString = "";
		if (fileS < 1024) {
			fileSizeString = df.format((double) fileS) + "B";
		} else if (fileS < 1048576) {
			fileSizeString = df.format((double) fileS / 1024) + "K";
		} else if (fileS < 1073741824) {
			fileSizeString = df.format((double) fileS / 1048576) + "M";
		} else {
			fileSizeString = df.format((double) fileS / 1073741824) + "G";
		}
		return fileSizeString;
	}

	/**
	 * 获取单个文件的MD5值！
	 * @param file
	 * @return
	 */
	public static String getFileMD5(File file) {
		if (!file.isFile()) {
			return null;
		}
		/*MessageDigest digest = null;
		FileInputStream in = null;
		byte buffer[] = new byte[1024];
		int len;
		try {
			digest = MessageDigest.getInstance("MD5");
			in = new FileInputStream(file);
			while ((len = in.read(buffer, 0, 1024)) != -1) {
				digest.update(buffer, 0, len);
			}
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		BigInteger bigInt = new BigInteger(1, digest.digest());
		return bigInt.toString(16);*/

		InputStream fis;
		byte[] buffer = new byte[1024];
		try
		{
			fis = new FileInputStream(file);
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			int numRead = 0;
			while ((numRead = fis.read(buffer)) > 0)
			{
				md5.update(buffer, 0, numRead);
			}
			fis.close();
			return toHexString(md5.digest());

		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	public static String toHexString(byte[] b)
	{
		StringBuilder sb = new StringBuilder(b.length * 2);
		for (int i = 0; i < b.length; i++)
		{
			sb.append(hexChar[(b[i] & 0xf0) >>> 4]);
			sb.append(hexChar[b[i] & 0x0f]);
		}
		return sb.toString();
	}   

	/**
	 * 获取文件夹中文件的MD5值
	 * @param file
	 * @param listChild  true递归子目录中的文件
	 * @return
	 */
	public static Map<String, String> getDirMD5(File file, boolean listChild) {
		if (!file.isDirectory()) {
			return null;
		}
		// <filepath,md5>
		Map<String, String> map = new HashMap<String, String>();
		String md5;
		File files[] = file.listFiles();
		for (int i = 0; i < files.length; i++) {
			File f = files[i];
			if (f.isDirectory() && listChild) {
				map.putAll(getDirMD5(f, listChild));
			} else {
				md5 = getFileMD5(f);
				if (md5 != null) {
					map.put(f.getPath(), md5);
				}
			}
		}
		return map;
	}
	/**
	 * 迁移文件
	 * @param sourceFile
	 * @param targetFile
	 * @throws Exception
	 */
	public static void moveFileContents(File sourceFile, File targetFile) throws Exception {
		int bufferSize = 4096;
		byte[] buffer = new byte[bufferSize];
		int index = -1;
		try {
			// 如果要迁移的是一个文件
			FileInputStream fis = new FileInputStream(sourceFile);
			FileOutputStream fos = new FileOutputStream(targetFile);
			while ((index = fis.read(buffer, 0, bufferSize)) != -1) {
				fos.write(buffer, 0, index);
				fos.flush();
			}
			fis.close();
			fos.close();
			sourceFile.delete();
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
	}
	/**
	 * 迁移目录
	 * @param sourceDir
	 * @param targetDir
	 * @throws Exception
	 */
	public static  void  moveDirContents(File sourceDir, File targetDir) throws Exception {
		// 先创建目录
		File outDir = new File(targetDir.getAbsolutePath() + "/"
				+ sourceDir.getName());
		if (!outDir.exists()) {
			if (!outDir.mkdir()) {
				throw new Exception("创建目录失败!");
			}
		}
		for (File subRes : sourceDir.listFiles()) {
			if (subRes.isFile()) {
				File newFile = new File(outDir.getAbsolutePath() + "/"
						+ subRes.getName());
				moveFileContents(subRes, newFile);
			} else {
				moveDirContents(subRes, outDir);
			}
		}
	}
	/**
	 * 拷贝文件
	 * @param sourceFile
	 * @param targetFile
	 * @throws Exception
	 */
	public static  void  copyFileContents(File sourceFile, File targetFile) throws Exception {
		int bufferSize = 4096;
		byte[] buffer = new byte[bufferSize];
		int index = -1;
		try {
			// 如果要迁移的是一个文件
			FileInputStream fis = new FileInputStream(sourceFile);
			FileOutputStream fos = new FileOutputStream(targetFile);
			while ((index = fis.read(buffer, 0, bufferSize)) != -1) {
				fos.write(buffer, 0, index);
				fos.flush();
			}
			fis.close();
			fos.close();
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
	}
	/**
	 * 拷贝目录
	 * @param sourceDir
	 * @param targetDir
	 * @throws Exception
	 */
	public static void copyDirContents(File sourceDir, File targetDir) throws Exception {
		// 先创建目录
		File outDir = new File(targetDir.getAbsolutePath() + "/"
				+ sourceDir.getName());
		if (!outDir.exists()) {
			if (!outDir.mkdir()) {
				throw new Exception("创建目录失败!");
			}
		}
		for (File subRes : sourceDir.listFiles()) {
			if (subRes.isFile()) {
				File newFile = new File(outDir.getAbsolutePath() + "/"
						+ subRes.getName());
				copyFileContents(subRes, newFile);
			} else {
				copyDirContents(subRes, outDir);
			}
		}
	}
	/**
	 * 删除文件
	 * @param sourceFile
	 * @throws Exception
	 */
	public static void deleteFileContents(File sourceFile) throws Exception {
		try {
			// 如果要迁移的是一个文件
			if(!sourceFile.exists()){
				throw new Exception("文件不存在!");
			}
			sourceFile.delete();
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
	}
	/**
	 * 删除目录及目录下的文件
	 * @param sourceDir
	 * @throws Exception
	 */
	public static void deleteDirContents(File sourceDir) throws Exception {
		for (File subRes : sourceDir.listFiles()) {
			if (subRes.isFile()) {
				deleteFileContents(subRes);
			} else {
				deleteDirContents(subRes);
			}
		}
		sourceDir.delete();
	}
	/**
	 * 文件重命名
	 * @param sourceDir
	 * @param targetDir
	 */
	public static void fileRename(File sourceFile, File targetFile)throws Exception {
		if(sourceFile.exists()){
			if(!targetFile.getParent().equals(sourceFile.getParent())){
				throw new Exception("重命名文件路径不正确!");
			}
			sourceFile.renameTo(targetFile);
		}else{
			throw new Exception("文件不存在!");
		}
	}
	/**
	 * 写文件
	 * @param content 内容
	 * @param targetFile 文件
	 * @throws Exception
	 */
	public static void createFile(String content,File targetFile) throws Exception{
		try {
			File fileDir = new File(targetFile.getParent());
			if (!fileDir.exists())
			{				
				fileDir.mkdirs();
			}
			
			byte[] content_byte = content.getBytes();
			FileOutputStream fos = new FileOutputStream(targetFile);
			fos.write(content_byte, 0, content_byte.length);
			fos.flush();
			fos.close();
			
		} catch (Exception ex) {
			ex.printStackTrace();
			throw ex;
		}
	}
	
	/**
	 * 写utf-8文件
	 * @param content
	 * @param targetFile
	 * @throws Exception
	 */
	public static void createUtf8File(String content, File targetFile) throws Exception
	{
		try
		{
			File fileDir = new File(targetFile.getParent());
			if (!fileDir.exists())
			{				
				fileDir.mkdirs();
			}
			OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(targetFile), "utf-8");
			out.write(content);
			out.flush();
			out.close();
		} catch (Exception ex)
		{
			ex.printStackTrace();
			throw ex;
		}
	}
	
	/**
	 * 读取文件
	 * @param sourceFile
	 * @return
	 * @throws Exception
	 */
	public static String readFile(File sourceFile) throws Exception{
		if(!sourceFile.exists()){
			throw new Exception("文件不存在!");
		}
		FileInputStream fis = new FileInputStream(sourceFile);
		byte[] buffer = new byte[(int)getFileSize(sourceFile)];
		fis.read(buffer);
		fis.close();
		return new String(buffer);
	}
	
	/**
	 * 读取文件utf-8
	 * @param sourceFile
	 * @return
	 * @throws Exception 
	 */
	public static String readUtf8File(File sourceFile) throws Exception
	{
		if(!sourceFile.exists()){
			throw new Exception("文件不存在!");
		}
		StringBuilder sb = new StringBuilder();
		InputStreamReader reader = new InputStreamReader(new FileInputStream(sourceFile),"UTF-8");
	    BufferedReader in = new BufferedReader(reader);
	    String str = null;
	    while((str=in.readLine())!= null){
	    	sb.append(str);
	    }
	    in.close();
	    return sb.toString();
	}
	

	public static void main(String... a) throws Exception {
		// System.out.println(makeDirectory("F:\\TEMP\\aa"));
		File file = new File("Z:\\Program\\2014A02270019\\QC\\0-P2014A02270019-A4K-00-0006-00-000-VHD-QCM.xml");
//		File file2 = new File("F:\\TEMP\\test.x");
//		fileRename(file,file2);
		// deleteDirectory(file);
//		createFile("11111111111111111111中国11111111111111111111",file);
//		Long a1 = 1L;
//		System.out.println(readFile(file)+a1);
		
		System.out.println(getFileMD5(file));
		
	}

}
