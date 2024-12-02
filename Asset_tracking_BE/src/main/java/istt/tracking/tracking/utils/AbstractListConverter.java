package istt.tracking.tracking.utils;

import java.io.IOException;
import java.util.List;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Converter(autoApply = true)
public abstract class AbstractListConverter<T> implements AttributeConverter<List<T>, String> {

	private final ObjectMapper objectMapper = new ObjectMapper();
	private final Class<T> clazz;

	protected AbstractListConverter(Class<T> clazz) {
		this.clazz = clazz;
	}

	@Override
	public String convertToDatabaseColumn(List<T> items) {
		try {
			return objectMapper.writeValueAsString(items);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Error converting List<T> to JSON", e);
		}
	}

	@Override
	public List<T> convertToEntityAttribute(String dbData) {
		try {
			return objectMapper.readValue(dbData,
					objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
		} catch (IOException e) {
			throw new RuntimeException("Error converting JSON to List<T>", e);
		}
	}
}
