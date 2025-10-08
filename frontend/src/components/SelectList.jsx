import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0.75rem", // équivaut à rounded-xl
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // bleu quand focus, gris sinon
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59,130,246,0.3)" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    //backgroundColor: "#f9fafb", // fond gris clair (facultatif)
    minHeight: "2.5rem",
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "0.75rem", // arrondi sur le menu
    overflow: "hidden",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "rgba(59,130,246,0.1)" // bleu léger quand survolé
      : "white",
    color: "black",
    cursor: "pointer",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#374151", // text-gray-700
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
      <div className="w-28 text-xs">
        <Select
          inputId={id}
          options={options}
          value={selectedOption}
          onChange={onChange}
          ref={ref}
          placeholder=""
          styles={customStyles}
          {...props}
        />
      </div>
    );
  }
);

export default SelectList;
