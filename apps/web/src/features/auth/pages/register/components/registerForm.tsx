import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/shared/components/shadcnui/input";
import { Button } from "@/shared/components/shadcnui/button";
import { useAuthStore } from "@/shared/stores/auth.store";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/shadcnui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/shadcnui/field";

import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";

export const RegisterForm = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate({ from: "/register" });

  const formSchema = z.object({
    username: z.string().min(5, "Too Small!").max(80, "Too long!"),
    email: z.string().min(5, "Too Small!").max(80, "Too long!"),
    password: z.string().min(5, "Too Small!").max(80, "Too long!"),
    confirmPassword: z.string().min(5, "Too Small!").max(80, "Too long!"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    clearError();

    try {
      await login(values.username, values.password);

      toast.success("Login realizado!", {});

      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error("Erro ao fazer login", {});
    }
  };

  return (
    <Card className="w-full md:w-100 p-8 shadow-xl">
      <CardHeader className="p-0">
        <div className="flex flex-col w-full items-center justify-center">
          <img alt="Spresso Logo" src="/assets/login-colorized-complete.svg" />
          <p className="font-extralight min-w-fit">Wellcome a bord!</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <form id="form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu email"
                    autoComplete="username"
                    className="h-12 pl-4"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu email"
                    autoComplete="username"
                    className="h-12 pl-4"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Digite seu email"
                    autoComplete="username"
                    className="h-12 pl-4"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Confirm Password</FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm password"
                    autoComplete="current-password"
                    className="h-12 pl-4"
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="p-0">
        <div className="w-full items-center justify-center flex flex-col text-center gap-4">
          <Button
            size="lg"
            type="submit"
            form="form"
            className="w-full text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Sign up"}
          </Button>

          <div className="w-full flex items-center gap-3">
            <hr className="border-[.5] border-foreground/50 w-2/5" />
            <p className="font-extralight min-w-fit">missclick?</p>
            <hr className="border-[.5] border-foreground/50 w-2/5" />
          </div>

          <Button
            size="lg"
            type="button"
            variant="outline"
            className="w-full text-lg"
            onClick={() => navigate({ to: "/login" })}
            disabled={isLoading}
          >
            Back to Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
