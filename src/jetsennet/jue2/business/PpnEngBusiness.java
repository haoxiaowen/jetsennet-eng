package jetsennet.jue2.business;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;

import jetsennet.frame.business.BaseBusiness;
import jetsennet.jue2.util.AuthenticationCodeCreator;
import jetsennet.jue2.util.SshInfo;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import net.sf.json.xml.XMLSerializer;

import org.apache.log4j.Logger;

import redis.clients.jedis.Jedis;

/**
 * 通用业务类
 * 
 * @author <a href="mailto:zhangwei@jetsen.cn">zjb</a>
 * @version 直送通知单
 * 
 */
public class PpnEngBusiness extends BaseBusiness
{
	protected Logger logger = Logger.getLogger(PpnMsgBusiness.class);
	private static SimpleDateFormat format = new  SimpleDateFormat("yyMMdd");
	private String redisIp = SshInfo.redisIp;
	private int redisPort = Integer.parseInt(SshInfo.redisPort);
	private String redisPassword = SshInfo.redisPassword;
	private int index = 0;
	
	/**
	 * 调用命令
	 * @param para
	 * @return
	 * @throws Exception
	 */
	public String executeCommand(String para) throws Exception {
		//JSONObject req = new JSONObject();
		//req.accumulate("CtlCode", "00003");
		String reqData = para;//req.toString();
		String respData = GetResponseDataByID(SshInfo.engUrl,reqData);//"http://192.168.1.105:8080/remotedesktop/RemoteDesktopControl"
		//String ret = jsontoXml(respData);
		//System.out.println("----respData----");
		return respData;
	}
	
	/**
	 * 获取设备信息
	 * @param devCode
	 * @return
	 */
	public String getDevInfo(String devCode){
		String process = "";
		JSONObject req = new JSONObject();
		req.accumulate("requestId", String.valueOf((++index)%254));
		req.accumulate("id", devCode);
		req.accumulate("CtlCode", "00101");
		req.accumulate("address", "127.0.0.1");
		req.accumulate("port", "9528");
		String reqData = req.toString();
		process = GetResponseDataByID(SshInfo.engUrl,reqData);
		return process;
	}
	public String getDevInfo1(String devCode){
		String process = "";
		Jedis jedis = new Jedis(redisIp,redisPort);
		jedis.auth(redisPassword);
		
		jedis.select(0);//心跳
		process = jedis.get("USER:"+devCode);
		System.out.println("----------------------------process:"+process);
		return process;
	}
	
	/**
	 * 获取定位信息
	 * @param devCode
	 * @return
	 */
	public String getGpsInfo(String devCode){
		String gpsVal = "";
		JSONObject req = new JSONObject();
		req.accumulate("requestId", String.valueOf((++index)%254));
		req.accumulate("id", devCode);
		req.accumulate("CtlCode", "00102");
		req.accumulate("address", "127.0.0.1");
		req.accumulate("port", "9528");
		String reqData = req.toString();
		gpsVal = GetResponseDataByID(SshInfo.engUrl,reqData);
		return gpsVal;
	}
	public String getGpsInfo1(String devCode){
		String gpsVal = "";
		Jedis jedis = new Jedis(redisIp,redisPort);
		jedis.auth(redisPassword);
		
		jedis.select(2);//心跳
		String baiduVal = jedis.get("USER:"+devCode);
		if("0,0".equals(baiduVal)){
			gpsVal = "116.471,39.921";
		}else{
			String[] baiduGps = baiduVal.split(",");
			gpsVal = coordChange(baiduGps[0],baiduGps[1]);
		}
		System.out.println("----------------------------gps:"+gpsVal);
		return gpsVal;
	}
	
	/** 
	 * 生成授权码
	 * @param para
	 * @return
	 * @throws Exception
	 */
	public String generateCode(String startDate,String duration,String deviceCode) throws Exception {
		//Date d1 = format.parse("161026");
		//System.out.println(getShortCode(d1,60));
		Date start = format.parse(startDate);
		int days = Integer.parseInt(duration);
		String devCode = Integer.toHexString(Integer.parseInt(deviceCode));
		if(devCode.length()==1){
			devCode = "0" + devCode;
		}
		String code = AuthenticationCodeCreator.getShortCode(start,days);
		return code + devCode.toUpperCase();
	}
	
    public static String GetResponseDataByID(String url, String postData) {
        String ret = null;
        try {
            URL dataUrl = new URL(url);
            HttpURLConnection con = (HttpURLConnection) dataUrl.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Proxy-Connection", "Keep-Alive");
            con.setDoOutput(true);
            con.setDoInput(true);
            
            OutputStream os = con.getOutputStream();
            DataOutputStream dos = new DataOutputStream(os);
            dos.write(postData.getBytes("UTF-8"));
            dos.flush();
            dos.close();
            
            InputStream is = con.getInputStream();
            DataInputStream dis = new DataInputStream(is);
            byte d[] = new byte[dis.available()];
            dis.read(d);
            ret = new String(d);
            con.disconnect();
        } catch (Exception ex) {
        	ex.getStackTrace();
        }
        return ret;
    }
    
