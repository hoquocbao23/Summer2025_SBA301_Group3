package com.sba301.metro_system.dto.response.route;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RouteSummaryResponse {
    private Long id;
    private String routeName;
}
