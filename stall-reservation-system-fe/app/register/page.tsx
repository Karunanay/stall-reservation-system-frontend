"use client";

import { Flex, Text, TextField, Button, Card, Container, Select, Callout } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const companyName = formData.get("companyName") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!fullName || !email || !phoneNumber || !companyName || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.split('@')[0], // Using part of email as username since it was removed from form
          email,
          password,
          fullName,
          phoneNumber,
          companyName,
          role
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        login(data.data.token, data.data);
        router.push('/reservations');
      } else {
        // Display the specific error message from the backend (e.g., weak password, existing email)
        setError(data.data || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="1">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '80vh', padding: '2rem 0' }}>
        <Card size="4" style={{ width: '100%' }}>
          <form onSubmit={handleRegister}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">Register</Text>
              
              {error && (
                <Callout.Root color="red">
                  <Callout.Icon>
                    <ExclamationTriangleIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    {error}
                  </Callout.Text>
                </Callout.Root>
              )}

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Full Name</Text>
                <TextField.Root placeholder="Enter your name" name="fullName" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Email</Text>
                <TextField.Root placeholder="Enter your email" type="email" name="email" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Phone Number</Text>
                <TextField.Root placeholder="+94771234570" type="tel" name="phoneNumber" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Company Name</Text>
                <TextField.Root placeholder="Enter company name" name="companyName" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Role</Text>
                <Select.Root defaultValue="VENDOR" name="role">
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="VENDOR">Vendor</Select.Item>
                    <Select.Item value="PUBLISHER">Publisher</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Password</Text>
                <TextField.Root placeholder="Create a password" type="password" name="password" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Re-enter Password</Text>
                <TextField.Root placeholder="Confirm your password" type="password" name="confirmPassword" required />
              </Flex>

              <Button size="3" type="submit" mt="2" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

              <Text size="2" align="center">
                Already have an account? <Link href="/login" style={{ color: 'var(--accent-9)' }}>Login</Link>
              </Text>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}