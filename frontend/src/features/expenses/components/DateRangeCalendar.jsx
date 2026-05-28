import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  useMemo,
  useState
} from "react";

const weekDays = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa"
];

function formatDate(date) {

  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1).padStart(2, "0");

  const day =
    String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(date) {

  const [
    year,
    month,
    day
  ] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function isSameDate(firstDate, secondDate) {

  return firstDate?.toDateString() === secondDate?.toDateString();
}

function DateRangeCalendar({
  startDate,
  endDate,
  onRangeChange
}) {

  const [visibleMonth, setVisibleMonth] =
    useState(() => startDate ? parseDate(startDate) : new Date());

  const calendarDays =
    useMemo(() => {

      const year =
        visibleMonth.getFullYear();

      const month =
        visibleMonth.getMonth();

      const firstDay =
        new Date(year, month, 1);

      const lastDay =
        new Date(year, month + 1, 0);

      const leadingDays =
        firstDay.getDay();

      const days = [];

      for (let index = 0; index < leadingDays; index += 1) {

        days.push(null);
      }

      for (let day = 1; day <= lastDay.getDate(); day += 1) {

        days.push(new Date(year, month, day));
      }

      return days;

    }, [visibleMonth]);

  function goToPreviousMonth() {

    setVisibleMonth(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() - 1,
        1
      )
    );
  }

  function goToNextMonth() {

    setVisibleMonth(
      new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        1
      )
    );
  }

  function handleDateClick(date) {

    if (!startDate || endDate) {

      onRangeChange(
        formatDate(date),
        ""
      );

      return;
    }

    const selectedStart =
      parseDate(startDate);

    if (date < selectedStart) {

      onRangeChange(
        formatDate(date),
        formatDate(selectedStart)
      );

      return;
    }

    onRangeChange(
      startDate,
      formatDate(date)
    );
  }

  const selectedStartDate =
    startDate ? parseDate(startDate) : null;

  const selectedEndDate =
    endDate ? parseDate(endDate) : null;

  const monthLabel =
    visibleMonth.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );

  return (

    <div
      className="
        absolute
        right-0
        z-20
        mt-3
        w-[21rem]
        rounded-2xl
        border border-gray-100
        bg-white
        p-4
        shadow-2xl shadow-gray-200/70
      "
    >

      <div className="flex items-center justify-between mb-4">

        <button
          type="button"
          onClick={goToPreviousMonth}
          className="
            h-9 w-9
            rounded-full
            text-gray-500
            hover:bg-gray-100
            transition
            flex items-center justify-center
          "
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="text-sm font-semibold text-gray-800">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={goToNextMonth}
          className="
            h-9 w-9
            rounded-full
            text-gray-500
            hover:bg-gray-100
            transition
            flex items-center justify-center
          "
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">

        {weekDays.map((day) => (

          <div
            key={day}
            className="text-[11px] font-semibold uppercase text-gray-400"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((date, index) => {

          if (!date) {

            return (
              <div
                key={`empty-${index}`}
                className="h-10"
              />
            );
          }

          const isStart =
            isSameDate(date, selectedStartDate);

          const isEnd =
            isSameDate(date, selectedEndDate);

          const isBetween =
            selectedStartDate &&
            selectedEndDate &&
            date > selectedStartDate &&
            date < selectedEndDate;

          const isRangeEdge =
            isStart || isEnd;

          return (

            <div
              key={date.toISOString()}
              className={`
                h-10
                flex items-center justify-center
                ${isBetween ? "bg-emerald-50" : ""}
                ${isStart && selectedEndDate ? "rounded-l-full bg-emerald-50" : ""}
                ${isEnd && selectedStartDate ? "rounded-r-full bg-emerald-50" : ""}
              `}
            >
              <button
                type="button"
                onClick={() => handleDateClick(date)}
                className={`
                  h-9 w-9
                  rounded-full
                  text-sm
                  transition
                  ${isRangeEdge
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"}
                `}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}

      </div>

      <div
        className="
          mt-4
          rounded-xl
          bg-gray-50
          px-3 py-2
          text-xs
          text-gray-500
        "
      >
        {startDate && endDate
          ? `${startDate} to ${endDate}`
          : "Select a start date, then an end date."}
      </div>

    </div>
  );
}

export default DateRangeCalendar;
