package jetsennet.jcom.services.interceptor;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.io.IOUtils;
import org.apache.cxf.io.CachedOutputStream;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.AbstractPhaseInterceptor;
import org.apache.cxf.phase.Phase;
import org.apache.log4j.Logger;

public class DBInterceptorOut extends AbstractPhaseInterceptor<Message> {
	    private static final Logger log = Logger.getLogger(DBInterceptorIN.class);
	     
	    public DBInterceptorOut() {
	        super(Phase.PRE_STREAM);
	    }
	 
	    public void handleMessage(Message message){
	         
	        try {
	        	OutputStream os = message.getContent(OutputStream.class); 
	        	 
	            CachedStream cs = new CachedStream(); 
	 
	            message.setContent(OutputStream.class, cs); 
	 
	            
	 
	            CachedOutputStream csnew = (CachedOutputStream) message.getContent(OutputStream.class); 
	            InputStream in = csnew.getInputStream(); 
	             
	            String xml = IOUtils.toString(in); 
	            System.out.println("【***********出去消息：】" + xml);
	             
	            //这里对xml做处理，处理完后同理，写回流中 
	            IOUtils.copy(new ByteArrayInputStream(xml.getBytes()), os); 
	             
	            cs.close(); 
	            os.flush(); 
	 
	            message.setContent(OutputStream.class, os); 
	            message.getInterceptorChain().doIntercept(message); 
	        } catch (Exception e) {
	            log.error("Error when split original inputStream. CausedBy : "+"\n"+e);
	        }
	    }
}

class CachedStream extends CachedOutputStream { 
	 
    public CachedStream() { 

        super(); 

    } 

    protected void doFlush() throws IOException { 

        currentStream.flush(); 

    } 

    protected void doClose() throws IOException { 

    } 

    protected void onWrite() throws IOException { 

    } 

} 
