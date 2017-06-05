
package jetsennet.jppn.bean;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the jetsennet.jppn.bean package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _JppnResultErrorString_QNAME = new QName("http://bean.jppn.jetsennet", "errorString");
    private final static QName _JppnResultResultVal_QNAME = new QName("http://bean.jppn.jetsennet", "resultVal");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: jetsennet.jppn.bean
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link JppnResult }
     * 
     */
    public JppnResult createJppnResult() {
        return new JppnResult();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://bean.jppn.jetsennet", name = "errorString", scope = JppnResult.class)
    public JAXBElement<String> createJppnResultErrorString(String value) {
        return new JAXBElement<String>(_JppnResultErrorString_QNAME, String.class, JppnResult.class, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link String }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://bean.jppn.jetsennet", name = "resultVal", scope = JppnResult.class)
    public JAXBElement<String> createJppnResultResultVal(String value) {
        return new JAXBElement<String>(_JppnResultResultVal_QNAME, String.class, JppnResult.class, value);
    }

}
