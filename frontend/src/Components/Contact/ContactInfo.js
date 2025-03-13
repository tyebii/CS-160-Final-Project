import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-300  p-6 mt-8 mb-0 w-full">
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Social Media Links */}
        <div className="flex flex-col items-center space-y-2">
          <p className="font-semibold">Follow Us</p>
          <div className="flex space-x-4">
            {/*Wrap with <a> tag to add links later*/}
            <FaFacebook className="text-2xl cursor-pointer hover:text-blue-600" />
            <FaInstagram className="text-2xl cursor-pointer hover:text-pink-500" />
            <FaPinterest className="text-2xl cursor-pointer hover:text-red-600" />
            <FaYoutube className="text-2xl cursor-pointer hover:text-red-500" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-right">
          <p>
            <strong>Company Number:</strong> XXX-XXX-XXXX
          </p>
          <p>
            <strong>Company Email:</strong> OFS@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;