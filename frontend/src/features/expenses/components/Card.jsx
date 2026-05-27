import React from 'react'

function Card({ title, description, image, amount }) {
  return (
    <div className="card-container  flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 w-70 h-30 shadow-sm">

      {/* Icon Section */}
      <div className="card-left  p-3 rounded-2xl w-fit h-fit">
        {image}
      </div>

      {/* Text Section */}
      <div className="card-right flex flex-col">

        {/* Small Top Text */}
        <p className="text-sm text-gray-500 font-medium">
          {title}
        </p>

        {/* Main Amount */}
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          ₹{amount.toFixed(2)}
        </h1>

        {/* Bottom Small Text */}
        <p className="text-xs text-green-500 mt-1">
          {description}
        </p>

      </div>

    </div>
  )
}

export default Card