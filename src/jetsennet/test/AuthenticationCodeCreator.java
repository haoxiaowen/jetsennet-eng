package jetsennet.test;

import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;
import java.util.Set;

public class AuthenticationCodeCreator {
	
	private static SimpleDateFormat format = new  SimpleDateFormat("yyMMdd");
	
	private static char[] keys = {
		'0','1','2','3','4','5','6','7','8','9'
	};
	
	private static char[] values = {
		'F','g','a','I','s','m','L','M','n','O'
	};
	
	private static char[] sps = {
		'b','c','d','e','f','h','i','j',
		'k','l','o','p','q','r','t',
		'u','v','w','x','y','z',
		'A','B','C','D','E','G','H','J',
		'K','N','P','Q','R','S','T',
		'U','V','W','X','Y','Z'
	};
	
//	private static char[] sps = {
//		'a','b','c','d','e','f','g','h','i','j',
//		'k','l','m','n','o','p','q','r','s','t',
//		'u','v','w','x','y','z',
//		'A','B','C','D','E','F','G','H','I','J',
//		'K','L','M','N','O','P','Q','R','S','T',
//		'U','V','W','X','Y','Z'
//	};
	public static class Encryption{
		
		private String source;
		
		public Encryption(String source){
			this.source = source;
		}
		
		private char getSplit(Random rd){
			int index = rd.nextInt(sps.length);
			return sps[index];
		}
		
		//��λ����
		public Encryption exchange(){
			int len = this.source.length();
			String str1 = this.source.substring(0, len/2);
			String str2 = this.source.substring(len/2);
			StringBuilder sb = new StringBuilder(this.source.length());
			char[] ca1 = str1.toCharArray();
			char[] ca2 = str2.toCharArray();
			int ca2Len = ca2.length;
			int index1 = 0;
			int index2 = ca1.length - 1;
			while(index1 < ca2Len || index2 > 0){
				if(index1 < ca2Len){
					sb.append(ca2[index1++]);
				}
				if(index2 >= 0){
					sb.append(ca1[index2--]);
				}
			}
			this.source = sb.toString();
			return this;
		}
		
		//�ַ������ʾ
		public Encryption toIndexString(){
			Map<String, List<Integer>> items = new HashMap<String, List<Integer>>();
			char[] array = this.source.toCharArray();
			for (int i = 0,len = array.length; i < len; i++) {
				char ch = array[i];
				String str = String.valueOf(ch);
				List<Integer> item = null;
				if(!items.containsKey(str)){
					item =  new ArrayList<Integer>(5);
					items.put(str,item);
				} else {
					item = items.get(str);
				}
				item.add(i);
			}
			StringBuilder sb = new StringBuilder(30);
			Set<Entry<String,List<Integer>>> entrySet = items.entrySet();
			for (Entry<String, List<Integer>> entry : entrySet) {
				String key = entry.getKey();
				List<Integer> value = entry.getValue();
				sb.append(key).append(value.size());
				for (Integer val : value) {
					sb.append(val).append('|');
				}
			}
			this.source = sb.toString();
			return this;
		}
		
		public Encryption replaceKeys(){
			for (int i = 0,len = keys.length; i < len; i++) {
				this.source = this.source.replace(keys[i], values[i]);
			}
			char[] charArray = this.source.toCharArray();
			Random rd = new Random();
			for (int i = 0,len = charArray.length; i < len; i++) {
				if(charArray[i] == '|'){
					charArray[i] = getSplit(rd);
				}
			}
			this.source = new String(charArray);
			return this;
		}
		
		public String getResult(){
			return this.source;
		}
		
	}
	
	private static Date addDay(Date date,int count){
		GregorianCalendar gc=new GregorianCalendar(); 
		gc.setTime(date); 
		gc.add(GregorianCalendar.DAY_OF_MONTH,count); 
		return gc.getTime();
	}
	
	private static String replaceZero(String str){
		char[] charArray = str.toCharArray();
		for (int i = 0, len = charArray.length; i < len; i++) {
			if(charArray[i] == '0'){
				charArray[i] = '|';
			} else {
				break;
			}
		}
		return new String(charArray);
	}
	
	public static String getLongCode(Date date,int atime){
		String regString = format.format(date);
		String tarString = format.format(addDay(date,atime));
		Encryption ec = new Encryption(regString + tarString);
		ec.exchange().toIndexString().replaceKeys();
		return ec.getResult();
	}
	
	public static String getShortCode(Date date,int atime){
		String regString = format.format(date);
		NumberFormat nf = NumberFormat.getInstance();  
        nf.setGroupingUsed(false);  
        nf.setMaximumIntegerDigits(6);  
        nf.setMinimumIntegerDigits(6);  
        String tarString = replaceZero(nf.format(atime));
        Encryption ec = new Encryption(regString + tarString);
        ec.exchange();
        ec.replaceKeys();
		return ec.getResult();
	}
	
	public static void main(String[] args) throws ParseException {
		Date d1 = format.parse("170407");
		System.out.println(getShortCode(d1,7));
	}
}
