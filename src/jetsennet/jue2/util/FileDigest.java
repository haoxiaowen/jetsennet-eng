package jetsennet.jue2.util;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

public class FileDigest {
  /**
   * 获取单个文件的MD5值！
   * @param file
   * @return
   */
  public static char[] hexChar = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' }; 
  public static String getFileMD5(File file) {
   /* if (!file.isFile()){
      return null;
    }
    MessageDigest digest = null;
    FileInputStream in=null;
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
    return bigInt.toString(16);
  }*/
      InputStream fis;       
      byte[] buffer = new byte[1024];   
      try{
    	  fis = new FileInputStream(file);  
    	  MessageDigest md5 = MessageDigest.getInstance("MD5");     
          int numRead = 0;     
          while ((numRead = fis.read(buffer)) > 0) {     
              md5.update(buffer, 0, numRead);     
          }     
	      fis.close();     
	      return toHexString(md5.digest());  
      
      }catch(Exception e){
	      e.printStackTrace();
	      return null;
      }
      
  }     
     

  public static String toHexString(byte[] b) {     
      StringBuilder sb = new StringBuilder(b.length * 2);     
      for (int i = 0; i < b.length; i++) {     
         sb.append(hexChar[(b[i] & 0xf0) >>> 4]);     
         sb.append(hexChar[b[i] & 0x0f]);     
      }     
     return sb.toString();     
  }     



  
  public static void main(String [] args){
	  
	  File f  = new File("d:\\fin.txt");
	  
	  try {
		
		  FileWriter fw = new FileWriter(f);
		
		  fw.write("abcekfjslkfjslkfjsklfjsklfjsklfjsklfjslkfjslkfjsklfjsklfjasklfsjakla");
		  
		  fw.close();
	
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	  
	  String  md5Str =  FileDigest.getFileMD5(f);
	 
	  System.out.println(md5Str) ;
	 
  }
  
  /**
   * 获取文件夹中文件的MD5值
   * @param file
   * @param listChild ;true递归子目录中的文件
   * @return
   */
  public static Map<String, String> getDirMD5(File file,boolean listChild) {
    if(!file.isDirectory()){
      return null;
    }
    //<filepath,md5>
    Map<String, String> map=new HashMap<String, String>();
    String md5;
    File files[]=file.listFiles();
    for(int i=0;i<files.length;i++){
      File f=files[i];
      if(f.isDirectory()&&listChild){
        map.putAll(getDirMD5(f, listChild));
      } else {
        md5=getFileMD5(f);
        if(md5!=null){
          map.put(f.getPath(), md5);
        }
      }
    }
    return map;
  }

}


