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

export const LoginForm = () => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate({ from: "/login" });

  const formSchema = z.object({
    username: z
      .string()
      .min(5, "Usuário deve ter no mínimo 5 caracteres")
      .max(80),
    password: z
      .string()
      .min(5, "Senha deve ter no mínimo 5 caracteres")
      .max(80),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    clearError();

    try {
      await login(values.username, values.password);

      toast.success("Loged in, redirecting!", {});

      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error("Error while login in...", {});
    }
  };

  return (
    <Card className="w-full md:w-100 p-8 shadow-xl">
      <CardHeader className="p-0">
        <div className="flex flex-col w-full items-center justify-center">
          <img alt="Spresso Logo" src="/assets/login-colorized-complete.svg" />
          <p className="font-extralight min-w-fit">Glad to see you here.</p>
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
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="exemple@gmail.com"
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
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="password123"
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
            className="w-full h-12 text-md"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Sign in"}
          </Button>

          <div className="w-full flex items-center gap-3">
            <hr className="border-[.5] border-foreground/50 w-2/5" />
            <p className="font-extralight min-w-fit">new user?</p>
            <hr className="border-[.5] border-foreground/50 w-2/5" />
          </div>

          <Button
            size="lg"
            type="button"
            variant="outline"
            className="w-full h-12 text-md"
            onClick={() => navigate({ to: "/register" })}
            disabled={isLoading}
          >
            Register
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
