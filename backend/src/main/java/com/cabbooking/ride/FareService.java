package com.cabbooking.ride;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class FareService {
    private static final Map<CabCategory, BigDecimal> BASE = Map.of(
        CabCategory.MINI,new BigDecimal("40.00"), CabCategory.SEDAN,new BigDecimal("60.00"), CabCategory.SUV,new BigDecimal("90.00"));
    private static final Map<CabCategory, BigDecimal> PER_KM = Map.of(
        CabCategory.MINI,new BigDecimal("12.00"), CabCategory.SEDAN,new BigDecimal("16.00"), CabCategory.SUV,new BigDecimal("22.00"));
    private static final BigDecimal PER_MINUTE=new BigDecimal("0.50");
    public BigDecimal estimate(double km,int minutes,CabCategory category) {
        return BASE.get(category).add(PER_KM.get(category).multiply(BigDecimal.valueOf(km)))
                .add(PER_MINUTE.multiply(BigDecimal.valueOf(minutes))).setScale(2, RoundingMode.HALF_UP);
    }
}
