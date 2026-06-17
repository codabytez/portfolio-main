import Image from "next/image";

type AvatarVariant = "1" | "2" | "3";

type AvatarProps = {
  className?: string;
  variant?: AvatarVariant;
  alt?: string;
};

const sources: Record<AvatarVariant, string> = {
  "1": "/avatars/avatar-1.jpg",
  "2": "/avatars/avatar-2.jpg",
  "3": "/avatars/avatar-3.jpg",
};

export default function Avatar({ className, variant = "1", alt = "" }: AvatarProps) {
  return (
    <Image
      src={sources[variant]}
      alt={alt}
      width={36}
      height={36}
      className={["size-[36px] rounded-full object-cover", className].filter(Boolean).join(" ")}
    />
  );
}
