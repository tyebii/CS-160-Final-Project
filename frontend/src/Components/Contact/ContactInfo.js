import {

  FaFacebook,

  FaInstagram,

  FaPinterest,

  FaYoutube,

} from "react-icons/fa";


// Contact That Goes At The Bottom Of Every Page
const Footer = () => {

  return (

    <section className="bg-white border-t border-gray-200 p-6 w-full shadow-sm">

      <div className="container mx-auto flex flex-col justify-between items-center gap-6">

        <div className="flex flex-col items-center space-y-3">

          <p className="font-semibold text-gray-800">Follow Us</p>

          <div className="flex space-x-4">

            <a href="#" aria-label="Facebook">

              <FaFacebook className="text-xl text-gray-500 hover:text-blue-600 transition duration-300" />

            </a>

            <a href="#" aria-label="Instagram">

              <FaInstagram className="text-xl text-gray-500 hover:text-pink-500 transition duration-300" />

            </a>

            <a href="#" aria-label="Pinterest">

              <FaPinterest className="text-xl text-gray-500 hover:text-red-600 transition duration-300" />

            </a>

            <a href="#" aria-label="YouTube">

              <FaYoutube className="text-xl text-gray-500 hover:text-red-500 transition duration-300" />

            </a>

          </div>

        </div>

        <div className="text-center space-y-1 text-gray-700 text-sm">

          <p>

            <strong>Company Number:</strong> 1 (XXX) XXX-XXXX

          </p>

          <p>

            <strong>Company Email:</strong> <a href="mailto:OFS@gmail.com" className="underline hover:text-blue-600 transition">OFS@gmail.com</a>
          
          </p>

        </div>

      </div>

    </section>

  );

};

export default Footer;
