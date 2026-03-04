'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/lib/hooks/useApi";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card, CardBody, CardHeader } from "@/components/common/Card";
import { Alert } from "@/components/common/Alert";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser, setToken } = useAuthStore();
  const [email, setEmail] = useState("admin@restaurant.com");
  const [password, setPassword] = useState("admin123");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : "",
        password: !password ? "Password is required" : "",
      });
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (response: any) => {
          if (response.data) {
            setUser(response.data.user);
            setToken(response.data.token);
            router.push("/dashboard");
          }
        },
        onError: (err: any) => {
          setErrors({
            submit: err.message || "Invalid email or password",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Restaurant System
          </h1>
          <p className="text-primary-100">
            Order Management Platform
          </p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center border-0">
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>
          </CardHeader>

          <CardBody className="space-y-6">
            {errors.submit && (
              <Alert variant="error" description={errors.submit} />
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              Demo Credentials:<br />
              <strong>admin@restaurant.com / admin123</strong><br />
              <strong>waiter@restaurant.com / user123</strong><br />
              <strong>kitchen@restaurant.com / user123</strong>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isPending}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary-600 font-semibold hover:underline">
                Register here
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
