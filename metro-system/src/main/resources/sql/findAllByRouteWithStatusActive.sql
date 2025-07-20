CREATE PROCEDURE sp_FindAllByRouteWithStatusActive
--     @RouteId BIGINT = NULL
AS
BEGIN
    SET NOCOUNT ON;

SELECT
    sr.station_route_id,
    sr.station_id,
    s.station_name,
    sr.route_id,
    r.route_name,
    sr.station_order,
    sr.distance_to_next
FROM station_route sr
         INNER JOIN station s ON sr.station_id = s.station_id AND s.status = 'ACTIVE'
         INNER JOIN route r ON sr.route_id = r.route_id AND r.status = 'ACTIVE'
-- WHERE (@RouteId IS NULL OR sr.route_id = @RouteId)
ORDER BY r.route_name, sr.station_order;
END;
