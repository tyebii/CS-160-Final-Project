// Import The Social Media Icons 
import {

  FaFacebook,

  FaInstagram,

  FaPinterest,

  FaYoutube,

} from "react-icons/fa";


// Contact Component
const Footer = () => {

  return (

    <section className="bg-white border-t border-gray-200 p-6 w-full shadow-sm">

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start space-y-3">

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

        {/* Divider for mobile view */}
        <div className="w-full border-t border-gray-200 md:hidden"></div>

        {/* Contact Info */}
        <div className="text-center md:text-right space-y-1 text-gray-700 text-sm">

          <p>
            <strong>Company Number:</strong> (XXX) XXX-XXXX
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
