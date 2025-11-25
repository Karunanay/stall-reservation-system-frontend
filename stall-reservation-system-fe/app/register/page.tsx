
"use client";

import { Flex, Text, TextField, Button, Card, Container, Select, Grid, Box } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !email || !phoneNumber || !companyName || !password || !confirmPassword) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phoneNumber,
          companyName,
          password,
          role: "VENDOR",
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("Registration successful!");
        login(data.data.token, data.data);
        router.push('/');
      } else {
        toast.error(data.data || "Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="2">
      <Flex direction="column" justify="center" style={{ minHeight: '100vh' }}>
        <Card>
          <form onSubmit={handleRegister}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">Register</Text>

              <Grid columns={{ initial: '1', sm: '2' }} gap="4">
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

                {/* Empty div to push password fields to next row */}
                <Box display={{ initial: 'none', sm: 'block' }} />
                
                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">Password</Text>
                  <TextField.Root placeholder="Create a password" type="password" name="password" required />
                </Flex>

                <Flex direction="column" gap="2">
                  <Text size="2" weight="bold">Re-enter Password</Text>
                  <TextField.Root placeholder="Confirm your password" type="password" name="confirmPassword" required />
                </Flex>
              </Grid>

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
