import React from "react";

const ChartCard = ({ title, children, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {children}
        </div>
    )
}

export default ChartCard;