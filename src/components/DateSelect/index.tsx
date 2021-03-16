import { Button, Select } from "evergreen-ui";
import React, { ChangeEvent } from "react";

import { currentYear } from "utils/date";

export const DateSelect = ({
  day,
  month,
  year,
  setDay,
  setMonth,
  setYear,
  disabled,
}: {
  disabled?: boolean;
  day: number | null;
  month: number | null;
  year: number | null;
  setDay: React.Dispatch<React.SetStateAction<number | null>>;
  setMonth: React.Dispatch<React.SetStateAction<number | null>>;
  setYear: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return (
    <>
      <Select
        disabled={disabled}
        marginRight={8}
        value={day ?? ""}
        onChange={(event: ChangeEvent) => {
          // @ts-ignore
          setDay(event.target.value ?? null);
        }}
      >
        <option value="">Day</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
        <option value={8}>8</option>
        <option value={9}>9</option>
        <option value={10}>10</option>
        <option value={11}>11</option>
        <option value={12}>12</option>
        <option value={13}>13</option>
        <option value={14}>14</option>
        <option value={15}>15</option>
        <option value={16}>16</option>
        <option value={17}>17</option>
        <option value={18}>18</option>
        <option value={19}>19</option>
        <option value={20}>20</option>
        <option value={21}>21</option>
        <option value={22}>22</option>
        <option value={23}>23</option>
        <option value={24}>24</option>
        <option value={25}>25</option>
        <option value={26}>26</option>
        <option value={27}>27</option>
        <option value={28}>28</option>
        <option value={29}>29</option>
        <option value={30}>30</option>
        <option value={31}>31</option>
      </Select>
      <Select
        disabled={disabled}
        marginRight={8}
        value={month ?? ""}
        onChange={(event: ChangeEvent) => {
          // @ts-ignore
          setMonth(event.target.value ?? null);
        }}
      >
        <option value="">Month</option>
        <option value={1}>January</option>
        <option value={2}>February</option>
        <option value={3}>March</option>
        <option value={4}>April</option>
        <option value={5}>May</option>
        <option value={6}>June</option>
        <option value={7}>July</option>
        <option value={8}>August</option>
        <option value={9}>September</option>
        <option value={10}>October</option>
        <option value={11}>November</option>
        <option value={12}>December</option>
      </Select>
      <Select
        disabled={disabled}
        marginRight={8}
        value={year ?? ""}
        onChange={(event: ChangeEvent) => {
          // @ts-ignore
          setYear(event.target.value ?? null);
        }}
      >
        <option value="">Year</option>
        {Array.from(Array(1000).keys()).map((integer) => (
          <option key={currentYear() - integer} value={currentYear() - integer}>
            {currentYear() - integer}
          </option>
        ))}
      </Select>
      {!disabled && (
        <Button
          appearance="minimal"
          onClick={() => {
            setDay(null);
            setMonth(null);
            setYear(null);
          }}
        >
          Clear
        </Button>
      )}
    </>
  );
};
