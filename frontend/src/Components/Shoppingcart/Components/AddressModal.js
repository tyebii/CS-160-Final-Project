import React, { useState, useEffect } from 'react';

import axios from 'axios';

const MAPBOX_TOKEN = "pk.eyJ1IjoibWF0dGhld2RlbHVyaW8iLCJhIjoiY205Yzc5ODkwMG9pYzJtcTEweXVncnhraiJ9.fLo2x7rTBbss2-K6O4hBrQ";

//Address Input
export const AddressModal = ({ submitHandle, onCancel, onClose }) => {

  const [input, setInput] = useState('');

  const [suggestions, setSuggestions] = useState([]);

  const [ignoreNextInputChange, setIgnoreNextInputChange] = useState(false);

  //Fetches The Suggestions Of Mapbox
  useEffect(() => {

    if (ignoreNextInputChange) return;

    const fetchSuggestions = async () => {

      if (input.length < 3) return;

      try {

        const response = await axios.get(

          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`,

          {

            params: {

              access_token: MAPBOX_TOKEN,

              autocomplete: true,

              limit: 5,

              country: 'us',

              bbox: [-121.9433, 37.2001, -121.7059, 37.4542],

            },

          }

        );

        setSuggestions(response.data.features);

      } catch (err) {

        console.error('Mapbox autocomplete failed:', err);

      }

    };

    const timeout = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(timeout);

  }, [input, ignoreNextInputChange]);

  return (

    <section className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">

        <div className="flex justify-end">

          <button

            className="text-3xl font-bold text-gray-600 hover:text-black"

            onClick={onClose}

            aria-label="Close"

          >

            &times;

          </button>

        </div>

        <form onSubmit={submitHandle} className="space-y-5" autoComplete="off">

          <div>

            <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">

              Name

            </label>

            <input

              type="text"

              id="Name"

              name="Name"

              minLength={2}

              maxLength={255}

              placeholder="Custom Name"

              className="w-full border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              
              required

              autoComplete="off"

            />

          </div>

          <div className="relative">

            <label htmlFor="Address" className="block text-sm font-medium text-gray-700 mb-1">

              Address (San Jose Only)

            </label>
            
            <input

              type="text"

              id="Address"

              name="Address"

              value={input}

              onChange={(e) => {

                if (!ignoreNextInputChange) {

                  setInput(e.target.value);

                }

                setIgnoreNextInputChange(false);

              }}

              placeholder="Start typing your address..."

              className="w-full border border-gray-300 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              
              required

              autoComplete="off"

            />

            {suggestions.length > 0 && (

              <ul className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded-md shadow-md max-h-48 overflow-auto z-10">
                
                {suggestions.map((sugg) => (

                  <li

                    key={sugg.id}

                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"

                    onClick={() => {

                      setIgnoreNextInputChange(true); 

                      setInput(sugg.place_name);

                      setSuggestions([]); 
      
                    }}

                  >

                    {sugg.place_name}

                  </li>

                ))}

              </ul>

            )}

          </div>

          <div className="flex justify-between pt-6">

            <button

              type="submit"

              className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow"
            
            >

              Submit

            </button>

            <button

              type="button"

              className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow"
              
              onClick={onCancel}

            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </section>

  );
  
};
