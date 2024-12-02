package istt.tracking.tracking.utils;

import javax.persistence.Converter;

import istt.tracking.tracking.dto.PointDTO;

@Converter(autoApply = true)
public class PointListConverter extends AbstractListConverter<PointDTO> {
	public PointListConverter() {
		super(PointDTO.class);
	}
}
