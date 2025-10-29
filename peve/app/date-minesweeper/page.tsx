"use client";

import DateMinesweeper from "@/components/DateMinesweeper";
import { useState } from "react";

export default function DateMinesweeperPage() {
  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);
  const [dateHistory, setDateHistory] = useState<
    Array<{ day: number; month: number; year: number; timestamp: Date }>
  >([]);

  const handleDateSelected = (date: {
    day: number;
    month: number;
    year: number;
  }) => {
    setSelectedDate(date);
    setDateHistory((prev) => [...prev, { ...date, timestamp: new Date() }]);
  };

  const getMonthName = (month: number) => {
    const months = [
      "",
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[month] || "";
  };

  const formatDate = (date: { day: number; month: number; year: number }) => {
    return `${date.day.toString().padStart(2, "0")}/${date.month
      .toString()
      .padStart(2, "0")}/${date.year}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        {/* Componente principal */}
        <div className="mb-8">
          <DateMinesweeper onDateSelected={handleDateSelected} />
        </div>
      </div>
    </div>
  );
}
