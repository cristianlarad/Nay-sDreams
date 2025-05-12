import { Separator } from "@/components/ui/separator";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PinIcon as PinterestIcon,
  InstagramIcon as TiktokIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "../ui/userAvatar";
import logo from "../../../public/logo.webp";

const businessInfo = {
  name: "Nay'sDreams",
  description:
    "Transformando tus ideas en realidad a través de la sublimación personalizada.",
  address: "Calle Principal #123, Ciudad",
  phone: "+1 (234) 567-8900",
  email: "info@naysdreams.com",
};

const Footer = () => {
  return (
    <footer className=" border-t border-pink-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and newsletter */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="flex items-center">
              {/* Logo */}
              <UserAvatar imageUrl={logo} />
              <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {businessInfo.name}
              </h2>
            </div>
            <p className="text-gray-600 max-w-md">{businessInfo.description}</p>
            <div className="flex items-center space-x-4 text-pink-600">
              <Link
                to="https://facebook.com"
                className="hover:text-pink-500 transition-colors"
              >
                <FacebookIcon className="h-5 w-5" />
              </Link>
              <Link
                to="https://instagram.com"
                className="hover:text-pink-500 transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                to="https://pinterest.com"
                className="hover:text-pink-500 transition-colors"
              >
                <PinterestIcon className="h-5 w-5" />
              </Link>
              <Link
                to="https://tiktok.com"
                className="hover:text-pink-500 transition-colors"
              >
                <TiktokIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className=" p-6 rounded-lg shadow-sm border border-pink-100">
            <h3 className="text-lg font-medium text-pink-800 mb-3">
              Suscríbete a nuestro boletín
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Recibe inspiración, nuevos diseños y ofertas exclusivas.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-pink-100" />

        {/* Contact information */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start">
            <MapPinIcon className="h-5 w-5 text-pink-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">
              {businessInfo.address}
            </span>
          </div>
          <div className="flex items-start">
            <PhoneIcon className="h-5 w-5 text-pink-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{businessInfo.phone}</span>
          </div>
          <div className="flex items-start">
            <MailIcon className="h-5 w-5 text-pink-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{businessInfo.email}</span>
          </div>
        </div>

        <Separator className="bg-pink-100" />

        {/* Bottom section with copyright */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {businessInfo.name}. Todos los
            derechos reservados.
          </span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-10 left-0 w-16 h-16 rounded-full bg-pink-100 opacity-50"></div>
        <div className="absolute -top-12 left-20 w-24 h-24 rounded-full bg-purple-100 opacity-40"></div>
        <div className="absolute -top-8 right-10 w-20 h-20 rounded-full bg-pink-100 opacity-30"></div>
      </div>
    </footer>
  );
};

export default Footer;
