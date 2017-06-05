package jetsennet.jue2.util;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class PingUtil {
	private static final int timeOut = 3000; //超时应该在3钞以上  
	
    public static boolean isPing(String ip)  
    {
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
    
    public static void main(String[] args) {
    	boolean ret = PingUtil.isPing("192.168.1.1");
    	System.out.println(ret);
    	
    	for(int i=1; i<=10; i++){
    		String ip = "192.168.1." + i;
        	ret = PingUtil.isPing(ip);
        	System.out.println(ip + ":" +ret);
    	}
	}
}
