package com.sba301.metro_system.dto.request.route;

import java.util.List;

public record PathDTO(
        List<Long> stations,
        double totalDistance
) {

}
