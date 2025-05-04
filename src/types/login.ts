import { InferType, object, ref, string } from "yup";

export const loginShema = object({
  email: string().required("email.required"),
});

export type ILogin = InferType<typeof loginShema>;

export const registerShema = object({
  email: string().required("El correo es requerido").email("Correo inválido"),
  password: string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  passwordConfirm: string()
    .required("Confirmar contraseña es requerido")
    .oneOf([ref("password")], "Las contraseñas no coinciden"),
  name: string().required("El nombre es requerido"),
});

export type IRegister = InferType<typeof registerShema>;
