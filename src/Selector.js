import { useRef } from 'react'

const Selector = ({ options = [], value, onChange, label }) => {
    const lastSelectedRef = useRef(value)

    const handleClick = (e) => {
        const selectedValue = e.target.value
        if (selectedValue === lastSelectedRef.current) {
            onChange(selectedValue)
        }
        lastSelectedRef.current = selectedValue
    }

    const handleChange = (e) => {
        const selectedValue = e.target.value
        lastSelectedRef.current = selectedValue
        onChange(selectedValue)
    }

    // Check if value is in options
    const optionValues = options.map((opt) => opt.value)
    const selectValue = optionValues.includes(value) ? value : lastSelectedRef.current

    return (
        <div className="selector">
            {label && <label>{label}</label>}
            <select
                value={selectValue}
                onClick={handleClick}
                onChange={handleChange}
            >
                {options.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Selector
