package com.cabbooking.ride;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class FareServiceTest {
    private final FareService service=new FareService();
    @Test void calculatesMiniFare() {
        assertEquals(new BigDecimal("190.00"),service.estimate(10,60,CabCategory.MINI));
    }
    @Test void suvCostsMoreThanMini() {
        assertTrue(service.estimate(10,30,CabCategory.SUV).compareTo(service.estimate(10,30,CabCategory.MINI))>0);
    }
}
