"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { cn, getHttpClient } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthError, getAuth, signInWithCustomToken } from "firebase/auth";

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({
  className,
  ...props
}: UserRegisterFormProps) {
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>();
  const [email, setEmail] = React.useState<string>();
  const [name, setName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>();

  const { isLoading, mutate } = useMutation(
    async () => {
      const res = await getHttpClient().post("/auth/register", {
        name,
        email,
        phone,
        username,
        password,
      });

      if (res.status !== 201) {
        throw new Error("Gagal resgistrasi user");
      }

      const token = res.data["token"];

      return signInWithCustomToken(getAuth(), token);
    },
    {
      onSuccess: (cred) => {
        alert(`Selamat Datang Kembali , ${cred.user.displayName}`);
      },
      onError: (err: AuthError) => {
        alert(`Terjadi Keselahan , ${err.message}`);
      },
    }
  );

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    mutate();
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Nama lengkap"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              placeholder="Nomor telepon"
              type="tel"
              autoCapitalize="none"
              autoCorrect="off"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Your username"
              type="text"
              autoCapitalize="none"
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
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
