"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { paths } from "@/routes/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithPassword } from "@/auth/firebase/actions";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/use-auth-context";

const validationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof validationSchema>;

const SignInCard = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { checkUserSession, user } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await signInWithPassword({
        email: data.email,
        password: data.password,
      });
      await checkUserSession?.();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Unknown error");
    }
    setIsLoading(false);
  });

  useEffect(() => {
    if (user) {
      router.push(paths.dashboard.root);
    }
  }, [user, router]);
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="email"
                placeholder="Email"
                type="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <Button className="w-full mt-4" type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <div className="pt-2">
          <Link
            href={paths.auth.forgotPassword}
            className="text-blue-500 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Separator className="my-4" />
        <div className="text-sm text-center flex flex-col gap-2 items-center justify-center">
          <Link
            href={paths.auth.register}
            className="text-blue-500 hover:underline mt-2"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
