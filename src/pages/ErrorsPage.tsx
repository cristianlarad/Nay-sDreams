import React from "react";
import { Link } from "react-router-dom";

interface ErrorPageProps {
  message?: string;
  errorCode?: number;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = "Ocurrió un error inesperado",
  errorCode = 500,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">{errorCode}</h1>
          <p className="text-xl text-gray-700 mb-6">{message}</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Volver al Inicio
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
