package jetsennet.jue2.util;

import java.util.UUID;

public class IDGenerator {
	public static String getRandomUuid(){
		return UUID.randomUUID().toString();
	}
	
	public static String getUuid(String seed){
		return UUID.fromString(seed).toString();
	}

	public static String getMtTaskCode() {
		return getRandomUuid();
	}

	public static String getRandomUuid(int i) {
		return getRandomUuid().substring(0, i);
	}
}
