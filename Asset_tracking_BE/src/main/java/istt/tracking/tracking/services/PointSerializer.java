package istt.tracking.tracking.services;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.vividsolutions.jts.geom.Point;

import io.jsonwebtoken.io.IOException;

@Component
public class PointSerializer extends JsonSerializer<Point> {
    @Override
    public void serialize(Point value, JsonGenerator gen, SerializerProvider serializers) throws IOException, java.io.IOException {
        gen.writeStartObject();
        gen.writeNumberField("x", value.getX());
        gen.writeNumberField("y", value.getY());
        gen.writeEndObject();
    }
}
