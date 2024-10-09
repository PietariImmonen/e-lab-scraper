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
import { signUp } from "@/auth/firebase/actions";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/use-auth-context";

const validationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

type FormData = z.infer<typeof validationSchema>;

const SignUpCard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { checkUserSession, user } = useAuthContext();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await signUp(data);
      router.push(paths.dashboard.root);
      await checkUserSession?.();
      // Handle successful sign-up (e.g., redirect to dashboard)
    } catch (err) {
      setError("An error occurred during sign-up. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      router.push(paths.dashboard.root);
    }
  }, [user, router]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Enter your email and password to sign up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Separator className="my-4" />
        <div className="text-sm text-center">
          <Link
            href={paths.auth.login}
            className="text-blue-500 hover:underline"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpCard;
