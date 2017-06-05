package jetsennet.jcom.services.interceptor;

import java.io.FilterWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.util.UUID;

import jetsennet.jcom.util.log.LogMgr;

import org.apache.cxf.interceptor.AbstractLoggingInterceptor;
import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.interceptor.LoggingMessage;
import org.apache.cxf.io.CacheAndWriteOutputStream;
import org.apache.cxf.io.CachedOutputStream;
import org.apache.cxf.io.CachedOutputStreamCallback;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.Phase;
import org.apache.cxf.service.Service;
import org.apache.log4j.Logger;

public class LogInterceptorOut extends AbstractLoggingInterceptor {
	private static final Logger log = Logger.getLogger(LogInterceptorOut.class);
	private static final String LOG_SETUP = LogInterceptorOut.class.getName() + ".log-setup";
	private LogMgr logmgr = null; //存储消息到数据库中
 
 
	 public LogInterceptorOut(String phase) {
	     super(phase);
	 }
	 
	 public LogInterceptorOut() {
	     this(Phase.PRE_STREAM);
	 }    
	 
	 public LogInterceptorOut(int lim) {
	     this();
	     limit = lim;
	 }

	 public LogInterceptorOut(PrintWriter w) {
	     this();
	     this.writer = w;
	 }

	public void handleMessage(Message message) throws Fault {
        final OutputStream os = message.getContent(OutputStream.class);
        final Writer iowriter = message.getContent(Writer.class);
        if (os == null && iowriter == null) {
            return;
        }
        
        if (log.isInfoEnabled()|| writer != null) {
            // Write the output while caching it for the log message
            boolean hasLogged = message.containsKey(LOG_SETUP);
            if (!hasLogged) {
                message.put(LOG_SETUP, Boolean.TRUE);
                if (os != null) {
                    final CacheAndWriteOutputStream newOut = new CacheAndWriteOutputStream(os);
                    if (threshold > 0) {
                        newOut.setThreshold(threshold);
                    }
                  
                    message.setContent(OutputStream.class, newOut);
                    newOut.registerCallback(new LoggingCallback(log, message, os));
                } else {
                    message.setContent(Writer.class, new LogWriter(log, message, iowriter));
                }
            }
        }
    }
    
    private LoggingMessage setupBuffer(Message message) {
        String id = (String)message.getExchange().get(LoggingMessage.ID_KEY);
        if (id == null) {
            id = UUID.randomUUID().toString();
            message.getExchange().put(LoggingMessage.ID_KEY, id);
        }
        final LoggingMessage buffer 
            = new LoggingMessage("Outbound Message\n---------------------------",
                                 id);
        
        Integer responseCode = (Integer)message.get(Message.RESPONSE_CODE);
        if (responseCode != null) {
            buffer.getResponseCode().append(responseCode);
        }
        
        String encoding = (String)message.get(Message.ENCODING);
        if (encoding != null) {
            buffer.getEncoding().append(encoding);
        }            
        String httpMethod = (String)message.get(Message.HTTP_REQUEST_METHOD);
        if (httpMethod != null) {
            buffer.getHttpMethod().append(httpMethod);
        }
        String address = (String)message.get(Message.ENDPOINT_ADDRESS);
        if (address != null) {
            buffer.getAddress().append(address);
            String uri = (String)message.get(Message.REQUEST_URI);
            if (uri != null && !address.startsWith(uri)) {
                if (!address.endsWith("/") && !uri.startsWith("/")) {
                    buffer.getAddress().append("/");
                }
                buffer.getAddress().append(uri);
            }
        }
        String ct = (String)message.get(Message.CONTENT_TYPE);
        if (ct != null) {
            buffer.getContentType().append(ct);
        }
        Object headers = message.get(Message.PROTOCOL_HEADERS);
        if (headers != null) {
            buffer.getHeader().append(headers);
        }
        return buffer;
    }
    
    private class LogWriter extends FilterWriter {
        StringWriter out2;
        int count;
        Logger logger; //NOPMD
        Message message;
        final int lim;
        
