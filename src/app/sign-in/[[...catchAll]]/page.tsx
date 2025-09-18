import { ClerkProvider, SignIn } from "@clerk/nextjs";

export default function Signin() {
  return (
    <ClerkProvider
      appearance={{
        theme: "simple",
        variables: {
          colorPrimary: "#6370e3",
          // You might also find a 'colorTextSecondary' variable that influences this,
          // but targeting the element directly is more precise for this specific link.
        },
        elements: {
          componentContainer: {
            border: "1px solid #e5e5e5",
          },
          developmentOrTestModeBox: {
            // Create a new striped gradient with your purple color
            background: `repeating-linear-gradient(-45deg, transparent, transparent 6px, #7c8bff20 6px, #7c8bff20 12px)`,
            border: "1px solid #7c8bff",
          },
          headerTitle: {},
        },
      }}
    >
      <div className="flex justify-center items-center w-[100%] h-[100vh]">
        <SignIn
          routing="path"
          path="/sign-in"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />
        
      </div>
    </ClerkProvider>
  );
}
