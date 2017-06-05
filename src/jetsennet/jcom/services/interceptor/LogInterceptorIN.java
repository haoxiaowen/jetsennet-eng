package jetsennet.jcom.services.interceptor;

import java.io.InputStream;
import java.io.Reader;
import java.io.SequenceInputStream;
import java.util.UUID;

import jetsennet.jcom.util.log.LogMgr;

import org.apache.cxf.helpers.IOUtils;
import org.apache.cxf.interceptor.AbstractLoggingInterceptor;
import org.apache.cxf.interceptor.Fault;
import org.apache.cxf.interceptor.LoggingMessage;
import org.apache.cxf.io.CachedOutputStream;
import org.apache.cxf.io.CachedWriter;
import org.apache.cxf.io.DelegatingInputStream;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.Phase;
import org.apache.cxf.service.Service;
import org.apache.log4j.Logger;
import org.apache.log4j.Priority;

public class LogInterceptorIN extends AbstractLoggingInterceptor {
	private static final Logger log = Logger.getLogger(LogInterceptorIN.class);
	private LogMgr logmgr = null; //存储消息到数据库中
	
	public LogInterceptorIN() {
		super(Phase.RECEIVE);
	}
	
	/**
	 * 拦截器处理内容
	 */
	public void handleMessage(Message message) throws Fault {
        try {
			if (writer != null || log.isEnabledFor(Priority.INFO)) {
			    logging(log, message);
			}
		} catch (Exception e) {
			log.error("拦截SOAP日志报错:" + e.getMessage());
		}
    }

	/**
	 * 获取HTTP请求消息
	 * @param logger
	 * @param message
	 * @throws Exception 
	 */
    protected void logging(Logger logger, Message message) throws Exception {
        if (message.containsKey(LoggingMessage.ID_KEY)) {
            return;
        }
        String id = (String)message.getExchange().get(LoggingMessage.ID_KEY);
        if (id == null) {
            id = UUID.randomUUID().toString();
            message.getExchange().put(LoggingMessage.ID_KEY, id);
        }
        message.put(LoggingMessage.ID_KEY, id);
        final LoggingMessage buffer 
            = new LoggingMessage("Inbound Message\n----------------------------", id);

        if (!Boolean.TRUE.equals(message.get(Message.DECOUPLED_CHANNEL_MESSAGE))) {
            Integer responseCode = (Integer)message.get(Message.RESPONSE_CODE);
            if (responseCode != null) {
                buffer.getResponseCode().append(responseCode);
            }
        }

        String encoding = (String)message.get(Message.ENCODING);

        if (encoding != null) {
            buffer.getEncoding().append(encoding);
        }
        String httpMethod = (String)message.get(Message.HTTP_REQUEST_METHOD);
        if (httpMethod != null) {
            buffer.getHttpMethod().append(httpMethod);
        }
        String ct = (String)message.get(Message.CONTENT_TYPE);
        if (ct != null) {
            buffer.getContentType().append(ct);
        }
        Object headers = message.get(Message.PROTOCOL_HEADERS);

        if (headers != null) {
            buffer.getHeader().append(headers);
        }
        String uri = (String)message.get(Message.REQUEST_URL);
        if (uri == null) {
            String address = (String)message.get(Message.ENDPOINT_ADDRESS);
            uri = (String)message.get(Message.REQUEST_URI);
            if (uri != null && uri.startsWith("/")) {
                if (address != null && !address.startsWith(uri)) {
                    if (address.endsWith("/") && address.length() > 1) {
                        address = address.substring(0, address.length()); 
                    }
                    uri = address + uri;
                }
            } else {
                uri = address;
            }
        } 
        if (uri != null) {
            buffer.getAddress().append(uri);
            String query = (String)message.get(Message.QUERY_STRING);
            if (query != null) {
                buffer.getAddress().append("?").append(query);
            }
        }
        
        if (!isShowBinaryContent() && isBinaryContent(ct)) {
            buffer.getMessage().append(BINARY_CONTENT_MESSAGE).append('\n');
            
            if (buffer.getPayload().toString().indexOf("GetServiceInfo") == -1) {
            	PrintSOAP(buffer,message);
			}
           
            return;
        }
        
        InputStream is = message.getContent(InputStream.class);
        if (is != null) {
            logInputStream(message, is, buffer, encoding, ct);
        } else {
            Reader reader = message.getContent(Reader.class);
            if (reader != null) {
                logReader(message, reader, buffer);
            }
        }
        
        //不截取获取服务信息接口的消息
        if (buffer.getPayload().toString().indexOf("GetServiceInfo") == -1) {
        	
        	PrintSOAP(buffer, message); //输出SOAP日志
		}
    }

    /**
     * 通过字符流读取请求中的SOAP消息
     * @param message
     * @param reader
     * @param buffer
     */
    protected void logReader(Message message, Reader reader, LoggingMessage buffer) {
        try {
            CachedWriter writer = new CachedWriter();
            IOUtils.copyAndCloseInput(reader, writer);
            message.setContent(Reader.class, writer.getReader());
            
            if (writer.getTempFile() != null) {
                //large thing on disk...
                buffer.getMessage().append("\nMessage (saved to tmp file):\n");
                buffer.getMessage().append("Filename: " + writer.getTempFile().getAbsolutePath() + "\n");
            }
            if (writer.size() > limit && limit != -1) {
                buffer.getMessage().append("(message truncated to " + limit + " bytes)\n");
            }
            writer.writeCacheTo(buffer.getPayload(), limit);
        } catch (Exception e) {
            throw new Fault(e);
        }
    }
    
    protected void logInputStream(Message message, InputStream is, LoggingMessage buffer,
                                  String encoding, String ct) {
        CachedOutputStream bos = new CachedOutputStream();
        if (threshold > 0) {
            bos.setThreshold(threshold);
        }
        try {
            // use the appropriate input stream and restore it later
            InputStream bis = is instanceof DelegatingInputStream 
                ? ((DelegatingInputStream)is).getInputStream() : is;
            

            //only copy up to the limit since that's all we need to log
            //we can stream the rest
            IOUtils.copy(bis, bos, limit == -1 ? Integer.MAX_VALUE : limit);
            bos.flush();
            bis = new SequenceInputStream(bos.getInputStream(), bis);
            
            // restore the delegating input stream or the input stream
            if (is instanceof DelegatingInputStream) {
                ((DelegatingInputStream)is).setInputStream(bis);
            } else {
                message.setContent(InputStream.class, bis);
            }

            if (bos.getTempFile() != null) {
                //large thing on disk...
                buffer.getMessage().append("\nMessage (saved to tmp file):\n");
                buffer.getMessage().append("Filename: " + bos.getTempFile().getAbsolutePath() + "\n");
            }
            if (bos.size() > limit && limit != -1) {
                buffer.getMessage().append("(message truncated to " + limit + " bytes)\n");
            }
            writePayload(buffer.getPayload(), bos, encoding, ct); 
                
            bos.close();
        } catch (Exception e) {
            throw new Fault(e);
        }
    }

    protected String formatLoggingMessage(LoggingMessage loggingMessage) {

        return loggingMessage.toString();
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
    
    
    private void log(LoggingMessage buffer, Message msg){
    	Service service = msg.getExchange().getService();
		String serviceName = service.getName().getLocalPart();
		String serviceCode = (String)msg.getExchange().get(LoggingMessage.ID_KEY);
    	///全部消息
        //log.debug(buffer.toString());
    	log.info("\n=================input Soap xml【"+ serviceName+ ":" + serviceCode +"】===================\n"
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
