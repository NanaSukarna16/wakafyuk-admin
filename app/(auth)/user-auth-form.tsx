"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AuthError,
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Loader2 } from "lucide-react";

import { cn, getHttpClient, isEmail } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AxiosError } from "axios";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type ApiError = {
  statusCode: number;
  message: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const isLoginWithEmail = isEmail(username);

  const { isLoading, mutate } = useMutation(
    async () => {
      const auth = getAuth();

      if (isLoginWithEmail) {
        return signInWithEmailAndPassword(auth, username, password);
      }

      const res = await getHttpClient().post("/auth/username_login", {
        username,
        password,
      });

      if (res.status !== 200) {
        throw new Error("Gagal Login. Error di API");
      }

      const token = res.data["token"];

      return signInWithCustomToken(auth, token);
    },
    {
      onSuccess: (userCredential) => {
        alert(`Selamat Datang Kembali , ${userCredential.user.displayName}`);
      },
      onError: (err: AuthError | AxiosError) => {
        if ("response" in err && err.response) {
          const errorResponse = err.response.data as ApiError;
          alert(`Terjad Kesalahan. ${errorResponse.message || ""}`);
        } else {
          alert(`Terjadi Kesalahan, ${err.message || ""}`);
        }
      },
    }
  );

  function buttonLabel() {
    if (username.length <= 4) {
      return "Sign In";
    }

    return isLoginWithEmail ? "Sign in Email" : "Sign in with username";
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    mutate();
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email or username</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="text"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Your password"
              type="password"
              autoCapitalize="none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {buttonLabel()}
          </Button>
        </div>
      </form>
    </div>
  );
}
