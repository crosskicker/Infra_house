import React from "react";
import Select from "react-select";

const customStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

const SelectList = React.forwardRef(
  ({ tab, id, value, onChange, ...props }, ref) => {
    const options = tab.map((val) => ({
      label: val,
      value: val,
    }));

    const selectedOption = options.find((opt) => opt.value === value) || null;

    return (
      <div className="w-28   text-xs">
        <Select
          inputId={id}
          options={options}
          value={selectedOption}
          onChange={onChange}
          ref={ref}
          placeholder="Select"
          styles={customStyles}
          {...props}
        />
      </div>
    );
  }
);

export default SelectList;
