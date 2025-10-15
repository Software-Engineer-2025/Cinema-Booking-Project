import Image from "next/image";
export default function ProfileIcon({ size = 60 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden border"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
      }}
    >
      <Image
        src="/placeholder-profile-image.png"
        alt="Profile"
        width={size}
        height={size}
        className="object-cover"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
