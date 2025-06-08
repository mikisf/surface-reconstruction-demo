import React from 'react'

const Selector = ({ options = [], value, onChange, label }) => (
    <div className="selector">
        {label && <label>{label}</label>}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
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

export default Selector
