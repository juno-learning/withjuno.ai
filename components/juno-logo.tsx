import Image from "next/image";

export function JunoLogo() {
  return (
    <>
      <Image
        src="/logos/juno-logo-light.svg"
        alt="Juno AI"
        width={341}
        height={105}
        className="h-6 w-auto block dark:hidden"
        priority
      />
      <Image
        src="/logos/juno-logo-dark.svg"
        alt="Juno AI"
        width={341}
        height={105}
        className="h-6 w-auto hidden dark:block"
        priority
      />
    </>
  );
}
