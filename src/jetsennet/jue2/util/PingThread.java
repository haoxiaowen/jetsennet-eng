package jetsennet.jue2.util;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@SuppressWarnings("all")
public class PingThread {
	
    public Map doPing(String[] ips){ 
    	if(null == ips){
    		return null;
    	}
    	
    	Map<String,Boolean> pingMap = new HashMap<String,Boolean>();
    	List<Future> fuList = new ArrayList<Future>();
        ExecutorService pool = Executors.newFixedThreadPool(5);
        
        for(int i=0; i<ips.length; i++){
			Callable call = new PingCallable(ips[i]);
        	Future fu = pool.submit(call);
        	fuList.add(fu);
        }
        
    	try {
    		for(int i=0; i<fuList.size(); i++){
	    		Map<String,String> retMap = (Map)fuList.get(i).get();
	    		pingMap.put(retMap.get("ip"), Boolean.valueOf(retMap.get("status")));
    		}
		} catch (Exception e) {
			e.printStackTrace();
		}
        
        //关闭线程池 
        pool.shutdown();
        
        return pingMap;
    }
    
    public static void main(String[] args) {
    	String[] ips = {"10.11.4.70","10.11.4.71","10.11.4.72","10.11.4.73","10.11.4.74","10.11.4.75","10.11.4.76","10.11.4.77","10.11.4.78","10.11.4.79",
    			"10.11.4.80","10.11.4.81","10.11.4.82","10.11.4.83","10.11.4.84","10.11.4.85","10.11.4.86","10.11.4.87","10.11.4.88","10.11.4.89"};
		new PingThread().doPing(ips);
	}
}

@SuppressWarnings("rawtypes")
class PingCallable implements Callable{ 
	private static int timeOut = 3000;//超时应该在3钞以上  
	private String ip = null;
	
    PingCallable(String ip) { 
    	this.ip = ip; 
    }
    
    @Override 
    public Object call() throws Exception {
        boolean status = false;
        Map<String,String> retMap = new HashMap<String,String>();
        
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
            //System.out.println(ip + ":" + status);
        }
        retMap.put("ip", ip);
        retMap.put("status", String.valueOf(status));
    	return retMap;
    }
}
