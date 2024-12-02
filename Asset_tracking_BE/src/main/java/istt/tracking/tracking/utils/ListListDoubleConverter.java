package istt.tracking.tracking.utils;

import java.io.IOException;
import java.util.List;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

@Converter(autoApply = true)
public class ListListDoubleConverter implements AttributeConverter<List<List<Double>>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<List<Double>> attribute) {
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting List<List<Double>> to JSON", e);
        }
    }

    @Override
    public List<List<Double>> convertToEntityAttribute(String dbData) {
        try {
            JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, Double.class);
            return objectMapper.readValue(dbData, type);
        } catch (IOException e) {
            throw new RuntimeException("Error converting JSON to List<List<Double>>", e);
        }
    }
}
