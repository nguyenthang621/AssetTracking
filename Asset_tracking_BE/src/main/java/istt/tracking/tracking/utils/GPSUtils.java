package istt.tracking.tracking.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.Polygon;
import org.springframework.stereotype.Service;

import istt.tracking.tracking.dto.PointDTO;
import istt.tracking.tracking.entity.Coordinates;
import istt.tracking.tracking.entity.Zone;

@Service
public class GPSUtils {

	private static final double EARTH_RADIUS = 6371;

	public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
		double dLat = Math.toRadians(lat2 - lat1);
		double dLon = Math.toRadians(lon2 - lon1);

		double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1))
				* Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_RADIUS * c;
	}

	public static boolean isPointInPolygon(double[] point, double[][] polygon) {
		GeometryFactory geometryFactory = new GeometryFactory();

		Coordinate[] coordinates = new Coordinate[polygon.length + 1];
		for (int i = 0; i < polygon.length; i++) {
			coordinates[i] = new Coordinate(polygon[i][0], polygon[i][1]);
		}
		coordinates[polygon.length] = new Coordinate(polygon[0][0], polygon[0][1]);

		Polygon poly = geometryFactory.createPolygon(coordinates);

		Point p = geometryFactory.createPoint(new Coordinate(point[0], point[1]));

		return poly.contains(p);
	}

	public static double[][] convertZonesToPolygon(List<PointDTO> CoordinateZones) {
		double[][] polygon = new double[CoordinateZones.size()][2];
		int index = 0;

		for (PointDTO pointDTO : CoordinateZones) {
			polygon[index][0] = pointDTO.getLng();
			polygon[index][1] = pointDTO.getLat();
			index++;
		}

		return polygon;
	}

	public static Set<Zone> isInsideZone(double[] point, Set<Zone> zones) {
		Set<Zone> insideZones = new HashSet<Zone>();

		for (Zone zone : zones) {
			double[][] polygon = convertZonesToPolygon(zone.getCoordinates());

			if (isPointInPolygon(point, polygon)) {

				insideZones.add(zone);
			}
		}
		return insideZones;
	}

	private static final String API_KEY = "a7c1bebba2d24b74a023b62a8a45ea5c";

	public static String getAddressDetail(double lat, double lng) {
		String address = "";
		try {
			String urlString = String.format("https://api.geoapify.com/v1/geocode/reverse?lat=%s&lon=%s&apiKey=%s", lat,
					lng, API_KEY);
			URL url = new URL(urlString);

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");

			BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String inputLine;
			StringBuilder response = new StringBuilder();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			// Parse the JSON response
			JSONObject jsonResponse = new JSONObject(response.toString());
			JSONArray features = jsonResponse.getJSONArray("features");

			if (features.length() > 0) {
				// Access the 'formatted' field inside 'properties'
				JSONObject firstFeature = features.getJSONObject(0);
				JSONObject properties = firstFeature.getJSONObject("properties");
				address = properties.getString("formatted");
			} else {
				address = null;
			}
		} catch (Exception e) {
			e.printStackTrace();
			address = null;
		}

		return address;
	}

	public static String getLocation(Coordinates coordinates) {
		String apiUrl = "http://localhost:5000/find_location";
		HttpURLConnection connection = null;
		StringBuilder result = new StringBuilder();
		final int TIMEOUT = 1200;

		try {
			URL url = new URL(apiUrl);
			connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			connection.setRequestProperty("Content-Type", "application/json; utf-8");
			connection.setRequestProperty("Accept", "application/json");
			connection.setDoOutput(true);
			connection.setConnectTimeout(TIMEOUT);
			connection.setReadTimeout(TIMEOUT);

			String jsonInputString = "{\"point\": {\"lat\": " + coordinates.getPoint().getY() + ", \"lng\": "
					+ coordinates.getPoint().getX() + "}}";

			try (OutputStream os = connection.getOutputStream()) {
				byte[] input = jsonInputString.getBytes("utf-8");
				os.write(input, 0, input.length);
			}

			int statusCode = connection.getResponseCode();
			if (statusCode != HttpURLConnection.HTTP_OK) {
				return null;
			}

			try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"))) {
				String responseLine;
				while ((responseLine = br.readLine()) != null) {
					result.append(responseLine.trim());
				}
			}

		} catch (Exception e) {

			e.printStackTrace();
			return null;
		} finally {
			if (connection != null) {
				connection.disconnect();
			}
		}

		String response = result.toString();
		if (response.isEmpty()) {
			return null;
		}

		return response;
	}

}
