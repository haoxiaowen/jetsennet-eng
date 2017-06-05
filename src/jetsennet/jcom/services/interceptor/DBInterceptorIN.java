package jetsennet.jcom.services.interceptor;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.cxf.message.Message;
import org.apache.cxf.phase.AbstractPhaseInterceptor;
import org.apache.cxf.phase.Phase;
import org.apache.log4j.Logger;

public class DBInterceptorIN extends AbstractPhaseInterceptor<Message> {
    private static final Logger log = Logger.getLogger(DBInterceptorIN.class);
     
    public DBInterceptorIN() {
        super(Phase.RECEIVE);
    }
 
    public void handleMessage(Message message){
         
        try {
            InputStream is = message.getContent(InputStream.class);
           
            BufferedReader in = new BufferedReader(new InputStreamReader(is));
            StringBuffer soap = new StringBuffer();
            String temp = null;
            while((temp = in.readLine()) != null){
            	soap.append(temp);
            }
            
            System.out.println("【******进入消息：】"+soap.toString());
            
            is = new ByteArrayInputStream(soap.toString().getBytes());
             
            if(is != null)
                message.setContent(InputStream.class, is);
        } catch (Exception e) {
            log.error("Error when split original inputStream. CausedBy : "+"\n"+e);
        }
    }
	
}
