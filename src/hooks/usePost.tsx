import {
  useMutation,
  UseMutationOptions,
  MutationFunction,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface PostVariables<TData> {
  data: TData;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    // Asume que el token se guarda en localStorage con la clave 'authToken'
    // Ajusta la clave si es diferente en tu aplicación.
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
interface BackendErrorPayload {
  error?: string; // La propiedad que esperas
  message?: string; // Otra propiedad común
  // ... otros campos que tu backend pueda enviar en un error
}
interface UsePostHookOptions<
  TData,
  TError = AxiosError<BackendErrorPayload>,
  TResponse = unknown,
  TContext = unknown
> extends Omit<
    UseMutationOptions<TResponse, TError, PostVariables<TData>, TContext>,
    "mutationFn"
  > {
  url: string;
}

const usePost = <
  TData = unknown,
  TError = AxiosError<BackendErrorPayload>,
  TResponse = unknown,
  TContext = unknown
>({
  url,
  onSuccess,
  onError,
  ...otherMutationOptions
}: UsePostHookOptions<TData, TError, TResponse, TContext>) => {
  const mutationFn: MutationFunction<TResponse, PostVariables<TData>> = async ({
    data,
  }) => {
    let requestData: TData | FormData = data;
    let headers = { "Content-Type": "application/json" }; // Default to JSON

    // Check if any value in the data object is a File instance
    let hasFile = false;
    if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if ((data as Record<string, unknown>)[key] instanceof File) {
            hasFile = true;
            break;
          }
        }
      }
    }

    if (hasFile) {
      const formData = new FormData();
      if (typeof data === "object" && data !== null) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = (data as Record<string, unknown>)[key];
            if (value !== undefined && value !== null) {
              // FormData will convert non-File values to string.
              // If it's a File, it's appended as such.
              formData.append(key, value as string | Blob);
            }
          }
        }
      }
      requestData = formData;
      headers = { "Content-Type": "multipart/form-data" }; // Axios will set Content-Type for FormData automatically
    }

    const response = await axiosInstance.post<TResponse>(url, requestData, {
      headers,
    });
    return response.data;
  };

  return useMutation<TResponse, TError, PostVariables<TData>, TContext>({
    mutationFn: mutationFn,
    onSuccess,
    onError,
    ...otherMutationOptions,
  });
};

export default usePost;
