package jetsennet.jue2.util;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

public class ClassUtil {

	public static <T> void classFieldNullToEmpty(Object obj) throws Exception {

		if (null == obj) {

			throw new NullPointerException();
		}

		Field[] fields = obj.getClass().getDeclaredFields();

		Class superClass = obj.getClass().getSuperclass();

		List<Field> newFields = Arrays.asList(fields);
		

		if (null != superClass) {

			List<Field> newSuperClasFields = Arrays.asList(superClass
					.getDeclaredFields());

			for (Iterator iterator = newSuperClasFields.iterator(); iterator
					.hasNext();) {

				Field field = (Field) iterator.next();

				field.setAccessible(true);
				
				if(String.class==field.getType()){
					
					if(null == field.get(obj)){
						
						field.set(obj, "");
					}else{
						
						field.set(obj,((String)field.get(obj)).trim());
						
					}
				}
		
			}

		}

		for (Iterator iterator = newFields.iterator(); iterator.hasNext();) {

			Field field = (Field) iterator.next();

			field.setAccessible(true);

			if(String.class==field.getType()){
				
				if(null == field.get(obj)){
					
					field.set(obj, "");
				}else{
					
					field.set(obj,((String)field.get(obj)).trim());
					
				}
			}	

		}
	}
	
	public static <T> void classFieldNullToEmptyEX(Object obj) throws Exception {

		if (null == obj) {

			throw new NullPointerException();
		}

		Field[] fields = obj.getClass().getDeclaredFields();

		Class superClass = obj.getClass().getSuperclass();

		List<Field> newFields = Arrays.asList(fields);
		

		if (null != superClass) {

			List<Field> newSuperClasFields = Arrays.asList(superClass
					.getDeclaredFields());

			for (Iterator iterator = newSuperClasFields.iterator(); iterator.hasNext();) {

				Field field = (Field) iterator.next();

				field.setAccessible(true);
				
				if(String.class==field.getType()){
					
					if("" .equals(field.get(obj)) ){
						field.set(obj, null);
					}else if(null!=field.get(obj)){
						
						field.set(obj,((String)field.get(obj)).trim());
						
					}
				}
		
			}

		}

		for (Iterator iterator = newFields.iterator(); iterator.hasNext();) {

			Field field = (Field) iterator.next();

			field.setAccessible(true);

			if(String.class==field.getType()){
				
				if("" .equals(field.get(obj)) ){
					
					field.set(obj, null);
				}else if(null!=field.get(obj)){
					
					field.set(obj,((String)field.get(obj)).trim());
					
				}
			}	

		}
	}
	
	

	public static void displayProPertiesAndValues(Object obj) throws Exception {

		if (null == obj) {

			throw new NullPointerException();
		}

		Field[] fields = obj.getClass().getDeclaredFields();

		Class superClass = obj.getClass().getSuperclass();

		List<Field> newFields = Arrays.asList(fields);
		

		if (null != superClass) {

			List<Field> newSuperClasFields = Arrays.asList(superClass.getDeclaredFields());

			for (Iterator iterator = newSuperClasFields.iterator(); iterator.hasNext();) {

				Field field = (Field) iterator.next();

				field.setAccessible(true);
				
				System.out.println(field.getName() + " : " + field.get(obj) );
			}

		}

		for (Iterator iterator = newFields.iterator(); iterator.hasNext();) {

			Field field = (Field) iterator.next();

			field.setAccessible(true);
			
			System.out.println(field.getName() + " : " + field.get(obj) );

		}
	}
	
	public static void main(String [] args){
		
		Person p1 = new Person();	
		p1.setName("");
			
		try {
			ClassUtil.classFieldNullToEmptyEX(p1);
			
			System.out.println(p1.getName()==null);
			
			System.out.println( " wangwu ");
		} catch (Exception e) {
		
			e.printStackTrace();
		}
		
	
		
	}		
	
}
	
	
class Person {
		  
		  private String name ;

		public void setName(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
		
}

	  
	  

