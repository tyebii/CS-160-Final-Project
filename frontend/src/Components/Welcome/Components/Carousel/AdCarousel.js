import { useState, useEffect } from "react"

import {

    FaChevronRight, FaChevronLeft

} from "react-icons/fa";

export default function AdCarousel({
    children: slides,
    autoSlide = false,
    autoSlideInterval = 6000,
}) {
    const [index, setIndex] = useState(0)

    const prev = () =>
        setIndex((index) => (index === 0 ? slides.length - 1 : index - 1))
    const next = () =>
        setIndex((index) => (index === slides.length - 1 ? 0 : index + 1))

    useEffect(() => {
        if (!autoSlide) return
        const slideInterval = setInterval(next, autoSlideInterval)
        return () => clearInterval(slideInterval)
    }, [])

    return (
        <div className="overflow-hidden relative rounded-lg">

            {/* slide container */}
            <div
                className="flex transition-transform ease-out duration-500"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {slides}
            </div>
            
            <div className="absolute z-10 inset-0 flex items-center justify-between p-4">
                <button
                    onClick={prev}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
                >
                    <FaChevronLeft size={40} />
                </button>
                <button
                    onClick={next}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
                >
                    <FaChevronRight size={40} />
                </button>
            </div>

            <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <div
                            className={`transition-all w-3 h-3 bg-white rounded-full ${index === i ? "p-2" : "bg-opacity-50"}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}