    public static String jsonToXml(String json) {  
        try {
            XMLSerializer serializer = new XMLSerializer();  
            JSON jsonObject = JSONSerializer.toJSON(json);  
            return serializer.write(jsonObject);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }
        return null;  
    }
    
    /*
     * 百度坐标转换
     */
	public static String coordChange(String baiduX,String baiduY){
		String url = "http://api.map.baidu.com/geoconv/v1/?ak=82NRBt853FMjeeB0tbVMGUGGEOB5La8i&from=6&to=5&coords="+baiduX+","+baiduY;
		JSONObject gps = PpnEngBusiness.httpRequest(url,"GET",null);
		String x = "116.471";
		String y = "39.921";
		int status = gps.getInt("status");
		if(status==0){
			JSONArray gpsArr = gps.getJSONArray("result");
			gps = gpsArr.getJSONObject(0);
			x = gps.getString("x");
			y = gps.getString("y");
		}
		return x+","+y;
	}
	
    /*
     * base64解码
     
	public static String decodeBase64(String str){
		byte[] bt = null;
		try {
			sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
			bt = decoder.decodeBuffer( str );
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new String(bt);
	}*/
	
	/**
	 * 发送http请求
	 * @param requestUrl
	 * @param requestMethod
	 * @param outputStr
	 * @return
	 */
    public static JSONObject httpRequest(String requestUrl, String requestMethod, String outputStr) {    
        JSONObject jsonObject = null;    
        StringBuffer buffer = new StringBuffer();  
        InputStream inputStream=null;  
        try {  
            URL url = new URL(requestUrl);  
            HttpURLConnection httpUrlConn = (HttpURLConnection) url.openConnection();    
            httpUrlConn.setDoOutput(true);    
            httpUrlConn.setDoInput(true);    
            httpUrlConn.setUseCaches(false);  
            // 设置请求方式（GET/POST）    
            httpUrlConn.setRequestMethod(requestMethod);    
            if ("GET".equalsIgnoreCase(requestMethod))    
                httpUrlConn.connect();    
    
            // 当有数据需要提交时    
            if (null != outputStr) {    
                OutputStream outputStream = httpUrlConn.getOutputStream();    
                // 注意编码格式，防止中文乱码    
                outputStream.write(outputStr.getBytes("UTF-8"));    
                outputStream.close();    
            }  
            //将返回的输入流转换成字符串    
            inputStream = httpUrlConn.getInputStream();    
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");    
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);    
    
            String str = null;    
            while ((str = bufferedReader.readLine()) != null) {    
                buffer.append(str);    
            }    
            bufferedReader.close();    
            inputStreamReader.close();    
            // 释放资源    
            inputStream.close();    
            inputStream = null;    
            httpUrlConn.disconnect();    
          jsonObject = JSONObject.fromObject(buffer.toString());  
        } catch (ConnectException ce) {    
              ce.printStackTrace();  
              System.out.println("Weixin server connection timed out");  
        } catch (Exception e) {    
               e.printStackTrace();  
               System.out.println("http request error:{}");  
        }finally{  
            try {  
                if(inputStream!=null){  
                    inputStream.close();  
                }  
            } catch (IOException e) { 
                e.printStackTrace();  
            }  
        }   
        return jsonObject;    
    }  
    
    public static void main(String[] args) {
		try {
			//String aa = new PpnEngBusiness().getGpsInfo("188");
			//System.out.println(aa);
			
			//String aa = PpnEngBusiness.decodeBase64("MjIuNTY2ODY0NjY0MjA0");
			//System.out.println(aa);
			
			//JSONObject aa = PpnEngBusiness.httpRequest("http://api.map.baidu.com/ag/coord/convert?from=3&to=4&x=12685644&y=2562485","GET",null);
			//System.out.println(aa.toString());
			
			/*
			req.accumulate("requestId", "188");
			req.accumulate("address", "101.129.6.54");
			req.accumulate("port", "45743");
			
			req.accumulate("requestId", "168");
			req.accumulate("address", "101.129.6.182");
			req.accumulate("port", "40951");
			*/
			
			JSONObject req = new JSONObject();
			req.accumulate("requestId", "1");
			req.accumulate("id", "185");
			req.accumulate("CtlCode", "00010");
			req.accumulate("address", "127.0.0.1");
			req.accumulate("port", "9528");
			req.accumulate("lock", "0");
			req.accumulate("login_name", "haoxiaowen");
			req.accumulate("message", "测试弹出消息！");
			String reqData = req.toString();
			String url = "http://localhost:8080/remotedesktop/SyncRemoteDesktopControl";
			//String url = "http://101.129.1.244:8083/remotedesktop/SyncRemoteDesktopControl";
			String respData = GetResponseDataByID(url,reqData);//"http://192.168.1.105:8080/remotedesktop/RemoteDesktopControl"
			System.out.println("----respData----:"+respData);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
 