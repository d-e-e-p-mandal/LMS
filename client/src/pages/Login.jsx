import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerUser, { isLoading: registerIsLoading }] =
    useRegisterUserMutation();
  const [loginUser, { isLoading: loginIsLoading }] =
    useLoginUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const toggleRole = () => {
    setSignupInput((prev) => ({
      ...prev,
      role: prev.role === "student" ? "instructor" : "student",
    }));
  };

  // ================= SIGNUP (AUTO LOGIN VIA COOKIE) =================
  const handleSignup = async () => {
    try {
      const res = await registerUser({
        name: signupInput.name,
        email: signupInput.email,
        password: signupInput.password,
        role: signupInput.role,
      }).unwrap();

      toast.success(res?.message || "Account created");

      // backend already logged in user (cookie set)
      if (res?.user?.role === "instructor") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      toast.error(err?.data?.message || "Signup failed");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {
    try {
      const res = await loginUser(loginInput).unwrap();
      toast.success(res?.message || "Login successful");

      if (res?.user?.role === "instructor") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>

        {/* ---------- SIGNUP ---------- */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={signupInput.name}
                onChange={(e) => changeInputHandler(e, "signup")}
              />

              <Label>Email</Label>
              <Input
                name="email"
                value={signupInput.email}
                onChange={(e) => changeInputHandler(e, "signup")}
              />

              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-2 top-2.5"
                >
                  {showSignupPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <span
                onClick={toggleRole}
                className="text-blue-600 cursor-pointer text-sm"
              >
                {signupInput.role === "student"
                  ? "Are you an Instructor?"
                  : "Are you a Student?"}
              </span>
            </CardContent>

            <CardFooter>
              <Button disabled={registerIsLoading} onClick={handleSignup}>
                {registerIsLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ---------- LOGIN ---------- */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                value={loginInput.email}
                onChange={(e) => changeInputHandler(e, "login")}
              />

              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2 top-2.5"
                >
                  {showLoginPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </CardContent>

            <CardFooter>
              <Button disabled={loginIsLoading} onClick={handleLogin}>
                {loginIsLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;