package com.sba301.metro_system.utils;

import java.util.Random;
import java.util.UUID;
import java.util.function.Consumer;

public class Utils {

    public static boolean validateString(String input){
        boolean result = true;
        if (input == null || input.isBlank()) {
            result = false;
        }
        return result;
    }

    public static <T> void updateIfNotEqual(T newValue, T oldValue, Consumer<T> setter) {
        if (newValue != null && !newValue.equals(oldValue)) {
            setter.accept(newValue);
        }
    }

    public static Long generateRandomId() {
        Random random = new Random();
        long code = 10000 + random.nextLong(90000);
        return code;
    }





}
