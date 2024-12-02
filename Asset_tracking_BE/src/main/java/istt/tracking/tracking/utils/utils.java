package istt.tracking.tracking.utils;

import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

public class utils {
	public static String genUUID() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
	public static class DateRange {
		private Date startDate;
		private Date endDate;

		public DateRange(Date startDate, Date endDate) {
			this.startDate = startDate;
			this.endDate = endDate;
		}
		public DateRange() {
		}

		public Date getStartDate() {
			return startDate;
		}

		public Date getEndDate() {
			return endDate;
		}

		@Override
		public String toString() {
			return "DateRange{" + "startDate=" + startDate + ", endDate=" + endDate
					+ '}';
		}
	}
	
	public static DateRange getCurrentWeek() {
		Calendar calendar = Calendar.getInstance();
        Date today = calendar.getTime();
        calendar.add(Calendar.DAY_OF_YEAR, -7);
        Date sevenDaysBefore = calendar.getTime();

		return new DateRange(sevenDaysBefore,today);
	}
}