        public LogWriter(Logger logger, Message message, Writer writer) {
            super(writer);
            this.logger = logger;
            this.message = message;
            if (!(writer instanceof StringWriter)) {
                out2 = new StringWriter();
            }
            lim = limit == -1 ? Integer.MAX_VALUE : limit;
        }
        public void write(int c) throws IOException {
            super.write(c);
            if (out2 != null && count < lim) {
                out2.write(c);
            }
            count++;
        }
        public void write(char[] cbuf, int off, int len) throws IOException {
            super.write(cbuf, off, len);
            if (out2 != null && count < lim) {
                out2.write(cbuf, off, len);
            }
            count += len;
        }
        public void write(String str, int off, int len) throws IOException {
            super.write(str, off, len);
            if (out2 != null && count < lim) {
                out2.write(str, off, len);
            }
            count += len;
        }
        public void close() throws IOException {
            try {
				LoggingMessage buffer = setupBuffer(message);
				if (count >= lim) {
				    buffer.getMessage().append("(message truncated to " + lim + " bytes)\n");
				}
				StringWriter w2 = out2;
				if (w2 == null) {
				    w2 = (StringWriter)out;
				}
				String ct = (String)message.get(Message.CONTENT_TYPE);
				try {
				    writePayload(buffer.getPayload(), w2, ct); 
				} catch (Exception ex) {
				    //ignore
				}
        
				PrintSOAP(buffer, message);
				message.setContent(Writer.class, out);
				super.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
        }
    }

    protected String formatLoggingMessage(LoggingMessage buffer) {
        return buffer.toString();
    }

    class LoggingCallback implements CachedOutputStreamCallback {
        
        private final Message message;
        private final OutputStream origStream;
        private final Logger logger; //NOPMD
        private final int lim;
        
        public LoggingCallback(final Logger logger, final Message msg, final OutputStream os) {
            this.logger = logger;
            this.message = msg;
            this.origStream = os;
            this.lim = limit == -1 ? Integer.MAX_VALUE : limit;
        }

        public void onFlush(CachedOutputStream cos) {  
            
        }
        
        public void onClose(CachedOutputStream cos) {
            try {
				LoggingMessage buffer = setupBuffer(message);

				String ct = (String)message.get(Message.CONTENT_TYPE);
				if (!isShowBinaryContent() && isBinaryContent(ct)) {
				    buffer.getMessage().append(BINARY_CONTENT_MESSAGE).append('\n');
				    PrintSOAP(buffer, message);
				    return;
				}
				
				if (cos.getTempFile() == null) {
				    //buffer.append("Outbound Message:\n");
				    if (cos.size() >= lim) {
				        buffer.getMessage().append("(message truncated to " + lim + " bytes)\n");
				    }
				} else {
				    buffer.getMessage().append("Outbound Message (saved to tmp file):\n");
				    buffer.getMessage().append("Filename: " + cos.getTempFile().getAbsolutePath() + "\n");
				    if (cos.size() >= lim) {
				        buffer.getMessage().append("(message truncated to " + lim + " bytes)\n");
				    }
				}
				String encoding = (String)message.get(Message.ENCODING);
				writePayload(buffer.getPayload(), cos, encoding, ct); 

				PrintSOAP(buffer, message);
				cos.lockOutputStream();
				cos.resetOut(null, false);
				message.setContent(OutputStream.class, 
				                   origStream);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
    }
    
    /**
     * 输出获取的SOAP
     * 1、SOAP为空不输出
     * 2、调用服务的getServerInfo方法时不输出
     * @throws Exception 
     */
    private void PrintSOAP(LoggingMessage buffer, Message msg) throws Exception{
    	String soapMsg = buffer.getPayload().toString();
    	if (soapMsg != null && !soapMsg.trim().equals("")) {
    		log(buffer,msg);
    		toDb(buffer,msg);
		}
    }

    /**
     * 输出到日志
     * @param buffer
     */
    private void log(LoggingMessage buffer, Message msg){
    	//log.info("返回消息全 = "+buffer.toString());
    	//log.info(buffer.toString());
    	
    	Service service = msg.getExchange().getService();
		String serviceName = service.getName().getLocalPart();
		String serviceCode = (String)msg.getExchange().get(LoggingMessage.ID_KEY);
    	
    	log.info("\n=================output Soap xml【"+ serviceName+ ":" + serviceCode +"】===================\n" 
    			+buffer.getPayload().toString()
    			+"\n===================================================");
    }
    
    /**
     * 将SOAP消息存储到数据库中
     * @param buffer
     * @param msg
     * @throws Exception 
     */
    private void toDb(LoggingMessage buffer, Message msg) throws Exception{
    	Service service = msg.getExchange().getService();
		String serviceName = service.getName().getLocalPart();
		String serviceCode = (String)msg.getExchange().get(LoggingMessage.ID_KEY);
		
		logmgr.insertOrUpdateSoapLog(serviceCode, serviceName, buffer.getPayload().toString());
    }
    
    @Override
    protected java.util.logging.Logger getLogger() {
        return null;
    }

	public LogMgr getLogmgr() {
		return logmgr;
	}

	public void setLogmgr(LogMgr logmgr) {
		this.logmgr = logmgr;
	}
    
    

}
