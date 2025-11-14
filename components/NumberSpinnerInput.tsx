// components/NumberSpinnerInput.tsx
import React, { useCallback, useState, useEffect } from 'react'; // Added useState, useEffect

interface NumberSpinnerInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
  className?: string;
}

const NumberSpinnerInput: React.FC<NumberSpinnerInputProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  ariaLabel,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toString()); // Internal state for user input text

  // Effect to sync internal displayValue with external value prop
  useEffect(() => {
    // Only update if the external value is different from what's currently being displayed
    // or if the internal displayValue is empty/invalid (e.g., after blur cleanup)
    if (parseFloat(displayValue) !== value || isNaN(parseFloat(displayValue))) {
      setDisplayValue(value.toString());
    }
  }, [value]); // Depend on external value

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Update internal state directly as user types
    setDisplayValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    let parsedValue = parseInt(displayValue, 10);

    if (isNaN(parsedValue)) {
      parsedValue = min; // Default to min if input is empty or invalid after blur
    }

    // Apply min/max constraints
    parsedValue = Math.max(min, Math.min(max, parsedValue));

    // Only call onChange if the value has actually changed, to avoid unnecessary re-renders
    if (parsedValue !== value) {
      onChange(parsedValue);
    }
    // Also, ensure the displayValue reflects the validated number after blur
    // This is important if user typed e.g. "abc" and it defaulted to min
    setDisplayValue(parsedValue.toString());
  }, [displayValue, value, min, max, onChange]);

  const handleIncrement = useCallback(() => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
    setDisplayValue(newValue.toString()); // Update internal display as well
  }, [value, max, step, onChange]);

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
    setDisplayValue(newValue.toString()); // Update internal display as well
  }, [value, min, step, onChange]);

  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
          aria-label={`Decrease ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <input
          type="text" // Changed to text to allow freer input, then parse to int
          inputMode="numeric" // Suggest numeric keyboard on mobile
          pattern="[0-9]*" // Provide a pattern for browsers to suggest number input
          id={id}
          className="w-full text-center px-2 py-2 text-gray-800 text-lg border-x border-gray-300 focus:outline-none"
          value={displayValue} // Bind to internal displayValue
          onChange={handleInputChange} // Handle input text changes
          onBlur={handleBlur} // Validate and submit on blur
          min={min}
          max={max}
          required
          aria-label={ariaLabel || label}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
          aria-label={`Increase ${label}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NumberSpinnerInput;