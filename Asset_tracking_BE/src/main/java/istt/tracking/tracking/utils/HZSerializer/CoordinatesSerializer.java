package istt.tracking.tracking.utils.HZSerializer;

import java.io.IOException;

import com.hazelcast.nio.ObjectDataInput;
import com.hazelcast.nio.ObjectDataOutput;
import com.hazelcast.nio.serialization.DataSerializable;

import istt.tracking.tracking.entity.Coordinates;

public class CoordinatesSerializer implements DataSerializable {

	private Coordinates coordinates;

	@Override
	public void writeData(ObjectDataOutput out) throws IOException {
		out.writeString(coordinates.getCoordinatesId());
		out.writeString(coordinates.getDwellTime());
		out.writeString(coordinates.getLocation());
		out.writeObject(coordinates.getZoneEntered());
		out.writeObject(coordinates.getPoint());
		out.writeObject(coordinates.getTracker());
	}

	@Override
	public void readData(ObjectDataInput in) throws IOException {
		coordinates = new Coordinates();
		coordinates.setCoordinatesId(in.readString());
		coordinates.setDwellTime(in.readString());
		coordinates.setLocation(in.readString());
		coordinates.setZoneEntered(in.readObject());
		coordinates.setPoint(in.readObject());
		coordinates.setTracker(in.readObject());
	}

	public Coordinates getCoordinates() {
		return coordinates;
	}

	public void setCoordinates(Coordinates coordinates) {
		this.coordinates = coordinates;
	}
}
